import SQLiteDB from '../sqlite/index.js'
import Mode from '../mode/index.js'
import path from 'path'
import { resolve } from 'dns';

const __dirname = path.resolve();
let dbPath = path.join(__dirname + "/config/data.db")

const tableName = 'routes'

// 创建数据库连接
const db = new SQLiteDB(dbPath)
const mode = new Mode(tableName, db)
const apiMode = new Mode('apis', db)

// 创建表字段
const columns = [
  { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
  { name: 'name', type: 'TEXT' }, // 接口类型名称
  { name: 'tableName', type: 'TEXT' }, // 表名称
  { name: 'path', type: 'TEXT' }, // 接口路径
  { name: 'desc', type: 'TEXT' }, // 接口类型描述
  { name: 'status', type: 'TEXT' , default: '1' }, // 1 启用 0 禁用
  { name: 'createTime', type: 'TEXT' }, // 创建时间
  { name: 'updateTime', type: 'TEXT' }, // 更新时间
]

// 创建表
db.createTable(tableName, columns)

function generateRandomString() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const length = 12;

  // 生成以字母开头的第一个字符
  const firstChar = characters.charAt(Math.floor(Math.random() * 52));
  result += firstChar;

  // 生成剩余字符
  while (result.length < length) {
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    if (!result.includes(randomChar)) {
      result += randomChar;
    }
  }

  return result;
}

// 处理返回结果
function handleRes (err, res, type = 1) {
  let data = {}
  if (type == 1) {
    data = res;
  } else if (type == 2) {
    data = !err ? { list: res.data, total: res.total, totalPages: res.totalPages } : null
  } else if (type == 3) {
    data = res.data.length ? res.data[0] : null
  }

  return {
    code: !err ? 200 : 400,
    data,
    msg: !err ? 'ok' : (err.msg || err.code)
  }
}

export default class urlController {
  /**
   * 新增
   * @param {Context} ctx
   */
  static async create(ctx) {
    let params = ctx.request.body
    params.path = generateRandomString()
    // console.log('params-generateRandomString:', params.path);
    
    // 插入数据
    let [err, res] = await mode.create(params)

    let pid = res.id;

    // 新增5个默认api
    let apiConfs = [
      { pid, desc: '新增', apiName: '新增', path: `/${params.path}/create`, method: 'post', query: '', params: '', handler: '', canEdit: '0' },
      { pid, desc: '查询', apiName: '查询', path: `/${params.path}/getData`, method: 'get', query: '', params: '', handler: '', canEdit: '0' },
      { pid, desc: '详情', apiName: '详情', path: `/${params.path}/getDetails`, method: 'get', query: '', params: '', handler: '', canEdit: '0' },
      { pid, desc: '更新', apiName: '更新', path: `/${params.path}/update`, method: 'post', query: '', params: '', handler: '', canEdit: '0' },
      { pid, desc: '删除', apiName: '删除', path: `/${params.path}/delete`, method: 'post', query: '', params: '', handler: '', canEdit: '0' },
    ]
    let apis = []
    apiConfs.forEach(conf => {
      apis.push(createApi(conf))
    })
    async function createApi (conf) {
      let [err, res] = await apiMode.create(conf)
      return res;
    }
    await Promise.all(apis);
    ctx.body = handleRes(err, res, '1')

    return {apiConfs, tableName: params.tableName}
  }

  /**
   * 更新
   * @param {Context} ctx
   */
  static async update(ctx) {
    let params = ctx.request.body

    // 更新数据
    let [err, res] = await mode.update(params)

    ctx.body = handleRes(err, res, 1)
  }

  /**
   * 获取列表
   * @param {*} param
   */
  static async getData(ctx) {
    const query = ctx.request.query
    let [err, res] = await mode.getData(query)
    ctx.body = handleRes(err, res, 2)
  }

  /**
   * 获取详情
   * @param {*} param
   */
  static async getDetails(ctx) {
    const query = {
      ...ctx.request.query,
      page: 1,
      pageSize: 1
    }

    let [err, res] = await mode.getData(query)

    ctx.body = handleRes(err, res, 3)
  }

  /**
   * 删除列表数据
   * @param {Context} ctx
   */
  static async delete(ctx) {
    let params = ctx.request.body
    // 删除数据
    let [err, res] = await mode.delete(params)

    ctx.body = handleRes(err, res)
  }

  /**
   * 拓展接口
   */

  /**
   * 获取列表，包含子级
   * @param {*} param
   */
  static async getAllData(ctx) {
    const query = ctx.request.query
    let [err, res] = await mode.getData(query)

    let count = 0;
    while(count<res.data.length) {
      let row = res.data[count]
      await getChild(row)
      count++
    }

    async function getChild (row) {
      return new Promise(resolve=>{
        let sql = `SELECT * FROM apis WHERE pid = ${row.id}`
        db.executeQuery(sql, [], (rows)=>{
          rows.tableName = row.tableName
          row.children = rows
          resolve(true)
        })
      })
    }

    ctx.body = handleRes(err, res, 2)
  }
}

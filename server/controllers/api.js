import SQLiteDB from '../sqlite/index.js'
import Mode from '../mode/index.js'
import path from 'path'

const __dirname = path.resolve();
let dbPath = path.join(__dirname + "/config/data.db")

const tableName = 'apis'

// 创建数据库连接
const db = new SQLiteDB(dbPath)
const mode = new Mode(tableName, db)

// 创建表字段
const columns = [
  { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
  { name: 'pid', type: 'TEXT', default: '0' }, // 父级id
  { name: 'tableName', type: 'TEXT' }, // 表名
  { name: 'desc', type: 'TEXT' }, // 接口类型描述
  { name: 'apiName', type: 'TEXT' }, // 接口名称
  { name: 'path', type: 'TEXT' }, // 接口路径
  { name: 'method', type: 'TEXT' }, // 接口请求方式
  { name: 'query', type: 'TEXT' }, // 接口query参数
  { name: 'params', type: 'TEXT' }, // 接口params参数
  { name: 'response', type: 'TEXT' }, // 接口响应
  { name: 'handler', type: 'TEXT' }, // 自定义接口逻辑
  { name: 'canEdit', type: 'TEXT', default: '1' }, // 是否可编辑 1 是 0 否
  { name: 'status', type: 'TEXT' , default: '1' }, // 1 启用 0 禁用
  { name: 'createTime', type: 'TEXT' }, // 创建时间
  { name: 'updateTime', type: 'TEXT' }, // 更新时间
]

// 创建表
db.createTable(tableName, columns)

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
    // 插入数据
    let [err, res] = await mode.create(params)

    ctx.body = handleRes(err, res, '1')
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
}

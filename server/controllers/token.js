import SQLiteDB from '../sqlite/index.js'
import Mode from '../mode/index.js'
import path from 'path'

const __dirname = path.resolve();
let dbPath = path.join(__dirname + "/config/data.db")
let apiKey = process.env.APIKEY || ''

const tableName = 'tokens'

// 创建数据库连接
const db = new SQLiteDB(dbPath)
const mode = new Mode(tableName, db)

// 创建表字段
const columns = [
  { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
  { name: 'token', type: 'TEXT' }, // 名称
  { name: 'userId', type: 'TEXT' }, // 用户id
  { name: 'status', type: 'TEXT' , default: '1' }, // 1 启用 0 禁用
  { name: 'delstatus', type: 'TEXT', default: '0' }, // 1 已删除 0 未删除
  { name: 'createTime', type: 'TEXT' }, // 创建时间
  { name: 'updateTime', type: 'TEXT' }, // 更新时间
]
// 创建表
db.createTable(tableName, columns)

export default class urlController {
  /**
   * 新增
   * @param {Context} ctx
   */
  static async create(ctx) {
    let params = ctx.request.body
    // 插入数据
    let [err, res] = await mode.create(params)

    ctx.body = {
      code: !err ? 200 : 400,
      data: res,
      msg: !err ? 'ok' : (err.msg || err.code)
    }
  }

  /**
   * 更新
   * @param {Context} ctx
   */
  static async update(ctx) {
    let params = ctx.request.body
    // 更新数据
    let [err, res] = await mode.update(params)
    ctx.body = {
      code: !err ? 200 : 400,
      data: res,
      msg: !err ? 'ok' : (err.msg || err.code)
    }
  }
  /**
   * 获取列表
   * @param {*} param
   */
  static async getData(ctx) {
    const query = ctx.request.query
    let [err, res] = await mode.getData(query)
    let { data=[], total=0, totalPages=0 } = res || {};
    let result = {
      code: !err ? 200 : 400,
      data: !err ? {
        list: data,
        total,
        totalPages
      } : null,
      msg: !err ? 'ok' : (err.msg || err.code)
    }
    ctx.body = result
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
    let { data=[], total=0, totalPages=0 } = res || {};

    let result = {
      code: !err ? 200 : 400,
      data: data.length ? data[0] : null,
      msg: !err ? 'ok' : (err.msg || err.code)
    }
    ctx.body = result
  }
  /**
   * 删除列表数据
   * @param {Context} ctx
   * @memberof rustController
   */
  static async delete(ctx) {
    let params = ctx.request.body
    // 删除数据
    let [err, res] = await mode.delete(params)
    ctx.body = {
      code: !err ? 200 : 400,
      data: null,
      msg: !err ? 'ok' : (err.msg || err.code)
    }
  }

  /**
   * 额外接口
   */
  static async getDatas(ctx) {
    const query = ctx.request.query
    let { data: list, total, totalPages } = await mode.getData(query)

    list.forEach(async item => {
      // let res = await urlController.getData({ parentId: item.id })
      // item.childre = res.data.list
      // console.log('resres:', res)

      item.children = []
    });

    let result = {
      code: 200,
      data: {
        list,
        total,
        totalPages
      },
      msg: 'ok'
    }
    ctx.body = result
  }
  
  /**
   * 额外接口
   * 通过code新增、更新
   */
  static async updateUrl(ctx) {
    // 偷懒了，直接在这这里拦截校验apiKey
    let key = ctx.request?.query?.apiKey || ctx.request?.body?.apiKey || '';
    console.log('key:',key, 'apiKey:', apiKey)
    if (key == apiKey) {
        console.log('校验通过')
    } else {
        ctx.response.body = {
            code: 400,
            data: null,
            msg: 'apiKey校验失败, 请到容器/app/config.js，或者映射目录中，或者容器日志中寻找apiKey'
        }
        return
    }

    const query = ctx.request.body
    let [err, res] = await mode.getData(
      {
        code: query.code,
        page: 1,
        pageSize: 1
      }
    )

    function getUrl(url='', isHttps=false) {
      if(url.indexOf('http') > -1) {
        return url
      } else {
        if(isHttps) {
          return `https://${url}`
        } else {
          return `http://${url}`
        }
      }
    }
    let { data=[], total, totalPages } = res || {}
    if (data.length == 0) { // 新增
      let params = {
        parentId: query.parentId || '',
        name: query.code,
        url:  getUrl(query.url),
        icon: query.icon,
        code: query.code,
      }
      // 插入数据
      let [err, res] = await mode.create(params)
      ctx.body = {
        code: !err ? 200 : 400,
        data: res,
        msg: !err ? 'ok' : (err.msg || err.code)
      }
    } else { // 更新
      let params = {
        id: data[0].id,
        url: getUrl(query.url)
      }
      // 更新数据
      let [err, res] = await mode.update(params)
      ctx.body = {
        code: !err ? 200 : 400,
        data: res,
        msg: !err ? 'ok' : (err.msg || err.code)
      }
    }
  }
}

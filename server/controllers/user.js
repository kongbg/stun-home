import SQLiteDB from '../sqlite/index.js'
import Mode from '../mode/index.js'
import path from 'path'
import crypto from 'crypto'
import { generateToken } from '../utils/token.js'
import { expiresIn, notBefore } from '../config/configs.js'

const __dirname = path.resolve();
let dbPath = path.join(__dirname + "/config/data.db")

const tableName = 'users'

// 创建数据库连接
const db = new SQLiteDB(dbPath)
const mode = new Mode(tableName, db)
const tokenMode = new Mode('tokens', db)

// 创建表字段
const columns = [
  { name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' },
  { name: 'userName', type: 'TEXT' }, // 名称
  { name: 'nick', type: 'TEXT' }, // 昵称
  { name: 'passWord', type: 'TEXT' }, // 密码
  { name: 'face', type: 'TEXT' }, // 图标
  { name: 'status', type: 'TEXT' , default: '1' }, // 1 启用 0 禁用
  { name: 'delstatus', type: 'TEXT', default: '0' }, // 1 已删除 0 未删除
  { name: 'createTime', type: 'TEXT' }, // 创建时间
  { name: 'updateTime', type: 'TEXT' }, // 更新时间
]
// 创建表
db.createTable(tableName, columns)
// 创建默认账号admin
addAdmin()

async function addAdmin() {
  let [err, res] = await mode.getData({userName: 'admin'})
  if (!err) {
    if (res.data.length == 0) {
      const defaultPassWord = 'admin.'
      const md5 = crypto.createHash('md5')
      const md52 = crypto.createHash('md5')
      let passWord = md5.update(defaultPassWord).digest('hex');
      let encryptedPassword = md52.update(passWord).digest('hex');

      mode.create(
        {
          userName: 'admin',
          nick: 'admin',
          passWord: encryptedPassword,
          face: ''
        }
      )
    }
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
   * 额外接口
   * 登录
   */
  static async login(ctx) {
    let params = ctx.request.body;
    let result = {}
    const hash = crypto.createHash('md5')
    hash.update(params.passWord);
    const encryptedPassword = hash.digest('hex');

    let [err, res] = await mode.getData(
      {
        userName: params.userName,
        passWord: encryptedPassword,
        page: 1,
        pageSize: 1
      }
    )

    if (!err && res.data.length) {
      // 生成token
      let userInfo = {
        id: res.data[0].id,
        userName: res.data[0].userName,
        nick: res.data[0].nick
      }

      let token = generateToken(userInfo)

      // 保存token
      tokenMode.create({
        token: token,
        userId: res.data[0].id
      })

      result = {
        code: 200,
        data: {
          token,
          notBefore,
          expiresIn
        },
        msg: 'ok'
      }

    } else {
      result = {
        code: 400,
        data: null,
        msg: '用户名或密码不正确'
      }
    }
    ctx.body = result
  }

  /**
   * 获取用户信息
   * @param {*} param
   */
  static async getUserInfo(ctx) {
    let token = ctx.request.header.authorization.replace('Bearer ', '')
    const query = {
      token,
      page: 1,
      pageSize: 1
    }

    let [err, res] = await tokenMode.getData(query)
    let { data=[], total=0, totalPages=0 } = res || {};

    let userId = data[0].userId
    const query2 = {
      id: userId,
      page: 1,
      pageSize: 1
    }
    let [err2, res2] = await mode.getData(query2)

    let userInfo = res2.data.length ? res2.data[0] : null
    userInfo && delete userInfo.passWord

    let result = {
      code: !err2 ? 200 : 400,
      data: userInfo,
      msg: !err2 ? 'ok' : (err2.msg || err2.code)
    }
    ctx.body = result
  }

  /**
   * 退出登录
   * @param {*} param
   */
  static async logout(ctx) {
    let token = ctx.request.header.authorization.replace('Bearer ', '')
    const query = {
      token,
      page: 1,
      pageSize: 1
    }

    let [err, res] = await tokenMode.getData(query)
    let { data=[], total=0, totalPages=0 } = res || {};

    let id = data[0].id
    const query2 = {
      id
    }
    let [err2, res2] = await tokenMode.delete(query2)

    let result = {
      code: !err2 ? 200 : 400,
      data: null,
      msg: !err2 ? 'ok' : (err2.msg || err2.code)
    }
    ctx.body = result
  }
}

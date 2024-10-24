import Router from "koa-router";
import path from "path";
import SQLiteDB from "../sqlite/index.js";
import Mode from "../mode/index.js";
import user from './user.js'
import model from './model.js'
import route from './route.js'
import api from './api.js'
import vm from "vm";
import apiController from '../controllers/api.js'
import routeController from '../controllers/route.js'
import { generateRandomString } from '../utils/index.js'

const __dirname = path.resolve();
let dbPath = path.join(__dirname + "/config/data.db");
// 创建数据库连接
const db = new SQLiteDB(dbPath);
const router = new Router();

await initRoute()

// 处理返回结果
function handleRes(err, res, type = 1) {
  let data = {};
  if (type == 1) {
    data = res;
  } else if (type == 2) {
    data = !err
      ? { list: res.data, total: res.total, totalPages: res.totalPages }
      : null;
  } else if (type == 3) {
    data = res.data.length ? res.data[0] : null;
  }

  return {
    code: !err ? 200 : 400,
    data,
    msg: !err ? "ok" : err.msg || err.code,
  };
}

// 初始化动态路由
async function initRoute () {
  const apiMode = new Mode("apis", db);
  let [err, res] = await apiMode.getData({canEdit: 1});
  if (!res) res={data:[]}

  // 接口按树形结构分层
  let apiMap = {}
  res.data.forEach(item => {
    let { pid, } = item
    if (apiMap[pid]) {
      apiMap[pid].children.push(item)
    } else {
      apiMap[pid] = {...item}
      apiMap[pid].children = [{...item}]
    }
  })
  Object.keys(apiMap).forEach(key => {
    let item = apiMap[key]

    const { path, tableName, children } = item;
    let tableMode = new Mode(tableName, db);
    // 默认注册路由
    // 增
    router.post(`/api/${path}/create`, async (ctx) => {
      let params = ctx.request.body;
      // 插入数据
      let [err, res] = await tableMode.create(params);
      ctx.body = handleRes(err, res, 1);
    });
    // 列表查寻
    router.get(`/api/${path}/getData`, async (ctx) => {
      let query = ctx.request.query;
      let [err, res] = await tableMode.getData(query);
      ctx.body = handleRes(err, res, 2);
    });
    // 列表详情
    router.get(`/api/${path}/getDetails`, async (ctx) => {
      let query = {
        ...ctx.request.query,
        page: 1,
        pageSize: 1,
      };
      let [err, res] = await tableMode.getData(query);
      ctx.body = handleRes(err, res, 3);
    });
    // 更新
    router.post(`/api/${path}/update`, async (ctx) => {
      let params = ctx.request.body;
      // 更新数据
      let [err, res] = await tableMode.update(params);
      ctx.body = handleRes(err, res, 1);
    });
    // 删除
    router.post(`/api/${path}/delete`, async (ctx) => {
      let params = ctx.request.body;
      // 删除数据
      let [err, res] = await tableMode.delete(params);
      ctx.body = handleRes(err, res);
    });

    children.forEach(child => {
      regRoute(child)
    })
  })
}

// 动态注册路由
function regRoute (params) {
  let { method, handler, path: url, tableName } = params
  let tableMode = new Mode(tableName, db);
  console.log('动态注册路由');
  
  // handler 示例
  // handler = `async function handler(ctx) {
  //         const query = ctx.request.query
  //         let [err, res] = await mode.getData(query)
  //         ctx.body = handleRes(err, res, 2)
  // }`;
  if (!handler) {
    handler = `async function handler(ctx) {
          const query = ctx.request.query || {}
          const params = ctx.request.body || {}
          ctx.body = {
            code: 200,
            data: {
              query,
              params
            },
            msg: '路由注册成功，请完善逻辑'
          }
    }`;
  }

  const sandbox = {mode:tableMode, handleRes};
  vm.createContext(sandbox);
  vm.runInContext(handler, sandbox);

  router[method.toLowerCase()](`/api${url}`, async(ctx)=>{
    await sandbox.handler(ctx);
  })
}

// 单独在这里注册新增路由接口，方便调用regRoute来注册新路由
// 新增api
router.post(`/api/apis/create`, async (ctx)=>{
  // console.log('单独在这里注册新增路由接口，方便调用regRoute来注册新路由');
  let params = ctx.request.body
  await apiController.create(ctx)
  regRoute(params)
})
// 新增路由
router.post(`/api/routes/create`, async (ctx)=>{
  console.log('单独在这里注册新增路由接口，方便调用regRoute来注册新路由');
  let { apiConfs, tableName } = await routeController.create(ctx)

  apiConfs.forEach(item=>{
    item.tableName = tableName
    item.url = item.path
    regRoute(item)
  })
})

router.use(user).use(model).use(route).use(api)
export default router;

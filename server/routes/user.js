import Router from 'koa-router'
import controller from '../controllers/user.js'
import tokenController from '../controllers/token.js'

const urlKey = '/users'
const router = new Router({ prefix: '/api' })

// 导航相关
router.post(`${urlKey}/create`,      controller.create) // 新增
router.post(`${urlKey}/update`,      controller.update) // 编辑
router.get(`${urlKey}/getData`,      controller.getData) // 查询列表
router.get(`${urlKey}/getInfo`,      controller.getDetails) // 查询详情
router.post(`${urlKey}/delete`,      controller.delete) // 删除
router.get(`${urlKey}/getDatas`,     controller.getDatas) // 查询列表(带children)

router.post(`${urlKey}/login`,       controller.login) // 登录

export default router.routes()

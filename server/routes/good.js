import Router from 'koa-router'
import controller from '../controllers/good.js'

const urlKey = '/good'
const router = new Router({ prefix: '/api' })

// 导航相关
router.post(`${urlKey}/create`,      controller.create) // 新增
router.post(`${urlKey}/update`,      controller.update) // 编辑
router.get(`${urlKey}/getData`,      controller.getData) // 查询列表
router.get(`${urlKey}/getDetails`,   controller.getDetails) // 查询详情
router.post(`${urlKey}/delete`,      controller.delete) // 删除

export default router.routes()

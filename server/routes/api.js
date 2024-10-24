import Router from 'koa-router'
import controller from '../controllers/api.js'

const urlKey = '/apis'
const router = new Router({ prefix: '/api' })

// router.post(`${urlKey}/create`,      controller.create) // 新增
router.post(`${urlKey}/update`,      controller.update) // 编辑
router.get(`${urlKey}/getData`,      controller.getData) // 查询列表
router.get(`${urlKey}/getDetails`,   controller.getDetails) // 查询详情
router.post(`${urlKey}/delete`,      controller.delete) // 删除

export default router.routes()

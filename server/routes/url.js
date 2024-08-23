import Router from 'koa-router'
import controller from '../controllers/url.js'

const urlKey = '/urls'
const router = new Router({ prefix: '/api' })

// 导航相关
router.post(`${urlKey}/create`,      controller.create) // 新增
router.post(`${urlKey}/update`,      controller.update) // 编辑
router.get(`${urlKey}/getData`,      controller.getData) // 查询列表
router.get(`${urlKey}/getDetails`,   controller.getDetails) // 查询详情
router.post(`${urlKey}/delete`,      controller.delete) // 删除
router.get(`${urlKey}/getDatas`,     controller.getDatas) // 查询列表(带children)

router.post(`${urlKey}/updateUrl`,      controller.updateUrl) // 通过code新增、更新

export default router.routes()

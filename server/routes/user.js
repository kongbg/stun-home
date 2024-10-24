import Router from 'koa-router'
import controller from '../controllers/user.js'

const urlKey = '/users'
const router = new Router({ prefix: '/api' })

// 导航相关
router.post(`${urlKey}/create`,      controller.create) // 新增
router.post(`${urlKey}/update`,      controller.update) // 编辑
router.get(`${urlKey}/getData`,      controller.getData) // 查询列表
router.post(`${urlKey}/delete`,      controller.delete) // 删除
router.get(`${urlKey}/getUserInfo`,  controller.getUserInfo) // 获取用户信息



router.get(`/captchaImage`,          controller.captchaImage) // 获取图片验证码
router.post(`${urlKey}/login`,       controller.login) // 登录
router.get(`${urlKey}/getInfo`,      controller.getDetails) // 查询详情
router.get(`${urlKey}/getRouters`,   controller.getRouters) // 查询详情
router.post(`${urlKey}/logout`,      controller.logout) // 退出登录

export default router.routes()

import Router from 'koa-router'
import navtype from './navtype.js'
import url from './url.js'
import user from './user.js'

const router = new Router()

router.use(navtype)
        .use(url)
        .use(user)
export default router;
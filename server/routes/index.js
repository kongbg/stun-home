import Router from 'koa-router'
import navtype from './navtype.js'
import url from './url.js'
import user from './user.js'
import config from './config.js'
import good from './good.js'

const router = new Router()

router.use(navtype)
        .use(url)
        .use(user)
        .use(config)
        .use(good)
export default router;
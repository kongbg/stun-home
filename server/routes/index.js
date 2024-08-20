import Router from 'koa-router'
import navtype from './navtype.js'
import urls from './urls.js'

const router = new Router()

// router.use(moduleA).use(moduleB).use(moduleC);
router.use(navtype)
        .use(urls)
// router.use(navtype)
export default router;
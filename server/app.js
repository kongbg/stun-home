import Koa  from 'koa';
import koaBody from "koa-body";
import koaStatic from 'koa-static'
import path from 'path'
import fs from 'fs'
import Cors from '@koa/cors'
import jwt from 'koa-jwt'
import appRouter from './routes/index.js'
import { secret } from "./config/configs.js"
import { encryptParams } from './middleware/encryptParams.js'

const app = new Koa();
app.use(Cors())
const __dirname = path.resolve();
app.use(koaStatic(path.join(__dirname + "/server/public")));
app.use(koaStatic(path.join(__dirname + "../web/dist")));
app.use(koaStatic(path.join(__dirname + "../web/assets/")));

app.use(encryptParams())

// 对没有验签通过返回的错误进行拦截处理
app.use(async (ctx, next) => {
    // 如果token没有经过验证中间件会返回401错误，可以通过下面的中间件自定义处理这个错误
    await next().catch((err)=>{
        console.log('err:', err)
        if (401 === err.status) {
            ctx.status = 401;
            ctx.body = {
                data: '没有找到token信息，请检查接口请求头信息'
            };
            console.log("未找到token: "+ err);
        } else {
            console.log(err);
            throw err;
        }
    });
});

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFieldsSize: 10 * 1024 * 1024, // 最大长度
        // uploadDir: path.join(__dirname, "../public"), //这里是你的存放文件的文件夹
        keepExtensions: true, //是否保留扩展名
        multiples: true //是否多选
    }
}));

// 免验证token的白名单
let whiteList = [/^\/api\/users\/login/, /^\/api\/urls\/updateUrl/]
app.use(jwt({ secret }).unless({path: whiteList}));

app.use(appRouter.routes()).use(appRouter.allowedMethods())

app.use((ctx, next) => {
    if(ctx.request.url.includes('/web') || ctx.request.url == '/'){
        ctx.response.type = 'html';
        const filePath = path.join(__dirname, "./web/dist", 'index.html');
        ctx.response.body = fs.readFileSync(filePath, 'utf-8');
    } else if(ctx.request.url.includes('/assets/')){
        // todo 图片
        let obj = {
            'js': 'text/javascript;',
            'css': 'text/css;'
        }
        let name = ctx.request.url.replace('/assets/', '')
        ctx.response.type =  obj[getType(name)]
        const filePath = path.join(__dirname, "./web/dist/assets", name);
        ctx.response.body = fs.readFileSync(filePath, 'utf-8');
        function getType (name) {
            if(name.includes('.js')) {
                return 'js'
            } else if(name.includes('.css')) {
                return 'css'
            }
        }
    } else {
        next()
    }
})

app.listen(3006, ()=>{
    console.log('koa is running in port: 3006')
});
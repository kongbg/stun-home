import Koa  from 'koa';
import koaBody from "koa-body";
import koaStatic from 'koa-static'
import path from 'path'
import fs from 'fs'
import Cors from '@koa/cors'
import appRouter from './routes/index.js'

const app = new Koa();
app.use(Cors())
const __dirname = path.resolve();
app.use(koaStatic(path.join(__dirname + "/server/public")));
app.use(koaStatic(path.join(__dirname + "../web/dist")));
app.use(koaStatic(path.join(__dirname + "../web/assets/")));

app.use(koaBody({
    multipart: true,
    formidable: {
        maxFieldsSize: 10 * 1024 * 1024, // 最大长度
        // uploadDir: path.join(__dirname, "../public"), //这里是你的存放文件的文件夹
        keepExtensions: true, //是否保留扩展名
        multiples: true //是否多选
    }
}));


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
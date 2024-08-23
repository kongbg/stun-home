import { encrypt, decrypt } from '../utils/decrypt.js'

export const encryptParams = () => {
    return async (ctx, next) => {
      // 解密参数
      console.log('query参数:', ctx.request.query)
    //   console.log('body参数:', ctx.request.body)
      if(ctx.request.query) {
        ctx.request.query = decrypt(ctx.request.query.data)
      }
    //   if(ctx.request.body) {
    //     ctx.request.body = decrypt(ctx.request.body.data)
    //   }
      console.log('解密query参数:', ctx.request.query)
    //   console.log('解密body参数:', ctx.request.body)
      await next();
      // 如果需要，可以加密响应数据
      // ...
    };
}
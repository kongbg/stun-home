import { encrypt, decrypt } from '../utils/decrypt.js'

export const encryptParams = () => {
    return async (ctx, next) => {
      // console.log('加密后的数据敏感信息需要加密0:', );
      // console.log('加密后的数据敏感信息需要加密1:', encrypt('敏感信息需要加密'));
      // 解密参数
      // if(ctx.request.query) {
      //   console.log('加密解密', ctx.request.query)
      //   let decryptQuery = decrypt(ctx.request.query.encryptedData, ctx.request.query.iv)
      //   console.log('解密后参数:', decryptQuery)
      //   ctx.request.query = decryptQuery
      //   console.log('解密后参数query:', ctx.request.query)
      // }
      // if(ctx.request.body) {
      //   console.log('加密解密', ctx.request.body.data)
      //   let decryptBody = decrypt(ctx.request.body.data)
      //   console.log('解密后参数:', decryptBody)
      //   ctx.request.body = decryptBody
      //   console.log('解密后参数query:', ctx.request.body)
      // }
      await next();
      // 如果需要，可以加密响应数据
      // ...
    };
}
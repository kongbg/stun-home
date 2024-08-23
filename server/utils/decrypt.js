import crypto from 'crypto'
import { paramsKey } from '../config/configs.js'

// 加密
export const encrypt = (params) => {
    let cipher = crypto.createCipher('aes-256-cbc', paramsKey)
    let crypted = cipher.update(params,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}
// 解密
export const decrypt = (params) => {
    let decipher = crypto.createDecipher('aes-256-cbc', paramsKey)
    let dec = decipher.update(params,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}

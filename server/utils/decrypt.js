import crypto from 'crypto'
import { paramsKey } from '../config/configs.js'

const key = Buffer.from('1234123412ABCDEF', 'hex'); // 十六位十六进制数作为密钥
const iv = Buffer.from('ABCDEF1234123412', 'hex');
// 加密
export const encrypt = (params) => {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(word, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        encryptedData: encrypted.toUpperCase()
    };
}
// 解密
export const decrypt = (word, iv) => {
    let encryptedHexStr = Buffer.from(word, 'hex');
    let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(encryptedHexStr, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

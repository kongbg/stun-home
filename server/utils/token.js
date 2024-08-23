import jwt from 'jsonwebtoken'
import { secret, expiresIn, notBefore } from "../config/configs.js"
// 生成token
export const generateToken = (userInfo) => {
    let token = jwt.sign(userInfo, secret, {
        notBefore,
        expiresIn
    });
    return token;
}

// 验证token
export const verifyToken = (token) => {
    try {
        jwt.verify(token, secret);
        return true;
    } catch (e) {
        return false;
    }
}
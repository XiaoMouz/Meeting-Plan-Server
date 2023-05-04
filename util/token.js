const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const key = require('../config/settings.json').options.tokenSecurityKey


/**
 * Token 加密
 * @param {*} payload 内容
 * @returns 加密后的 token
 */
exports.getToken = (payload) => {
    return jwt.sign(payload, key, { expiresIn: 60 * 60 * 24 })
}

/**
 * Token 解密
 * @param {*} token token
 * @returns 解密后数据
 */
exports.verifyToken = (token) => {
    try {
        if (jwt.verify(token, key)) {
            return { status: 1, data: jwt.decode(token, key) }
        } else {
            return { status: 0, message: "unknown error - code: null" }
        }
    } catch (err) {
        if (err.name == "TokenExpiredError") {
            return { status: 0, message: "token is expired" }
        } else {
            return { status: 0, message: "your token is wrong" }
        }
    }
}
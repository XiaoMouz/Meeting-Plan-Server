const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const key = "1@doawkp_2-$ssAS2"


exports.getToken = (payload) => {
    return jwt.sign(payload, key, { expiresIn: 60 * 60 * 24 })
}

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

exports.authToken = (token) => {

}
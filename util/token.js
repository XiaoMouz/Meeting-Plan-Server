const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')
const key = "1@doawkp_2-$ssAS2"


exports.getToken = (payload) => {
    return jwt.sign(payload, key, { expiresIn: 60 * 60 * 24 })
}

exports.verifyToken = (token) => {
    if (jwt.verify(token, key))
        return jwt.decode(token, key)
    else
        return null
}

exports.authToken = (token) => {

}
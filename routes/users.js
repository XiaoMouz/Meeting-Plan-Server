const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const db = require('../db/connection');
const encrypt = require('../util/encrypt')
const { getToken } = require('../util/token')
const { verifyToken } = require('../util/token')

/**
 * @param {Object} req request
 * @param {Object} res response
 * @param {String} sql request sql
 * @param {Array} paramArr the parameters of sql
 * @returns {void}
 * @description get data from database
 */
getData = (req, res, sql, paramArr, callBack) => {
    if (paramArr == null) {
        paramArr = []
    }

    db.sqlConnect(sql, paramArr, (err, data) => {
        if (err) {
            console.error("Error(user.js): Fuck up callBack failed, case:" + err)
        }
        else {
            callBack(data)
        }
    })
};


router.post('/login', function (req, res, next) {
    const sql = "select * from users where username = ?"

    // check the request
    if (req.body.username == null || req.body.password == null) {
        return res.send({ code: 0, msg: "request is null" })
    }

    // check the user
    let user = getData(req, res, sql, req.body.username, (data) => {

        if (data == null) {
            return res.send({ code: 0, msg: "user not exist" })
        }

        if (data[0].password != encrypt.md5(req.body.password)) {
            return res.send({ code: 0, msg: "password error" })
        }

        return res.send({
            code: 1, msg: "login success",
            token: getToken({
                id: data[0].user_id,
                username: data[0].username,
                level: data[0].level
            })
        })
    })
});

/**
 * path: /user/test
 * @description test the interface work statu
 */
router.get('/test', function (req, res, next) {
    res.send({ code: 1, msg: "test success" })
});

router.post('/test', function (req, res, next) {
    /** return types
     * {
     * "id": 1,
     * "username": "XiaoMouz",
     * "level": "admin",
     * "iat": 1678153441,
     * "exp": 1678239841
     * }
     */
    res.send(verifyToken(req.body.token))

});

module.exports = router;
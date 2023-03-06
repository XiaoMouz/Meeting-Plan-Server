var express = require('express');
var router = express.Router();
var db = require('../db/connection');
var encrypt = require('../util/encrypt')

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

/**
 * path: /user/test
 * @description test the interface work statu
 */
router.get('/test', function (req, res, next) {
    res.send({ code: 1, msg: "test success" })
});


router.post('/login', function (req, res, next) {
    var sql = "select * from users where username = ?"

    // check the request
    if (req.body.username == null || req.body.password == null) {
        return res.send({ code: 0, msg: "request is null" })
    }

    // check the user
    var user = getData(req, res, sql, req.body.username, (data) => {

        console.log(encrypt.md5(req.body.password))
        if (data == null) {
            return res.send({ code: 0, msg: "user not exist" })
        }

        if (data[0].password != encrypt.md5(req.body.password)) {
            return res.send({ code: 0, msg: "password error" })
        }

        return res.send({ code: 1, msg: "login success" })
    })
});



module.exports = router;
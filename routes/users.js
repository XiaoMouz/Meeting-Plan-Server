var express = require('express');
var router = express.Router();
var db = require('../db/connection');

/**
 * @param {Object} req request
 * @param {Object} res response
 * @param {String} sql request sql
 * @param {Array} paramArr the parameters of sql
 * @returns {void}
 * @description get data from database
 */
getData = (req, res, sql, paramArr) => {
    if (paramArr == null) {
        paramArr = []
    }
    var callBack = (err, data) => {
        if (err) {
            console.error("Error(user.js): Fuck up callBack failed, case:" + err)
        }
        else {
            return data
        }
    }
    db.sqlConnect(sql, paramArr, callBack)
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
    var paramArr = [req.body.username]

    // check the request
    if (req.body.username == null || req.body.password == null) {
        return res.send({ code: 0, msg: "request is null" })
    }

    // check the user
    var user = getData(req, res, sql, paramArr)
    
    if (user == null) {
        return res.send({ code: 0, msg: "user not exist" })
    }
    if (user.password != req.body.password) {
        return res.send({ code: 0, msg: "password error" })
    }


    return res.send({ code: 1, msg: "login success" })
});



module.exports = router;
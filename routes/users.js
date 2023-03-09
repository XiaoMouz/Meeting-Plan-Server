const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const encrypt = require('../util/encrypt')
const { getToken } = require('../util/token')
const { verifyToken } = require('../util/token')
const settings = require('../config/settings.json');
const { md5 } = require('../util/encrypt');
const Model = require('../db/Model.js');

/**
 * Login Post
 */
router.post('/login', function (req, res, next) {
    const db = new Model('users')

    // check the request
    if (req.body.username == null || req.body.password == null) {
        return res.send({ code: 0, msg: "request is null" })
    }

    db.search({
        username: req.body.username
    },
        (err, data) => {
            if (data == null) {
                return res.send({ code: 0, msg: "user not exist" })
            }

            if (data[0].password != encrypt.md5(req.body.password)) {
                return res.send({ code: 0, msg: "password error" })
            }

            // update the user login time and ip

            db.update({
                login_time: new Date(), login_ip: req.ip
            },
                undefined,
                { user_id: data[0].user_id })

            return res.send({
                code: 1,
                msg: "login success",
                data: {
                    token: getToken({
                        id: data[0].user_id,
                        username: data[0].username,
                        level: data[0].level
                    })
                }
            })
        }
    )
});

/**
 * Register Post
 */
router.post('/register', function (req, res, next) {
    // check the request
    if (req.body.username == null || req.body.password == null) {
        return res.send({ code: 0, msg: "request is null" })
    }

    // check the invite code
    if (settings.options.invite == true) {
        if (req.body.invite_code == "" || req.body.invite_code == null) {
            return res.send({ code: 0, msg: "no invite code" })
        }

        const db = new Model('codes')
        db.search({ invite_code: req.body.invite_code }, (data) => {
            if (data == null) {
                return res.send({ code: 0, msg: "invite code error" })
            }
        })
    }
    const db = new Model('users')
    // check the user
    db.search({ username: req.body.username }, (err, data) => {
        if (data != undefined || data[0].username === req.body.username) {
            return res.send({ code: 0, msg: "user already exist" })
        }
    })

    // insert the user
    db.insert({
        user_id: null,
        username: req.body.username,
        password: md5(req.body.password),
        level: 'user',
        invite_code: req.body.invite_code == undefined ? null : req.body.invite_code,
        register_time: new Date(),
        register_ip: req.ip,
        login_time: new Date(),
        login_ip: req.ip,
        phone: "",
        email: "",
        avatar_link: ""
    },
        (err, data) => {
            if (err != null) {
                console.log(err)
                return res.send({ code: 0, msg: "register failed: " + err })
            }
            res.send({
                code: 1, msg: "register success"
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
    const inviteSQL = "select * from codes where invite_code = ? and type = 'invite'"

    const db = new Model('codes')
    db.search({ invite_code: 123, yss: "ad" }, (err, data) => {
        console.log(err)
        res.send({ data: data, token: verifyToken(req.body.token) })
    })

});

module.exports = router;
const express = require('express')
const req = require('express/lib/request')
const router = express.Router();
const encrypt = require('../util/encrypt')
const { getToken } = require('../util/token')
const { verifyToken } = require('../util/token')
const settings = require('../config/settings.json')
const { md5 } = require('../util/encrypt')
const Model = require('../db/Model')
const ResponseBody = require('../data/responseBody.js')

/**
 * Login Post
 */
router.post('/login', function (req, res, next) {
    const db = new Model('users')

    // check the request
    if (req.body.username == null || req.body.password == null) {
        return res.send(new ResponseBody(200, "request is null"));
    }

    db.search({
        username: req.body.username
    },
        (err, data) => {
            if (data == null) {
                return res.send(new ResponseBody(200, "user not found"))
            }

            if (data[0].password != encrypt.md5(req.body.password)) {
                return res.send(new ResponseBody(200, "password error"))
            }

            // update the user login time and ip

            db.update(
                { login_time: new Date(), login_ip: req.ip },
                { user_id: data[0].user_id },
                undefined
            )

            return res.send(new ResponseBody(
                200, // status code
                "login success", // message
                {
                    token: getToken({
                        id: data[0].user_id,
                        username: data[0].username,
                        level: data[0].level
                    })
                }) // data
            )
        }
    )
});

/**
 * Register Post
 */
router.post('/register', function (req, res, next) {
    // check the request
    if (req.body.username == null || req.body.password == null) {
        return res.send(new ResponseBody(200, "request is null"));
    }

    // check the invite code
    if (settings.options.invite == true) {
        if (req.body.invite_code == "" || req.body.invite_code == null) {
            return res.send(new ResponseBody(200, "invite code is null"))
        }

        const db = new Model('codes')
        db.search({ invite_code: req.body.invite_code }, (data) => {
            if (data == null) {
                return res.send(new ResponseBody(200, "invite code is not exist"))
            }
        })
    }
    const db = new Model('users')

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
            // todo: waiting for debug
            if (err) {
                console.log(err)
                return res.send(new ResponseBody(200, "register failed: username is already exist"))
            }
            res.send(new ResponseBody(200, "register success"))
        })
});

module.exports = router
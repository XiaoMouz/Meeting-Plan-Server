const express = require('express')
const req = require('express/lib/request')
const router = express.Router();
const encrypt = require('../util/encrypt')
const { getToken } = require('../util/token')
const { verifyToken } = require('../util/token')
const settings = require('../config/settings.json')
const { md5 } = require('../util/encrypt')
const Model = require('../db/Model')
const ResponseBody = require('../data/ResponseBody.js')

/**
 * Login Post
 */
router.post('/login', function (req, res, next) {
    const db = new Model('users')

    // check the request
    if (req.body.username == null || req.body.password == null) {
        return res.send(new ResponseBody(400, "request is null"));
    }

    db.search({
        username: req.body.username
    },
        (err, data) => {
            if (data == null) {
                return res.send(new ResponseBody(404, "user not found"))
            }

            if (data[0].status == 'disabled') {
                return res.send(new ResponseBody(404, "user disabled"))
            }
            
            if (data[0].status == 'banned') {
                return res.send(new ResponseBody(403, "user is banned"))
            }

            if (data[0].password != encrypt.md5(req.body.password)) {
                return res.send(new ResponseBody(401, "password error"))
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
        return res.send(new ResponseBody(400, "request is null"));
    }

    // check the invite code
    if (settings.options.invite == 'true') {
        if (req.body.invite_code == "" || req.body.invite_code == null) {
            return res.send(new ResponseBody(401, "invite code is null"))
        }

        const db = new Model('codes')
        db.search({ code: req.body.invite_code }, (err, data) => {
            if (err) {
                return res.send(new ResponseBody(500, "server error", err))
            }

            if (data[0] == null) {
                return res.send(new ResponseBody(403, "invite code is not exist"))
            }
            if (data[0].type != 'invite') {
                return res.send(new ResponseBody(403, "invite code is not exist"))
            }
            if (data[0].invalid_time < new Date()) {
                return res.send(new ResponseBody(403, "invite code is expired"))
            }
        })
    }
    const db = new Model('users')

    // check the username
    db.search({ username: req.body.username }, (err, data) => {
        if (err) {
            console.log(err)
            return res.send(new ResponseBody(500, "server error"))
        }

        if (data[0] != null) {
            return res.send(new ResponseBody(201, "username is already exist"))
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
            if (err) {
                console.log(err)
                return res.send(new ResponseBody(500, "server error"))
            }
            return res.send(new ResponseBody(200, "register success"))
        })
});

router.get('/:id', function (req, res, next) {
    const db = new Model('users')

    db.search({ user_id: req.params.id }, (err, data) => {
        if (err) {
            return res.send(new ResponseBody(500, "server error"))
        }

        if (data[0] == null) {
            return res.send(new ResponseBody(404, "user not found"))
        }

        delete data[0].password
        delete data[0].register_ip
        delete data[0].login_ip
        delete data[0].invite_code

        return res.send(new ResponseBody(200, "success", data[0]))
    })

});

module.exports = router
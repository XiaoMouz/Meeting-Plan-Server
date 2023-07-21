const express = require('express')
const router = express.Router()
const Model = require('../db/Model.js')
const ResponseBody = require('../data/ResponseBody.js')

/**
 * path: /api/v1/info/res
 * @description get the resources list
 */
router.get('/res', (req, res) => {
    const db = new Model('resources')
    db.search(null, (err, data) => {
        if (err) {
            console.log(err)
            res.send(new ResponseBody(500, err))
        }
        res.send(new ResponseBody(200, "success", data))
    })

});

/**
 * path: /api/v1/info/notice
 * @description get the notice list
 */
router.get('/notice', (req, res) => {
    const db = new Model('notices')
    db.search(null, (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send(new ResponseBody(500, err))
            return
        }
        res.send(new ResponseBody(200, "success", data))
    })
})

/**
 * path: /api/v1/info/user
 * @description get the user list
 */
router.get('/user', (req, res) => {
    const db = new Model('users')
    db.exec('select count(1) from users', null, (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).send(new ResponseBody(500, err))
            return
        }
        resultData = { "total_user": Object.values(data[0])[0] }
        res.send(new ResponseBody(200, "success", resultData))
    })

    // 返回用户大部分数据，管理员用
    // db.search(null, (err, data) => {
    //     for (i in data) {
    //         delete data[i].user_id
    //         delete data[i].password
    //         delete data[i].invite_code
    //         delete data[i].register_time
    //         delete data[i].register_ip
    //         delete data[i].login_time
    //         delete data[i].login_ip
    //         delete data[i].phone
    //         delete data[i].email
    //     }
    //     res.send(new ResponseBody(200, "success", data))
    // })
})

module.exports = router
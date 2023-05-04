const express = require('express')
const router = express.Router()
const Model = require('../db/Model.js')
const ResponseBody = require('../data/responseBody.js')

// resource interface
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

// notice interface
router.get('/notice', (req, res) => {
    const db = new Model('notices')
    db.search(null, (err, data) => {
        if (err) {
            console.log(err)
            res.send(new ResponseBody(500, err))
            return
        }
        res.send(new ResponseBody(200, "success", data))
    })
})
router.get('/user', (req, res) => {
    const db = new Model('users')
    db.search(null, (err, data) => {
        if (err) {
            console.log(err)
            res.send(new ResponseBody(500, err))
            return
        }
        delete data[0].password
        res.send(new ResponseBody(200, "success", data))
    })
})

module.exports = router
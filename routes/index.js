const express = require('express');
const router = express.Router();
const Model = require('../db/Model.js');

// resource interface
router.get('/info/res', (req, res) => {
    const db = new Model('resources')
    db.search(null, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(data)
    })

});

// notice interface
router.get('/info/notice', (req, res) => {
    const db = new Model('notices')
    db.search(null, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(data)
    })
})
router.get('/info/user', (req, res) => {
    const db = new Model('users')
    db.search(null, (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        res.send(data)
    })
})

module.exports = router;
const express = require('express')
const router = express.Router()
const Model = require('../db/Model.js')
const ResponseBody = require('../data/ResponseBody.js')


/**
 * path: /test
 * @description test the interface work status
 */
router.get('/test/:msg', function (req, res, next) {
    res.send(req.params)
});

/**
 * path: /test
 * @description test the interface work status
 */
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
    console.log(req.data)

});

module.exports = router
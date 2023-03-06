const express = require('express');
const router = express.Router();
const db = require('../db/connection');

/**
 * @param {Object} req request
 * @param {Object} res response
 * @param {String} tableName request table
 * @param {Array} paramArr the parameters of sql
 * @returns {void}
 * @description get data from database
 */
getTables = (req, res, tableName, paramArr) => {
    let sql = "select * from " + tableName
    let callBack = (err, data) => {
        if (err) {
            console.error("Error(index.js): Fuck up callBack failed, case:" + err)
        }
        else {
            res.send({ data })
        }
    }
    db.sqlConnect(sql, paramArr, callBack)
};


// resource interface
router.get('/info/res', (req, res) => getTables(req, res, "resources"));

// notice interface
router.get('/info/notice', (req, res) => getTables(req, res, "notices"));

router.get('/info/user', (req, res) => getTables(req, res, "users"))

module.exports = router;
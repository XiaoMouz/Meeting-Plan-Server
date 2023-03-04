var express = require('express');
var router = express.Router();
var db = require('../db/connection');

/**
 * @param {Object} req request
 * @param {Object} res response
 * @param {String} tableName request table
 * @param {Array} paramArr the parameters of sql
 * @returns {void}
 * @description get data from database
 */
getTables = (req, res, tableName, paramArr) => {
    var sql = "select * from " + tableName
    var callBack = (err, data) => {
        if (err) {
            console.error("Error(index.js): Fuck up callBack failed, case:" + err)
        }
        else {
            res.send({data})
        }
    }
    db.sqlConnect(sql, paramArr, callBack)
};


// resource interface
router.get('/info/res', (req, res) => getTables(req, res, "resources"));

// notice interface
router.get('/info/notice', (req, res) => getTables(req, res, "notices"));

module.exports = router;
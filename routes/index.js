var express = require('express');
var router = express.Router();
var db = require('../db/connection');

// get resource table from database
getTables = (req, res, tableName) => {
    var sql = "select * from " + tableName
    var sqlArr = []
    var callBack = (err, data) => {
        if (err) {
            console.error("Error: Fuck up in index.js > Function getRes > callBack failed, case:" + err)
        }
        else {
            res.send(data)
        }
    }
    db.sqlConnect(sql, sqlArr, callBack)
}

router.get('/info/res', (req, res) => getTables(req, res, "resources"))
router.get('/info/notice', (req, res) => getTables(req, res, "notices"))


/* Test Functions */
router.get('/', (req, res, next) => {
    res.send("Hi,there is your request info:\n" +
        "req.method: " + req.method +
        "\nreq.url: " + req.url
    )
});

router.post('/', (req, res, next) => {
    res.send("Hi,there is your request info:\n" +
        "req.method: " + req.method +
        "\nreq.url: " + req.url +
        "\nreq.content: " + req.body.msg
    )
});


module.exports = router;

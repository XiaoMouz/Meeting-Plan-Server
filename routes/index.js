var express = require('express');
var router = express.Router();


router.get('/test', (req, res, next) => {

});

router.post('/test', (req, res, next) => {
    res.send("Hi,there is your request info:\n" +
        "req.method: " + req.method +
        "\nreq.url: " + req.url +
        "\nreq.content: " + req.body.msg
    )
});

router.all('*', (req, res, next) => {
    res.send("You maybe request a wrong path, please check our document.")
});

module.exports = router;

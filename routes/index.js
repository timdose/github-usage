var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html');
});


router.get('/test', function(req, res) {
    res.render('test.html');
});

module.exports = router;

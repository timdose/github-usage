var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html');
});


router.get('/chart', function(req, res) {
    res.render('chart.html');
});

module.exports = router;

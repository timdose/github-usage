var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/user/:user', function(req, res ) {
    var data = {user:req.params.user}
    res.render('user', data );
});

module.exports = router;

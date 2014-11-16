var express = require('express');
var https = require('https');
var GithubApi = require('github');

var router = express.Router();

var github = new GithubApi({
    version: '3.0.0',
    debug: true
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/user/:user', function(req, res ) {
    github.repos.getFromUser({user:req.params.user}, function(err, response ) {
        var data = {
            user: req.params.user,
            repos: JSON.stringify(response)
        }
        res.render('user', data);
    });
});

module.exports = router;

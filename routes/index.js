var express = require('express');
var https = require('https');
var GithubApi = require('github');
var _ = require('lodash/dist/lodash.underscore');

var router = express.Router();

var github = new GithubApi({
    version: '3.0.0',
    debug: true
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html', { title: 'Express' });
});


router.get('/chart', function(req, res) {
    res.render('chart.html');
});


router.get('/user/:user', function(req, res ) {
    github.repos.getFromUser({user:req.params.user}, function(err, response ) {
        var repos = _(response).pluck('name');
        var data = {
            user: req.params.user,
            repos: repos
        }
        res.render('user.html', data);
    });
});

module.exports = router;

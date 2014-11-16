var express = require('express');
var https = require('https');
var GithubApi = require('github');
var async = require('async');
var _ = require('lodash/dist/lodash.underscore');

var router = express.Router();

var github = new GithubApi({
    version: '3.0.0',
    debug: true
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index.html');
});


router.get('/chart', function(req, res) {
    res.render('chart.html');
});


router.get('/user', function(req, res ) {
    var user = req.query.user;

    github.repos.getFromUser({user:user}, function(err, repos ) {
        var data = {
            user: user,
            repos: repos,
        }

        async.forEach( repos, function(repo, done ) {
                console.log('querying api about repo ' + repo.name)
                github.repos.getCommits({
                    user: repo.owner.login,
                    repo: repo.name,
                    author: user
                }, function( err, commits ) {
                    repo.numCommits = commits.length;
                    repo.commits = commits;
                    done();
                })
            }, function(err) {
                console.log('all repos queried');
                res.render('user.html', data);
            }
        );
    });
});

module.exports = router;

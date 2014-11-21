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


router.get('/user/:user', function(req, res) {
    if (process.env.NODE_ENV == 'local') {
        fetchLocal(req, res);
    } else {
        fetchFromApi(req, res);
    }
});


function fetchLocal(req, res) {
    require('fs').readFile('data/'+ process.env.GH_USERNAME +'.json', 'utf8', function(err, data) {
        if (err) {
            console.log(err);
        }
        res.send(data);
    });
}


function fetchFromApi(req, res, next) {
    var user = req.params.user;

    github.authenticate({
        type:'oauth',
        token: '1f2bf0e06e33509c29ec2271cf0d8f5736e0ad3f'
    });

    github.repos.getFromUser({user:user}, function(err, repos ) {
        if ( repos === undefined ) {
            return res.json({user:user, repos:[]});
        }

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
                if (err) {
                    console.log(err);
                    repo.numCommits = 0;
                    repo.commits = [];
                    done();
                } else {
                    repo.numCommits = commits.length;
                    repo.commits = commits;
                    done();
                }
            })
        }, function(err) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send(err);
            } else {
                console.log('all repos queried');
                res.json(data);
            }
        });
    });
}

module.exports = router;
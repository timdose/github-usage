var express = require('express');
var https = require('https');
var GithubApi = require('github');
var async = require('async');
var _ = require('lodash/dist/lodash.underscore');

var router = express.Router();

router.get('/user/:user', function(req, res) {
    res.json([{name:'Tim', value:.1}, {name:'Charlie', value:.9}])
});


module.exports = router;
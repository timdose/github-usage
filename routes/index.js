var express = require('express');
var https = require('https');
var GitHubApi = require('github');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/user/:user', function(req, res ) {
    var github = new GitHubApi({
        version: '3.0.0',
        debug:true,
        protocol: 'https',
        host: 'api.github.com',
        timeout: 5000
    });
    github.events.getFromUser({
        user: req.params.user
    }, function(err, response) {
        res.send(response);
    });
});

// router.get('/user/:user', function(req, res ) {
//     var body = '';

//     // https.globalAgent.options.secureProtocol = 'SSLv3_method';

//     var options = {
//         host: 'api.github.com',
//         path: '/users/:user/repos'.replace(':user', req.params.user),
//         method: 'GET',
//         headers: {
//             'host': 'api.github.com',
//             // 'user-agent':'github-usage',
//             'content-length': '0'
//         },
//         port: 443
//     }

//     console.log('fetching data from ' + options.host + options.path );
    
//     var request = https.request(options, function(response) {
//         response.setEncoding('utf8');

//         response.on('data', function(chunk) {
//             body += chunk;
//         });

//         response.on('end', function() {
//             console.log(body);
//             var data = JSON.parse(body);
//             res.render('user', data );
//         });
//     })
//     .on('error', function (e) {
//         console.log('Error:', e);
//     });
// });

module.exports = router;

var express = require('express');
var https = require('https');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
});

router.get('/user/:user', function(req, res ) {
    var body = '';

    var options = {
        host: 'api.github.com',
        path: '/users/:user/events'.replace(':user', req.params.user),
        method: 'get',
        headers: { 
            host: 'api.github.com',
            'content-length': '0',
            'user-agent': 'github-usage',
            accept: 'application/vnd.github.v3+json' 
        },
        port: 443
    }

    console.log('fetching data from ' + options.host + options.path );
    
    var request = https.request(options, function(response) {
        response.setEncoding('utf8');

        response.on('data', function(chunk) {
            body += chunk;
        });

        response.on('end', function() {
            console.log(body);
            var data = {
                user: req.params.user,
                activity: body
            }
            res.render('user', data );
        });
    })
    .on('error', function (e) {
        console.log('Error:', e);
    });

    request.end();
});

module.exports = router;

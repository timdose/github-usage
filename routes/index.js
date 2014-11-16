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

// router.get('/user-alt/:user', function(request, response ) {
//     // var options = {
//     //     host: 'api.github.com',
//     //     path: '/users/timdose/events',
//     //     method: 'get',
//     //     port: 443,
//     //     headers: { 
//     //         host: 'api.github.com',
//     //         'content-length': '0',
//     //         'user-agent': 'NodeJS HTTP Client',
//     //         accept: 'application/vnd.github.beta+json' 
//     //     }
//     // }

//     var callback = function(err, res) {
//         if (err !== null) {
//             response.send(err)
//         } else {
//             response.send(res);
//         }
//     }

//     this.config = {
//         timeout: 5000
//     }

//     var self = {
//         debug: true
//     }

//     var protocol = 'https';
//     var host = 'api.github.com';
//     var port = 443;
//     var path = '/users/timdose/events';
//     var method = 'get';
//     var headers = { 
//         host: 'api.github.com',
//         'content-length': '0',
//         'user-agent': 'timdose',
//         accept: 'application/vnd.github.beta+json' 
//     };


//     var options = {
//         host: host,
//         port: port,
//         path: path,
//         method: method,
//         headers: headers
//     };

//     var callbackCalled = false;

//     var req = require(protocol).request(options, function(res) {
//         if (self.debug) {
//             console.log("STATUS: " + res.statusCode);
//             console.log("HEADERS: " + JSON.stringify(res.headers));
//         }
//         res.setEncoding("utf8");
//         var data = "";
//         res.on("data", function(chunk) {
//             data += chunk;
//         });
//         res.on("error", function(err) {
//             if (!callbackCalled) {
//                 callbackCalled = true;
//                 callback(err);
//             }
//         });
//         res.on("end", function() {
//             if (callbackCalled)
//                 return;
//             callbackCalled = true;
//             if (res.statusCode >= 400 && res.statusCode < 600 || res.statusCode < 10) {
//                 callback(new error.HttpError(data, res.statusCode));
//             } else {
//                 res.data = data;
//                 callback(null, res);
//             }
//         });
//     });
//     if (this.config.timeout) {
//         req.setTimeout(this.config.timeout);
//     }
//     req.on("error", function(e) {
//         if (self.debug)
//             console.log("problem with request: " + e.message);
//         if (!callbackCalled) {
//             callbackCalled = true;
//             callback(e.message);
//         }
//     });
//     req.on("timeout", function() {
//         if (self.debug)
//             console.log("problem with request: timed out");
//         if (!callbackCalled) {
//             callbackCalled = true;
//             callback('timeout');
//         }
//     });

//     req.end();

// });


router.get('/user-alt/:user', function(req, res ) {
    var body = '';

    // https.globalAgent.options.secureProtocol = 'SSLv3_method';

    var options = {
        host: 'api.github.com',
        path: '/users/:user/events'.replace(':user', req.params.user),
        method: 'get',
        headers: { 
            host: 'api.github.com',
            'content-length': '0',
            'user-agent': 'github-usage',
            accept: 'application/vnd.github.beta+json' 
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
            var data = JSON.parse(body);
            res.render('user', data );
        });
    })
    .on('error', function (e) {
        console.log('Error:', e);
    });

    request.end();
});

module.exports = router;

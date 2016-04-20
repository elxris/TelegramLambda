'use strict';

var https    = require('https');
var config  = require('./env');

var makeRequest = function(method, data) {
  var options = {
    hostname: 'api.telegram.org',
    method: 'POST',
    path: '/bot' + config.TELEGRAM_TOKEN + '/' + method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  return new Promise(function(resolve, reject) {
    var req = https.request(options, function(res) {
      var body = '';
      // console.log(method + 'response.headers:', res.headers);
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        // console.log(method + 'response.body:', body);
        resolve(body);
      });
    });
    req.on('error', reject);
    req.write(JSON.stringify(data));
    req.end();
  });
};

module.exports = makeRequest;

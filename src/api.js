'use strict';

var Promise = require('bluebird');
var request = require('request');
var config  = require('./env');

// Build base url for API of Telegram
var BASE_URL = 'https://api.telegram.org/bot' + config.TELEGRAM_TOKEN + '/';

var makeRequest = function(method, data, cb) {
  var options = {
    baseUrl: BASE_URL,
    uri: method,
    json: true,
    body: data
  };
  request.post(options, function(err, response) {
      if (err) { return cb(err); }
      console.log(method + ' response.body:', response.body);
      console.log(method + ' response.headers:', response.headers);
      return cb(null, response);
    });
};

module.exports = Promise.promisify(makeRequest);

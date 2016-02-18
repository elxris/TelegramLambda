'use strict';

var Promise = require('bluebird');
var AWS     = require('aws-sdk');
var dynamo  = Promise.promisifyAll(new AWS.DynamoDB.DocumentClient());
var config  = require('./env');

// DynamoDB Table Name, Ej. 'Telegram'
var TABLE_NAME = config.DYNAMO_TABLE_NAME;

var db = function() {};
db.logResponse = function(res) {
  console.log('DYNAMO RESPONSE:', res);
  return res;
};
db.logError = function(params) {
  return function(err) {
    console.error('DYNAMO ERROR: ', err.message);
    console.error('PARAMS: ', params);
    console.error('FULL ERROR: ', err);
    throw err;
  };
};
db.params = function() {
  var params = {};
  params.TableName = TABLE_NAME;
  return params;
};
db.getUser = function(user) {
  var params = db.params();
  params.Key = {UserID: user.id + ''};
  params.ReturnValues = 'ALL_NEW';
  params.UpdateExpression = 'ADD #mc :mc';
  params.ExpressionAttributeNames = {'#mc': 'messageCounter'};
  params.ExpressionAttributeValues = {
    ':mc': 1
  };
  return dynamo.updateAsync(params)
    .then(db.logResponse)
    .catch(db.logError(params))
    .catch(function(err) {
      if (!~err.message.indexOf('element does not match the schema')) {
        return db.createUser(user);
      }
      throw err;
    });
};
db.createUser = function(user) {
  var params = db.params();
  params.Item = {
    UserID: user.id + ''
  };
  return dynamo.putAsync(params)
    .then(db.logResponse)
    .catch(db.logError(params));
};

module.exports = db;

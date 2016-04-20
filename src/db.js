'use strict';

var AWS     = require('aws-sdk');
var dynamo  = new AWS.DynamoDB.DocumentClient();
var config  = require('./env');

// DynamoDB Table Name, Ej. 'Telegram'
var TABLE_NAME = config.DYNAMO_TABLE_NAME;

var db = function() {};
db.logResponse = function(res) {
  //console.log('DYNAMO RESPONSE:', res);
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
  return new Promise(function(resolve, reject) {
    dynamo.update(params, function(error, response) {
      if (error) {
        db.logError(params)(error);
        if (!~error.message.indexOf('element does not match the schema')) {
          return db.createUser(user);
        }
        return reject(error);
      }
      db.logResponse(response);
      resolve(response);
    });
  });
};
db.createUser = function(user) {
  var params = db.params();
  params.Item = {
    UserID: user.id + ''
  };
  return new Promise(function(resolve, reject) {
    dynamo.put(params, function(error, response) {
      if (error) {
        db.logError(params)(error);
        return reject(error);
      }
      db.logResponse(params);
      resolve(response);
    });
  });
};

module.exports = db;

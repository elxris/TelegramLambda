'use strict';

console.log('Loading function');

var Promise     = require('bluebird');
var db          = require('./src/db');
var telegramAPI = require('./src/api');
var config      = require('./src/env');

exports.handler = function(event, context) {
  console.log('event', event);
  console.log('context', context);
  var time = (function() {
    var initial = context.getRemainingTimeInMillis();
    return function(message) {
      var diff = initial - context.getRemainingTimeInMillis();
      console.log('time', message || '', diff);
    };
  })();
  time('Handler start');
  if (event.webhook) {
    console.log('Setting Webhoook');
    telegramAPI('setWebhook', {url: config.APPLICATION_WEBHOOK})
    .then(function() {
      time();
      context.succeed(true);
    }).catch(function(err) {
      time();
      context.fail(err);
    });
    return;
  }
  if (!event.message) {
    return context.fail('Evento no reconocido.');
  }
  var getUser = db.getUser(event.message.chat);
  // Si no es ningún mensaje
  return telegramAPI('forwardMessage', {
    chat_id: event.message.chat.id,
    from_chat_id: event.message.chat.id,
    message_id: event.message.message_id
  }).then(function() {
    time('Response forwardMessage');
    return getUser;
  }).then(function(res) {
    return '*success* ' + JSON.stringify(res);
  }).catch(function(err) {
    return '*fail* ' + JSON.stringify(err);
  }).then(function(text) {
    time('Response DynamoDb');
    context.succeed({
      method: 'sendMessage',
      parse_mode: 'Markdown',
      chat_id: event.message.chat.id,
      text: text
    });
  }).catch(function(err) {
    time('Fail');
    context.fail(err);
  });
};

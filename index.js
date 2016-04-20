'use strict';

var config      = require('./src/env');
var telegramAPI = require('./src/api');
var db          = require('./src/db');

exports.handler = function(event, context) {
  var timeLimit = (1 + context.getRemainingTimeInMillis() / 1e3 | 0) * 1e3;
  // console.log('event', event);
  // console.log('context', context);
  var time = function(message) {
    console.log('time', message || '',
    timeLimit - context.getRemainingTimeInMillis() + '/' + timeLimit);
  };
  // time('Handler start');
  // Periodic call to always have up to date the webhook.
  if (event.webhook) {
    console.log('Setting Webhoook');
    telegramAPI('setWebhook', {
      url: config.APPLICATION_WEBHOOK
    }).then(function(data) {
      time('Response setWebhook', data);
      return data;
    }).then(function() {
      context.succeed(true);
    }).catch(function(err) {
      context.fail(err);
    });
    return;
  }
  if (!event.message) {
    return context.fail('Evento no reconocido.');
  }
  var getUser = db.getUser(event.message.chat)
  .then(function(data) {
    time('Response DynamoDb', data);
    return data;
  });
  // Si no es ningún mensaje
  telegramAPI('forwardMessage', {
    chat_id: event.message.chat.id,
    from_chat_id: event.message.chat.id,
    message_id: event.message.message_id
  }).then(function(data) {
    time('Response forwardMessage', data);
    return data;
  }).then(function() {
    return getUser;
  }).then(function(res) {
    return '*success* ' + JSON.stringify(res);
  }).catch(function(err) {
    console.error(err);
    return '*fail* ' + JSON.stringify(err);
  }).then(function(text) {
    context.succeed({
      method: 'sendMessage',
      parse_mode: 'Markdown',
      chat_id: event.message.chat.id,
      text: text
    });
  }).catch(function(err) {
    context.fail(err);
  });

  time('All prepared!');
};

console.log('LAMBDA READY!');

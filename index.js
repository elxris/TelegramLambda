'use strict';

console.log('Loading function');

var Promise     = require('bluebird');
var db          = require('./src/db');
var telegramAPI = require('./src/api');
var config      = require('./src/env');

console.log('Setting Webhoook');
var setup = telegramAPI('setWebhook', {url: config.APPLICATION_WEBHOOK});

exports.handler = function(event, context) {
  var getUser = db.getUser(event.message.chat);
  console.log('event', event);
  console.log('context', context);
  setup.then(function() {
    // Si no es ningún mensaje
    if (!event.message) {
      throw new Error('Este bot sólo acepta mensajes');
    }
    return telegramAPI('forwardMessage', {
        chat_id: event.message.chat.id,
        from_chat_id: event.message.chat.id,
        message_id: event.message.message_id
      });
  }).then(function() {
    return getUser;
  }).then(function(res) {
    context.succeed({
      method: 'sendMessage',
      parse_mode: 'Markdown',
      chat_id: event.message.chat.id,
      text: '*success* ' + JSON.stringify(res)
    });
  }).catch(function(err) {
    if (!event.message) {
      return context.fail(err);
    }
    context.succeed({
      method: 'sendMessage',
      parse_mode: 'Markdown',
      chat_id: event.message.chat.id,
      text: '*fail* ' + JSON.stringify(err)
    });
  });
};

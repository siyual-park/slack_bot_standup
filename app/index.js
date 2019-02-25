'use strict'

const { RTMClient } = require('@slack/client')
const schedule = require('node-schedule');

const { addNewMessage, doStandUp } = require('./util')

require('dotenv').config()
const token = process.env.SLACK_TOKEN;

let do_standup = true;

let rtm = new RTMClient(token, { logLevel: 'error' });
rtm.start();

rtm.on('message', async (message) => {
  // Skip messages that are from a bot or my own user ID
  if ((message.subtype && message.subtype === 'bot_message') ||
    (!message.subtype && message.user === rtm.activeUserId)) {
    return;
  }

  // Process Messagee
  const res = addNewMessage(message.user, message.text);
  if (!!res) do_standup = false;
});

schedule.scheduleJob('* 9 * * *', function () {
  doStandUp(do_standup);
});

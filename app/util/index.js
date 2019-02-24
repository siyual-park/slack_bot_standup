'use strict'

const { WebClient } = require('@slack/client')

require('dotenv').config()
const token = process.env.SLACK_TOKEN;

let web = new WebClient(token);

function isForm(str, froms) {
  for (let i = 0; i < froms.length; i++)
    if (str === froms[i])
      return true;
  return false;
}

function addNewMessage(user, text) {
  // TODO
  if (text.length === 0) return false;
  const did_form = ['한일', '한 일'];
  const do_form = ['할일', '할 일'];

  // 문자열 전처리
  let array = text.split(/:|\r\n|\r|\n/);
  for (let i = 0; i < array.length; i++)
    array[i] = array[i].replace(/(^\s*)|(\s*$)/gi, '');

  const did_index = array.findIndex((value) => isForm(value, did_form))
  const do_index = array.findIndex((value) => isForm(value, do_form))
  if (did_index === -1 || do_index === -1) return;
  return [array[did_index + 1], array[do_index + 1]]
}

async function doStandUp(do_standup) {
  if (!do_standup) {
    do_standup = true;
    return;
  }
  const res = await web.channels.list()

  // Take any channel for which the bot is a member
  const channel = res.channels.find(c => c.is_member);

  if (channel)
    await web.chat.postMessage({ channel: channel.id, text: '좋은 아침이네요! standup 쓸 시간입니다.\n 한 일: <!everyone> 을 호출함.\n 할 일: <!everyone> 을 호출할 준비를 함.' })
}

module.exports = { addNewMessage, doStandUp };

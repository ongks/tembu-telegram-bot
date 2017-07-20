import TelegramBot from 'node-telegram-bot-api';
import StateManager from './statemanager';
import { credentials } from './config';

const bot = new TelegramBot(credentials.token, { polling: true, });

const stateManagers = {};

bot.on('message', (msg, calback) => {
  if (!stateManagers[msg.chat.id]) {
    stateManagers[msg.chat.id] = new StateManager(msg.chat.id);
  }
  const response = stateManagers[msg.chat.id].process(msg);
  if (response.respond) {
    bot.sendMessage(response.chatID, response.text, response.options || {});
  }
  console.log(msg);
});


















import TelegramBot from 'node-telegram-bot-api';
import StateManager from './stateManager';
import { credentials } from './config';

const bot = new TelegramBot(credentials.token, { polling: true });

const stateManagers = {};

bot.on('message', (msg, calback) => {
  if (!stateManagers[msg.chat.id]) {
    stateManagers[msg.chat.id] = new StateManager(msg.chat.id);
  }
  console.log(msg);
  const response = stateManagers[msg.chat.id].process(msg);
  if (!response.respond) return 0;
  return response.messages.forEach((message) => {
    bot.sendMessage(response.chatID, message.text, message.options || {});
  });
});



















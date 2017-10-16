import TelegramBot from 'node-telegram-bot-api';
import StateManager from './stateManager';
import { credentials } from './config';
import Data from './data'

const bot = new TelegramBot(credentials.token, { polling: true });

const stateManagers = {};
const dataInstance = new Data();

bot.on('message', (msg, calback) => {
  if (!stateManagers[msg.chat.id]) {
    stateManagers[msg.chat.id] = new StateManager(msg.chat.id, dataInstance);
  }
  console.log(msg);
  const response = stateManagers[msg.chat.id].process(msg);
  if (!response.respond) return 0;
  return response.messages.forEach((message) => {
    if (message.type === 'text') {
      bot.sendMessage(response.chatID, message.text, message.options || {});
    } else if (message.type === 'document') {
      bot.sendDocument(response.chatID, message.document);
    }
    
  });
});



















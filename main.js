import TelegramBot from 'node-telegram-bot-api';
import StateManager from './stateManager';
import { credentials } from './config';
import Data from './data'

const bot = new TelegramBot(credentials.token, { polling: true });

const stateManagers = {};
const dataInstance = new Data();

bot.on('message', (msg, callback) => {
  // Username is not a compulsory field, in which case use the first name if user does not have one
  let username = '';
  if (msg.chat.username.length > 0) {
    username = msg.chat.username;
  } else {
    username = msg.chat.first_name;
  }

  if (!stateManagers[msg.chat.id]) {
    stateManagers[msg.chat.id] = new StateManager(msg.chat.id, username, dataInstance);
  }
  console.log(msg);
  const response = stateManagers[msg.chat.id].process(msg);
  if (!response.respond) return 0;
  console.log(response.messages);

  return response.messages.forEach((message) => {
    if (message.type === 'text') {
      bot.sendMessage(response.chatID, message.text, message.options || {});
    } else if (message.type === 'document') {
      bot.sendDocument(response.chatID, message.document);
    }
    
  });
});
import TelegramBot from 'node-telegram-bot-api';
import { credentials } from './config';

const bot = new TelegramBot(credentials.token, { polling: true, });


bot.on('message', (msg, cb) => {
  console.log(msg);
});











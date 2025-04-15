"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = require("dotenv");
const Date_1 = require("./Date");
(0, dotenv_1.configDotenv)();
const tokenTg = process.env.tokenTg;
const apiToken = process.env.apiKey;
if (typeof (tokenTg) == "undefined" || typeof (apiToken) == "undefined") {
    console.error("no tokenTg or apiToken in .env");
    process.exit(1);
}
const base = new Date_1.Base(apiToken);
const bot = new node_telegram_bot_api_1.default(tokenTg, { polling: true });
bot.onText(RegExp("/start"), msg => {
    bot.sendMessage(msg.chat.id, "Hello, " + msg.chat.first_name + "!");
});
bot.onText(RegExp("/rates"), msg => {
    let text = `1 ${base._rates?.base} it\n`;
    for (const key in base._rates?.rates) {
        text += `${key} : ${base._rates.rates[key]} \n`;
    }
    bot.sendMessage(msg.chat.id, `current (${base._rates?.date}) exchange rates`);
    bot.sendMessage(msg.chat.id, text);
});
bot.onText(RegExp("/symbols"), msg => {
    let text = "";
    for (const key in base._symbols?.symbols) {
        text += `${key} : ${base._symbols?.symbols[key]} \n`;
    }
    bot.sendMessage(msg.chat.id, `current exchange symbols`);
    bot.sendMessage(msg.chat.id, text);
});

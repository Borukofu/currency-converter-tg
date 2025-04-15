"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const dotenv_1 = require("dotenv");
const Data_1 = require("./Data");
(0, dotenv_1.configDotenv)();
const tokenTg = process.env.tokenTg;
const apiToken = process.env.apiKey;
if (typeof (tokenTg) == "undefined" || typeof (apiToken) == "undefined") {
    console.error("no tokenTg or apiToken in .env");
    process.exit(1);
}
const base = new Data_1.Base(apiToken);
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
bot.on("message", msg => {
    let matchs1 = msg.text?.match(/\b\w\w\w\b/g);
    let matchs2 = msg.text?.match(/\b\d{1,20}\b\s{1,}(?!\d)\b\w{3}\b(\s{1,}(?!\d)\b\w{3}\b){1,}/g);
    let text = "";
    if (matchs2 != null) {
        for (let match of matchs2) {
            let rate = {
                value: match.match(/\d{1,20}/)?.toString() || "",
                rates: match.match(/(?!\d)\b\w{3}\b/g) || []
            };
            let text = base.convert(rate);
            bot.sendMessage(msg.chat.id, text);
        }
    }
    else if (matchs1 != null) {
        for (let match of matchs1) {
            let info = base.isSymbols(match.replace(" ", ""));
            if (info != null) {
                text += `${match.replace(" ", "")} : ${info.info}\n`;
            }
        }
        if (text != "") {
            bot.sendMessage(msg.chat.id, text);
        }
        else {
            bot.sendMessage(msg.chat.id, "there is no such symbol");
        }
    }
});

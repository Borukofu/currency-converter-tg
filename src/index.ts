import TelegramBot from "node-telegram-bot-api";
import { configDotenv } from "dotenv";
import { Base } from "./Date";
configDotenv();



const tokenTg:string | undefined = process.env.tokenTg;
const apiToken:string | undefined = process.env.apiKey;

if(typeof(tokenTg)=="undefined" || typeof(apiToken)=="undefined"){
    console.error("no tokenTg or apiToken in .env");
    process.exit(1)
}



const base:Base = new Base(apiToken);

const bot:TelegramBot = new TelegramBot(tokenTg,{polling:true});

bot.onText(RegExp("/start"),msg=>{
    bot.sendMessage(msg.chat.id,"Hello, "+msg.chat.first_name+"!");
})
bot.onText(RegExp("/rates"),msg=>{
    let text:string = `1 ${base._rates?.base} it\n`;
    for (const key in base._rates?.rates) {
        text += `${key} : ${base._rates.rates[key]} \n`
    }

    bot.sendMessage(msg.chat.id,`current (${base._rates?.date}) exchange rates`)
    bot.sendMessage(msg.chat.id,text)
})
bot.onText(RegExp("/symbols"),msg=>{
    let text:string = "";
    for (const key in base._symbols?.symbols) {
        text += `${key} : ${base._symbols?.symbols[key]} \n`
    }

    bot.sendMessage(msg.chat.id,`current exchange symbols`)
    bot.sendMessage(msg.chat.id,text)
})
import TelegramBot from "node-telegram-bot-api";
import { configDotenv } from "dotenv";
import { Base } from "./Data";
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
bot.on("message",msg=>{
    let matchs1 = msg.text?.match(/\b\w\w\w\b/g)
  

    let matchs2 = msg.text?.match(/\b\d{1,20}\b\s{1,}(?!\d)\b\w{3}\b(\s{1,}(?!\d)\b\w{3}\b){1,}/g)
    
    let text:string = "";
    if (matchs2!=null){
        for(let match of matchs2){
            let rate = {
                value: match.match(/\d{1,20}/)?.toString() || "",
                rates:match.match(/(?!\d)\b\w{3}\b/g) || []
            }  
            let text = base.convert(rate);
            bot.sendMessage(msg.chat.id,text);
        }
    }else if(matchs1!=null){
        for(let match of matchs1){
            let info = base.isSymbols(match.replace(" ",""))
            if(info!=null){
                text += `${match.replace(" ","")} : ${info.info}\n`
            }
        }
        if(text!=""){
            bot.sendMessage(msg.chat.id,text);
        }else{
            bot.sendMessage(msg.chat.id,"there is no such symbol");
        }
    }

})
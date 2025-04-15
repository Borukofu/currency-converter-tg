import FS from "fs";


interface Rates {
    success:   boolean;
    timestamp: number;
    base:      string;
    date:      string;
    rates:     { [key: string]: number };
}
interface Symbols {
    success: boolean;
    symbols: { [key: string]: string };
}
interface CF {
    value:string,
    rates:string[]
}

export class Base{
    symbols: Symbols | undefined;
    rates: Rates | undefined;
    apiToken:string;
    date:Date;
    _setShedule():void{
        setInterval(()=>{
            let nowDate:Date = new Date();
            let ratesDate =this.rates?.date || "";
            if(ratesDate!=nowDate.toISOString().split("T")[0]){
                console.log(this.rates?.date,nowDate.toISOString().split("T")[0]);
                this.reloadRates()
                
            }
                
        },60000)
    };
    constructor(apiToken:string){
        this.apiToken = apiToken;
        this.date = new Date();
        // ################## rates
        if(!FS.existsSync(__dirname+"/rates.json")){
            console.log("no rates file created new and get rates from api token!");
            fetch(`http://data.fixer.io/api/latest?access_key=${this.apiToken}`)
            .then(r=>{
                r.json().then(v=>{
                    if(v.success){
                        console.log("create file rates");
                        this.rates = v;
                        FS.writeFileSync(__dirname+"/rates.json",JSON.stringify(v));
                    }else{
                        console.error("false in response",v);
                        process.exit(1);
                    };
                });
            })
            .catch(er=>{
                console.error(er);
                process.exit(1);
            })
        }else{
            console.log("read file rates");
            let buff = FS.readFileSync(__dirname+"/rates.json");
            this.rates = JSON.parse(buff.toString());
        }
        // #################################### symbols
        if(!FS.existsSync(__dirname+"/symbols.json")){
            console.log("no symbols file created new and get symbols from api token!");
            fetch(`https://data.fixer.io/api/symbols?access_key=${this.apiToken}`)
            .then(r=>{
                r.json().then(v=>{
                    if(v.success){
                        console.log("create symbols file");
                        this.symbols = v;
                        FS.writeFileSync(__dirname+"/symbols.json",JSON.stringify(v));
                    };
                });
            })
            .catch(er=>{
                console.error(er);
                process.exit(1);
            });
        }else{
            console.log("read file symbols");
            let buff = FS.readFileSync(__dirname+"/symbols.json");
            this.symbols = JSON.parse(buff.toString());
        };
        this._setShedule()
    };
    reloadAll():void{
        this.reloadRates();
        this.reloadSymbols();
    };
    reloadRates():void{
        console.log("reload Rates",Date.now());
        fetch(`http://data.fixer.io/api/latest?access_key=${this.apiToken}`)
        .then(r=>{
            r.json().then(v=>{
                if(v.success){
                    console.log("create file rates");
                    this.rates = v;
                    FS.writeFileSync(__dirname+"/rates.json",JSON.stringify(v));
                }else{
                    console.error("false in response",v);
                    process.exit(1);
                };
            });
        })
        .catch(er=>{
            console.error(er);
            process.exit(1);
        })
    };
    reloadSymbols():void{
        console.log("reload Symbols",Date.now());
        fetch(`https://data.fixer.io/api/symbols?access_key=${this.apiToken}`)
        .then(r=>{
            r.json().then(v=>{
                if(v.success){
                    console.log("create symbols file");
                    this.symbols = v;
                    FS.writeFileSync(__dirname+"/symbols.json",JSON.stringify(v));
                };
            });
        })
        .catch(er=>{
            console.error(er);
            process.exit(1);
        });
    };
    isSymbols(Symbol:string){
        for (const key in this.symbols?.symbols) {
            if(Symbol.toLowerCase()===key.toLowerCase()){
                return {
                    key: key,
                    info: this.symbols.symbols[key]
                }
            }
        }
        return null;
    };
    _value(Symbol:string){
        if(this.isSymbols(Symbol)!=null){
            for(const key in this.rates?.rates){
                if(Symbol.toUpperCase()===key){
                    return this.rates.rates[key];
                }
            }
        }   
        return NaN  
    };
    convert(config:CF){
        const value = config.value;
        let ratesDirt = config.rates;
        let rates:string[] = [];
        let notAproveRates: string[] = [];
        for(let rate of ratesDirt){
            if(this.isSymbols(rate)!=null){
                rates.push(rate)
            }else{
                notAproveRates.push(rate)
            }
        }
        if(rates.length>=2){
            let mainRate = rates[0];
            let text:string = "";
            for(let i = 1; i < rates.length;i++){
                let out = (this._value("EUR")/this._value(mainRate)) / (this._value("EUR")/this._value(rates[i])) * Number(value)

                text += `${value} ${mainRate.toUpperCase()} --> ${rates[i].toUpperCase()} ${out}\n`

                // AUD/AOA = (EUR/AOA) / (EUR/AUD) = 1040.321339 / 1.778801 = 584.849203

            }
            if(notAproveRates.length!=0){
                text += `there are no such currencies and they were skipped: ${notAproveRates}`
            }
            return text
        }else{
            let text = `there are no such currencies and they were skipped: ${notAproveRates}`
            return text
        }
    }
    get _rates(){
       return this.rates; 
    };
    get _symbols(){
        return this.symbols;
    };
};
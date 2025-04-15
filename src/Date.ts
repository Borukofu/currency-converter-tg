import FS from "fs";


interface Rates {
    success:   boolean;
    timestamp: number;
    base:      string;
    date:      Date;
    rates:     { [key: string]: number };
}
interface Symbols {
    success: boolean;
    symbols: { [key: string]: string };
}

export class Base{
    symbols: Symbols | undefined;
    rates: Rates | undefined;
    apiToken:string;
    constructor(apiToken:string){
        this.apiToken = apiToken;
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
    get _rates(){
       return this.rates; 
    };
    get _symbols(){
        return this.symbols;
    };
};
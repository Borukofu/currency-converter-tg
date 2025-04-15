"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const fs_1 = __importDefault(require("fs"));
class Base {
    symbols;
    rates;
    apiToken;
    constructor(apiToken) {
        this.apiToken = apiToken;
        // ################## rates
        if (!fs_1.default.existsSync(__dirname + "/rates.json")) {
            console.log("no rates file created new and get rates from api token!");
            fetch(`http://data.fixer.io/api/latest?access_key=${this.apiToken}`)
                .then(r => {
                r.json().then(v => {
                    if (v.success) {
                        console.log("create file rates");
                        this.rates = v;
                        fs_1.default.writeFileSync(__dirname + "/rates.json", JSON.stringify(v));
                    }
                    else {
                        console.error("false in response", v);
                        process.exit(1);
                    }
                    ;
                });
            })
                .catch(er => {
                console.error(er);
                process.exit(1);
            });
        }
        else {
            console.log("read file rates");
            let buff = fs_1.default.readFileSync(__dirname + "/rates.json");
            this.rates = JSON.parse(buff.toString());
        }
        // #################################### symbols
        if (!fs_1.default.existsSync(__dirname + "/symbols.json")) {
            console.log("no symbols file created new and get symbols from api token!");
            fetch(`https://data.fixer.io/api/symbols?access_key=${this.apiToken}`)
                .then(r => {
                r.json().then(v => {
                    if (v.success) {
                        console.log("create symbols file");
                        this.symbols = v;
                        fs_1.default.writeFileSync(__dirname + "/symbols.json", JSON.stringify(v));
                    }
                    ;
                });
            })
                .catch(er => {
                console.error(er);
                process.exit(1);
            });
        }
        else {
            console.log("read file symbols");
            let buff = fs_1.default.readFileSync(__dirname + "/symbols.json");
            this.symbols = JSON.parse(buff.toString());
        }
        ;
    }
    ;
    reloadAll() {
        this.reloadRates();
        this.reloadSymbols();
    }
    ;
    reloadRates() {
        console.log("reload Rates", Date.now());
        fetch(`http://data.fixer.io/api/latest?access_key=${this.apiToken}`)
            .then(r => {
            r.json().then(v => {
                if (v.success) {
                    console.log("create file rates");
                    this.rates = v;
                    fs_1.default.writeFileSync(__dirname + "/rates.json", JSON.stringify(v));
                }
                else {
                    console.error("false in response", v);
                    process.exit(1);
                }
                ;
            });
        })
            .catch(er => {
            console.error(er);
            process.exit(1);
        });
    }
    ;
    reloadSymbols() {
        console.log("reload Symbols", Date.now());
        fetch(`https://data.fixer.io/api/symbols?access_key=${this.apiToken}`)
            .then(r => {
            r.json().then(v => {
                if (v.success) {
                    console.log("create symbols file");
                    this.symbols = v;
                    fs_1.default.writeFileSync(__dirname + "/symbols.json", JSON.stringify(v));
                }
                ;
            });
        })
            .catch(er => {
            console.error(er);
            process.exit(1);
        });
    }
    ;
    get _rates() {
        return this.rates;
    }
    ;
    get _symbols() {
        return this.symbols;
    }
    ;
}
exports.Base = Base;
;

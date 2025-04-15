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
    date;
    _setShedule() {
        setInterval(() => {
            let nowDate = new Date();
            if (this.date.getDate() != nowDate.getDate()) {
                this.date = nowDate;
                this.reloadRates();
            }
        }, 60000);
    }
    ;
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.date = new Date();
        this._setShedule();
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
    isSymbols(Symbol) {
        for (const key in this.symbols?.symbols) {
            if (Symbol.toLowerCase() === key.toLowerCase()) {
                return {
                    key: key,
                    info: this.symbols.symbols[key]
                };
            }
        }
        return null;
    }
    ;
    _value(Symbol) {
        if (this.isSymbols(Symbol) != null) {
            for (const key in this.rates?.rates) {
                if (Symbol.toUpperCase() === key) {
                    return this.rates.rates[key];
                }
            }
        }
        return NaN;
    }
    ;
    convert(config) {
        const value = config.value;
        let ratesDirt = config.rates;
        let rates = [];
        let notAproveRates = [];
        for (let rate of ratesDirt) {
            if (this.isSymbols(rate) != null) {
                rates.push(rate);
            }
            else {
                notAproveRates.push(rate);
            }
        }
        if (rates.length >= 2) {
            let mainRate = rates[0];
            let text = "";
            for (let i = 1; i < rates.length; i++) {
                let out = (this._value("EUR") / this._value(mainRate)) / (this._value("EUR") / this._value(rates[i])) * Number(value);
                text += `${value} ${mainRate.toUpperCase()} --> ${rates[i].toUpperCase()} ${out}\n`;
                // AUD/AOA = (EUR/AOA) / (EUR/AUD) = 1040.321339 / 1.778801 = 584.849203
            }
            if (notAproveRates.length != 0) {
                text += `there are no such currencies and they were skipped: ${notAproveRates}`;
            }
            return text;
        }
        else {
            let text = `there are no such currencies and they were skipped: ${notAproveRates}`;
            return text;
        }
    }
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

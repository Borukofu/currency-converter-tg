"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const fs_1 = __importDefault(require("fs"));
class Base {
    _setShedule() {
        setInterval(() => {
            var _a, _b;
            let nowDate = new Date();
            let ratesDate = ((_a = this.rates) === null || _a === void 0 ? void 0 : _a.date) || "";
            if (ratesDate != nowDate.toISOString().split("T")[0]) {
                console.log((_b = this.rates) === null || _b === void 0 ? void 0 : _b.date, nowDate.toISOString().split("T")[0]);
                this.reloadRates();
            }
        }, 60000);
    }
    ;
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.date = new Date();
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
        setTimeout(() => {
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
            this._setShedule();
        }, 1000);
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
        var _a;
        for (const key in (_a = this.symbols) === null || _a === void 0 ? void 0 : _a.symbols) {
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
        var _a;
        if (this.isSymbols(Symbol) != null) {
            for (const key in (_a = this.rates) === null || _a === void 0 ? void 0 : _a.rates) {
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

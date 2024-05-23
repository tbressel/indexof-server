"use strict";
/////////////////////////////////////////////////
//////////  IMPORTATIONS & DEFINITIONS  /////////
/////////////////////////////////////////////////
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express importation
const express_1 = __importDefault(require("express"));
const api = (0, express_1.default)();
// Body Parser Middleware to check data body from http request & configuration
const body_parser_1 = require("../../middlewares/body-parser");
api.use(body_parser_1.urlEncodedParser);
api.use(body_parser_1.jsonParser);
// Mysql library importation and pool connection creation
const DatabaseConfig_1 = __importDefault(require("../../DatabaseConfig"));
const mysql_1 = __importDefault(require("mysql"));
const dbconnect = mysql_1.default.createPool(DatabaseConfig_1.default.getDbConfig());
api.post('/signin', (req, res) => {
    // read the datas from the POST request
    let { user_name, user_firstname, user_nickname, user_email, user_password } = req.body;
    let action = req.query.action;
    // check if the action is valid
    if (!action || action !== "signin") {
        res.status(500).json({
            message: "The action is not valid",
            body: action
        });
        return;
    }
    else {
        res.status(200).json({
            message: "The action is valid",
            body: action
        });
    }
});
exports.default = api;

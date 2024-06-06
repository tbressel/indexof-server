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
/////////////////////////////////////////////////
//////////  MIDDLEWARS IMPORTATIONS   ///////////
/////////////////////////////////////////////////
// Body Parser Middleware to check data body from http request & configuration
const body_parser_1 = require("../../middlewares/body-parser");
api.use(body_parser_1.urlEncodedParser);
api.use(body_parser_1.jsonParser);
/////////////////////////////////////////////////
//////////  LIBRARIES  IMPORTATIONS   ///////////
/////////////////////////////////////////////////
// Mysql library importation and pool connection creation
const DatabaseConfig_1 = __importDefault(require("../../DatabaseConfig"));
const mysql_1 = __importDefault(require("mysql"));
const dbconnect = mysql_1.default.createPool(DatabaseConfig_1.default.getDbConfig());
// Validator library importation to check and clean datas from request
const validator_1 = __importDefault(require("validator"));
/////////////////////////////////////////////////
////////////  MODULES  IMPORTATIONS   ///////////
/////////////////////////////////////////////////
// To manage errors and success messages
const notificationMessages = require('../../modules/notifications').notificationMessages;
const { getJsonResponse, JsonResponse } = require('../../modules/notifications');
////////////////////////////////////////////////////
////////////////////////////////////////////////////
//////////////     CHECK WITH EMAIL   //////////////
////////////////////////////////////////////////////
///////////////////////////////////////////////////
api.post('/check-email', (req, res) => {
    // read the datas from the POST request
    let { user_email } = req.body;
    // check if email it not empty
    if (!user_email) {
        getJsonResponse(res, 500, "missing-email", notificationMessages, false);
        return;
    }
    // clean email against XSS failure
    user_email = validator_1.default.blacklist(user_email, '\\<\\>\\{\\}\\[\\]\\(\\)');
    user_email = validator_1.default.escape(user_email);
    // check if email is valid and the right format
    if (!validator_1.default.isEmail(user_email)) {
        getJsonResponse(res, 500, "invalid-email", notificationMessages, false);
        return;
    }
    // Connect to the database
    dbconnect.getConnection((error, connection) => {
        // Check if we can connect to the database
        if (error) {
            getJsonResponse(res, 500, "dbconnect-error", notificationMessages, false);
            return;
        }
        console.log("Connexion à la base de donnée");
        // Get stat about connection states
        const allConnections = dbconnect._allConnections.length;
        console.log("Nombres de connexions : ", allConnections);
        const connectionsLimit = dbconnect.config.connectionLimit;
        console.log("Nombre max autorisé : ", connectionsLimit);
        // Check if we reached the maximum of connection allowed
        if (allConnections >= connectionsLimit) {
            getJsonResponse(res, 500, "maxconnect-reached", notificationMessages, false);
            connection.release();
            return;
        }
        // Prepare query to check if the email exists
        const sql = "SELECT user_email FROM user_ WHERE user_email = ?";
        // Execute the query
        connection.query(sql, [user_email], (error, results) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }
            console.log("Mon resutlat : ", results);
            const queryResult = results.length;
            // Check if email IS or NOT in the database
            if (queryResult === 0 || !queryResult || queryResult === undefined) {
                getJsonResponse(res, 401, "email-failure", notificationMessages, false);
                connection.release();
                return;
            }
            else {
                getJsonResponse(res, 200, "email-success", notificationMessages, true);
                connection.release();
            }
        });
        console.log('connexion relaché, connexion restante : ', allConnections);
    });
});
exports.default = api;

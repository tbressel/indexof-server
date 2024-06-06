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
// Import Bcrypt library to hash password
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Import to generate a token
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/////////////////////////////////////////////////
////////////  MODULES  IMPORTATIONS   ///////////
/////////////////////////////////////////////////
// To manage errors and success messages
const notificationMessages = require('../../modules/notifications').notificationMessages;
const { getJsonResponse, JsonResponse } = require('../../modules/notifications');
const pool_1 = require("../../modules/pool");
const JwtConfig_1 = __importDefault(require("../../JwtConfig"));
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
        // Check if we reached the maximum of connection allowed
        if ((0, pool_1.isMaxConnectionReached)(dbconnect)) {
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
        console.log('connexion relaché');
    });
});
api.post('/check-password', (req, res) => {
    // read the datas from the POST request
    let { user_email, user_password } = req.body;
    // check if email and password it not empty
    if (!user_email || !user_password) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }
    // clean email against XSS failure
    user_email = validator_1.default.blacklist(user_email, '\\<\\>\\{\\}\\[\\]\\(\\)');
    user_email = validator_1.default.escape(user_email);
    // clean password against XSS failure
    user_password = validator_1.default.blacklist(user_password, '\\<\\>\\{\\}\\[\\]\\(\\)');
    user_password = validator_1.default.escape(user_password);
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
        // Prepare query to check if the email exists
        const sql = "SELECT user_email, user_password FROM user_ WHERE user_email = ?";
        // Execute the query
        connection.query(sql, [user_email], (error, results) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }
            console.log("Mon resutlat : ", results);
            const queryResultLength = results.length;
            const queryResults = results;
            // Check if email IS or NOT in the database
            if (queryResultLength === 0 || !queryResultLength || queryResultLength === undefined) {
                getJsonResponse(res, 401, "datas-failure", notificationMessages, false);
                connection.release();
                return;
            }
            else {
                console.log("resultat : ", queryResults[0].user_email);
                console.log("resultat : ", queryResults[0].user_password);
                // compare the password with the hashed password
                const user_password_hashed = queryResults[0].user_password;
                bcryptjs_1.default.compare(user_password, user_password_hashed, (error, isMatch) => {
                    if (error) {
                        getJsonResponse(res, 500, "compare-failure", notificationMessages, false);
                        connection.release();
                        return;
                    }
                    // If the password is not valid
                    if (!isMatch) {
                        getJsonResponse(res, 401, "password-failure", notificationMessages, false);
                        connection.release();
                        return;
                    }
                    else {
                        // Build a json web token 
                        const jwtSecretKeys = JwtConfig_1.default.getSecretKeys();
                        console.log(jwtSecretKeys.secretKey);
                        if (jwtSecretKeys.secretKey) {
                            const sessionToken = jsonwebtoken_1.default.sign({
                                user_email: queryResults[0].user_email,
                            }, jwtSecretKeys.secretKey, { expiresIn: '1h' });
                        }
                        // If the password is valid
                        getJsonResponse(res, 200, "datas-success", notificationMessages, true);
                        connection.release();
                    }
                });
            }
        });
    });
});
exports.default = api;

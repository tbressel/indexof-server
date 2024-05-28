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
const { notificationMessages, NotificationMessages } = require('../../modules/notifications');
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
        getJsonResponse(res, 500, "missing-email", notificationMessages);
        return;
    }
    // clean email against XSS failure
    user_email = validator_1.default.blacklist(user_email, '\\<\\>\\{\\}\\[\\]\\(\\)');
    user_email = validator_1.default.escape(user_email);
    // check if email is valid and the right format
    if (!validator_1.default.isEmail(user_email)) {
        getJsonResponse(res, 500, "invalid-email", notificationMessages);
        return;
    }
    // Connect to the database
    dbconnect.getConnection((error, connection) => {
        const allConnections = 9;
        // const allConnections: number = (dbconnect as any)._allConnections.length
        const connectionsLimit = dbconnect.config.connectionLimit;
        // Check if we reached the maximum of connection allowed
        if (allConnections >= connectionsLimit) {
            getJsonResponse(res, 500, "maxconnect-reached", notificationMessages);
            connection.release();
            return;
        }
        // Check if we can connect to the database
        if (error) {
            getJsonResponse(res, 500, "dbconnect-error", notificationMessages);
            return;
        }
        //  const allConnections: any = (dbconnect as any)._allConnections.length;
        //  console.log(allConnections);
        connection.release();
        getJsonResponse(res, 500, "dbconnect-success", notificationMessages);
    });
});
// ////////////////////////////////////////////////////
// ////////////////////////////////////////////////////
// //////////////   CREATE A NEW ACCOUNT   ////////////
// ////////////////////////////////////////////////////
// ////////////////////////////////////////////////////
// interface SigninRequest {
//     user_name: string;
//     user_email: string;
//     user_password: string;
// }
// api.post('/signin', (req: Request, res: Response) => {
//     // read the datas from the POST request
//     let { user_name, user_email, user_password } = req.body as SigninRequest;
//     let action = req.query.action as string;
//     //Check if the action is valid
//     if (!action) {
//         getJsonResponse(res, 500, "missing-action", notificationMessages);
//         return;
//     } else if( action !== 'signin') {
//         getJsonResponse(res, 500, "invalid-action", notificationMessages);
//         return;
//     } 
//     // Check if 
//     if (!user_name || !user_email || !user_password) {
//         getJsonResponse(res, 500, "missing-action", notificationMessages);
//         return;
//     }
// });
exports.default = api;

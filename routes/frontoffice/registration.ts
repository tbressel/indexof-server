/////////////////////////////////////////////////
//////////  IMPORTATIONS & DEFINITIONS  /////////
/////////////////////////////////////////////////

// Express importation
import express, { Express, Request, Response } from 'express';
const api: Express = express();

/////////////////////////////////////////////////
//////////  MIDDLEWARS IMPORTATIONS   ///////////
/////////////////////////////////////////////////

// Body Parser Middleware to check data body from http request & configuration
import { urlEncodedParser, jsonParser } from '../../middlewares/body-parser';
api.use(urlEncodedParser);
api.use(jsonParser);

/////////////////////////////////////////////////
//////////  LIBRARIES  IMPORTATIONS   ///////////
/////////////////////////////////////////////////

// Mysql library importation and pool connection creation
import DatabaseConfig from '../../DatabaseConfig';
import mysql, { PoolConnection } from 'mysql';
const dbconnect = mysql.createPool(DatabaseConfig.getDbConfig());

// Validator library importation to check and clean datas from request
import validator from 'validator';

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




api.post('/check-email', (req: Request, res: Response) => {

    // read the datas from the POST request
    let { user_email } = req.body as { user_email: string };

    // check if email it not empty
    if (!user_email) {
        getJsonResponse(res, 500, "missing-email", notificationMessages);
        return;
    }

    // clean email against XSS failure
    user_email = validator.blacklist(user_email, '\\<\\>\\{\\}\\[\\]\\(\\)');
    user_email = validator.escape(user_email);

    // check if email is valid and the right format
    if (!validator.isEmail(user_email)) {
        getJsonResponse(res, 500, "invalid-email", notificationMessages);
        return;
    }

    // Connect to the database
    dbconnect.getConnection((error: Error, connection: PoolConnection) => {

        // Get stat about connection states
        const allConnections: number = (dbconnect as any)._allConnections.length
        const connectionsLimit: number = (dbconnect as any).config.connectionLimit

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


        connection.release();
        getJsonResponse(res, 500, "dbconnect-success", notificationMessages);

    })
})
    






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




export default api;




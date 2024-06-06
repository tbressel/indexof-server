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
const notificationMessages: NotificationMessages = require('../../modules/notifications').notificationMessages;
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
        getJsonResponse(res, 500, "missing-email", notificationMessages, false);
        return;
    }

    // clean email against XSS failure
    user_email = validator.blacklist(user_email, '\\<\\>\\{\\}\\[\\]\\(\\)');
    user_email = validator.escape(user_email);

    // check if email is valid and the right format
    if (!validator.isEmail(user_email)) {
        getJsonResponse(res, 500, "invalid-email", notificationMessages, false);
        return;
    }

    // Connect to the database
    dbconnect.getConnection((error: Error, connection: PoolConnection) => {
        // Check if we can connect to the database
        if (error) {
            getJsonResponse(res, 500, "dbconnect-error", notificationMessages, false);
            return;
        }
        console.log("Connexion à la base de donnée")

        // Get stat about connection states
        const allConnections: number = (dbconnect as any)._allConnections.length
        console.log("Nombres de connexions : ", allConnections)
        const connectionsLimit: number = (dbconnect as any).config.connectionLimit
        console.log("Nombre max autorisé : ", connectionsLimit)

        // Check if we reached the maximum of connection allowed
        if (allConnections >= connectionsLimit) {
            getJsonResponse(res, 500, "maxconnect-reached", notificationMessages, false);
            connection.release();
            return;
        }

        // Prepare query to check if the email exists
        const sql = "SELECT user_email FROM user_ WHERE user_email = ?";

        // Execute the query
        connection.query(sql, [user_email], (error: any, results: Object | undefined) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }

            console.log("Mon resutlat : ", results)

            const queryResult = (results as Array<any>).length;

            // Check if email IS or NOT in the database
            if ( queryResult === 0 || !queryResult || queryResult === undefined ) {
                getJsonResponse(res, 401, "email-failure", notificationMessages, false);
                connection.release();
                return;
            } else {
                getJsonResponse(res, 200, "email-success", notificationMessages, true);
                connection.release();
            }
        });
        console.log('connexion relaché, connexion restante : ', allConnections)
    })
})


export default api;




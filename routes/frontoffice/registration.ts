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

// Import Bcrypt library to hash password
import bcrypt from 'bcryptjs';

// Import to generate a token
import jwt from 'jsonwebtoken';

/////////////////////////////////////////////////
////////////  MODULES  IMPORTATIONS   ///////////
/////////////////////////////////////////////////

// To manage errors and success messages
const notificationMessages: NotificationMessages = require('../../modules/notifications').notificationMessages;
const { getJsonResponse, JsonResponse } = require('../../modules/notifications');

import { isMaxConnectionReached } from '../../modules/pool';
import JwtConfig from '../../JwtConfig';


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


        // Check if we reached the maximum of connection allowed
        if (isMaxConnectionReached(dbconnect)) {
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
            if (queryResult === 0 || !queryResult || queryResult === undefined) {
                getJsonResponse(res, 401, "email-failure", notificationMessages, false);
                connection.release();
                return;
            } else {
                getJsonResponse(res, 200, "email-success", notificationMessages, true);
                connection.release();
            }
        });
        console.log('connexion relaché')
    })
})


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////     CHECK EMAIL WITH PASSWORD   ///////////////////
///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
interface QueryResult {
    user_email: string;
    user_password: string;
}


api.post('/check-password', (req: Request, res: Response) => {

    // read the datas from the POST request
    let { user_email, user_password } = req.body as { user_email: string, user_password: string };

    // check if email and password it not empty
    if (!user_email || !user_password) {
        getJsonResponse(res, 500, "missing-datas", notificationMessages, false);
        return;
    }


    // clean email against XSS failure
    user_email = validator.blacklist(user_email, '\\<\\>\\{\\}\\[\\]\\(\\)');
    user_email = validator.escape(user_email);

    // clean password against XSS failure
    user_password = validator.blacklist(user_password, '\\<\\>\\{\\}\\[\\]\\(\\)');
    user_password = validator.escape(user_password);


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


        // Prepare query to check if the email exists
        const sql = "SELECT user_email, user_password FROM user_ WHERE user_email = ?";

        // Execute the query
        connection.query(sql, [user_email], (error: any, results: Object | undefined) => {
            if (error) {
                getJsonResponse(res, 500, "request-failure", notificationMessages, false);
                connection.release();
                return;
            }

            console.log("Mon resutlat : ", results)
            const queryResultLength = (results as QueryResult[]).length;
            const queryResults = (results as QueryResult[]);

            // Check if email IS or NOT in the database
            if (queryResultLength === 0 || !queryResultLength || queryResultLength === undefined) {
                getJsonResponse(res, 401, "datas-failure", notificationMessages, false);
                connection.release();
                return;
            } else {
                console.log("resultat : ", queryResults[0].user_email)
                console.log("resultat : ", queryResults[0].user_password)

                // compare the password with the hashed password
                const user_password_hashed = queryResults[0].user_password;

                bcrypt.compare(user_password, user_password_hashed, (error: Error | null, isMatch: boolean) => {
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
                    } else {
                        // Build a json web token 
                        const jwtSecretKeys = JwtConfig.getSecretKeys();
                        console.log(jwtSecretKeys.secretKey);

                        if (jwtSecretKeys.secretKey) {
                            const sessionToken = jwt.sign(
                                {
                                    user_email: queryResults[0].user_email,
                                },
                                jwtSecretKeys.secretKey,
                                { expiresIn: '1h' }
                            );
                        }

                        // If the password is valid
                        getJsonResponse(res, 200, "datas-success", notificationMessages, true);
                        connection.release();
                    }
                })
            }
        });
    });
});

export default api;




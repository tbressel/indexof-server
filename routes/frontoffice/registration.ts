/////////////////////////////////////////////////
//////////  IMPORTATIONS & DEFINITIONS  /////////
/////////////////////////////////////////////////

// Express importation
import express, { Express, Request, Response } from 'express';
const api: Express = express();


// Body Parser Middleware to check data body from http request & configuration
import {urlEncodedParser, jsonParser} from '../../middlewares/body-parser';
api.use(urlEncodedParser);
api.use(jsonParser);

// Mysql library importation and pool connection creation
import DatabaseConfig from '../../DatabaseConfig';
import mysql from 'mysql';
const dbconnect = mysql.createPool(DatabaseConfig.getDbConfig());


////////////////////////////////////////////////////
////////////////////////////////////////////////////
//////////////   CREATE A NEW ACCOUNT   ////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
interface SigninRequest {
    user_name: string;
    user_firstname: string;
    user_nickname: string;
    user_email: string;
    user_password: string;
}

api.post('/signin', (req: Request, res: Response) => {

    // read the datas from the POST request
    let { user_name, user_firstname, user_nickname, user_email, user_password } = req.body as SigninRequest;
    let action = req.query.action;



    // check if the action is valid
    if (!action || action !== "signin") {
        res.status(500).json({
            message: "The action is not valid",
            body: action
        });
        return
    } else {

        
        res.status(200).json({
            message: "The action is valid",
            body: action
        });
    }
})




export default api;




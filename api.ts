/**
 * The main server file
 * @module index
 **/



////////////////////////////////////
//////////  IMPORTATIONS  /////////
///////////////////////////////////

// Express importation
import express, { Express } from 'express';

// routes importation
import usersRoute from './routes/backoffice/users';
import registrationRoute from './routes/frontoffice/registration'
import ServerConfig from './ServerConfig';


///////////////////////////////////////
//////////  DEFINITION USES  //////////
///////////////////////////////////////

// express definition
const api: Express = express();

// get port server number 
const configPortNumber: ServerConfig = ServerConfig.getApiListenPort();
api.listen(configPortNumber, () => {
    console.warn('Server listened on port number : ', configPortNumber);
});




////////////////////////////////////////
///////////  ROUTES DEFINITION /////////
////////////////////////////////////////

// use routes 
api.use('', usersRoute);
api.use('', registrationRoute);
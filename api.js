"use strict";
/**
 * The main server file
 * @module index
 **/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
////////////////////////////////////
//////////  IMPORTATIONS  /////////
///////////////////////////////////
// Express importation
const express_1 = __importDefault(require("express"));
// routes importation
const users_1 = __importDefault(require("./routes/backoffice/users"));
const registration_1 = __importDefault(require("./routes/frontoffice/registration"));
const ServerConfig_1 = __importDefault(require("./ServerConfig"));
///////////////////////////////////////
//////////  DEFINITION USES  //////////
///////////////////////////////////////
// express definition
const api = (0, express_1.default)();
// get port server number 
const configPortNumber = ServerConfig_1.default.getApiListenPort();
api.listen(configPortNumber, () => {
    console.warn('Server listened on port number : ', configPortNumber);
});
////////////////////////////////////////
///////////  ROUTES DEFINITION /////////
////////////////////////////////////////
// use routes 
api.use('', users_1.default);
api.use('', registration_1.default);

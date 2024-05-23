"use strict";
////////////////////////////////////
//////////  IMPORTATIONS  //////////
////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
class ServerConfig {
    static getApiListenPort() {
        const portConfig = process.env.API_LISTEN_PORT;
        if (portConfig == undefined) {
            console.error('No adress port defined for the server');
            process.exit(1);
        }
        else {
            const portNumber = parseInt(portConfig);
            return portNumber;
        }
    }
}
exports.default = ServerConfig;

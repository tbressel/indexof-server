"use strict";
////////////////////////////////////
//////////  IMPORTATIONS  //////////
////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
class DatabaseConfig {
    /**
     * Methode to get the whole database configuration
     */
    static getDbConfig() {
        return {
            connectionLimit: this.getPoolLimit(),
            host: this.getHostname(),
            user: this.getUsername(),
            password: this.getPassword(),
            database: this.getDataName(),
            port: this.getListenPort()
        };
    }
    /**
     * Method to get the number of pool connections.
     */
    static getPoolLimit() {
        const poolLimit = process.env.DB_CONNECTION_LIMIT;
        if (poolLimit === undefined) {
            console.error("No connection limit set fot the database");
        }
        else {
            return parseInt(poolLimit);
        }
    }
    /**
     * Method to get the port address of the database.
     */
    static getListenPort() {
        const portConfig = process.env.DB_PORT;
        if (portConfig === undefined) {
            console.error("No port set fot the database");
        }
        else {
            return parseInt(portConfig);
        }
    }
    /**
     * Method to get the name of the database.
     */
    static getDataName() {
        const dataName = process.env.DB_DATA;
        if (dataName === undefined) {
            console.error("No database name set");
        }
        return dataName;
    }
    /**
     * Method to get the name of the user.
     */
    static getUsername() {
        const username = process.env.DB_USER;
        if (username === undefined) {
            console.error("No database name set");
        }
        return username;
    }
    /**
     * Method to get the database password.
     */
    static getPassword() {
        const password = process.env.DB_PASS;
        if (password === undefined) {
            console.error("No password set for the database");
        }
        return password;
    }
    /**
     * Method to get the hostname.
     */
    static getHostname() {
        const hostname = process.env.DB_HOST;
        if (hostname === undefined) {
            console.error("No hostname set for the database");
        }
        return hostname;
    }
}
exports.default = DatabaseConfig;

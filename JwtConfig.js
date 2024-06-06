"use strict";
////////////////////////////////////
//////////  IMPORTATIONS  //////////
////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
class JwtConfig {
    /**
     *
     * Method to get different jwt secret keys
     *
     * @returns SecretKeys
     */
    static getSecretKeys() {
        return {
            secretKey: this.getJwtSecretKey(),
            refreshKey: this.getJwtRefreshKey(),
        };
    }
    /**
     *
     * Methode to get jwt secret key to generate the token
     *
     * @returns
     */
    static getJwtSecretKey() {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        if (jwtSecretKey === undefined) {
            console.error("No secret key has been defined for the token");
        }
        else {
            return jwtSecretKey;
        }
    }
    /**
     *
     * Methode to get jwt refresh secret key to refresh the token
     *
     * @returns
     */
    static getJwtRefreshKey() {
        const jwtRefreshKey = process.env.JWT_REFRESH_SECRET_KEY;
        if (jwtRefreshKey === undefined) {
            console.error("No refresh key has been defined for the token");
        }
        else {
            return jwtRefreshKey;
        }
    }
}
exports.default = JwtConfig;

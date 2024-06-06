////////////////////////////////////
//////////  IMPORTATIONS  //////////
////////////////////////////////////

require('dotenv').config();


interface SecretKeys {
    secretKey: string | undefined;
    refreshKey: string | undefined;
}



class JwtConfig {


    /**
     * 
     * Method to get different jwt secret keys
     * 
     * @returns SecretKeys
     */
    public static getSecretKeys(): SecretKeys {
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
    private static getJwtSecretKey(): string | undefined {
        const jwtSecretKey: string | undefined = process.env.JWT_SECRET_KEY;

        if (jwtSecretKey === undefined) {
            console.error("No secret key has been defined for the token")
        } else {
            return jwtSecretKey;
        }
    }


    /**
     * 
     * Methode to get jwt refresh secret key to refresh the token
     * 
     * @returns 
     */
    private static getJwtRefreshKey(): string | undefined {
        const jwtRefreshKey: string | undefined = process.env.JWT_REFRESH_SECRET_KEY;

        if (jwtRefreshKey === undefined) {
            console.error("No refresh key has been defined for the token")
        } else {
            return jwtRefreshKey;
        }
    }
}

export default JwtConfig
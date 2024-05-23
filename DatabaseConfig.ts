////////////////////////////////////
//////////  IMPORTATIONS  //////////
////////////////////////////////////

require('dotenv').config();



class DatabaseConfig {

    /**
     * Methode to get the whole database configuration
     */
    public static getDbConfig(): Object {
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
    private static getPoolLimit(): number | undefined {
        const poolLimit: string | undefined = process.env.DB_CONNECTION_LIMIT;
        if (poolLimit === undefined) {
            console.error("No connection limit set fot the database");
        } else {
            return parseInt(poolLimit);
        }
    }

    /**
     * Method to get the port address of the database.
     */
    private static getListenPort(): number | undefined {
        const portConfig: string | undefined = process.env.DB_PORT;
        if (portConfig === undefined) {
            console.error("No port set fot the database");
        } else {
            return parseInt(portConfig);
        }
    }


    /**
     * Method to get the name of the database.
     */
    private static getDataName(): string | undefined {
        const dataName: string | undefined = process.env.DB_DATA;
        if (dataName === undefined) {
            console.error("No database name set");
        }
        return dataName;
    }

    /**
     * Method to get the name of the user.
     */
    private static getUsername(): string | undefined {
        const username: string | undefined = process.env.DB_USER;
        if (username === undefined) {
            console.error("No database name set");
        }
        return username;
    }

    /**
     * Method to get the database password.
     */
    private static getPassword(): string | undefined {
        const password: string | undefined = process.env.DB_PASS;
        if (password === undefined) {
            console.error("No password set for the database");
        }
        return password;
    }

    /**
     * Method to get the hostname.
     */
    private static getHostname(): string | undefined {
        const hostname: string | undefined = process.env.DB_HOST;
        if (hostname === undefined) {
            console.error("No hostname set for the database");
        }
        return hostname;
    }
}

export default DatabaseConfig;
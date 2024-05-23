////////////////////////////////////
//////////  IMPORTATIONS  //////////
////////////////////////////////////

require('dotenv').config();



class ServerConfig {

    public static getApiListenPort(): number {

        const portConfig: string | undefined = process.env.API_LISTEN_PORT;

        if (portConfig == undefined) {
            console.error ('No adress port defined for the server');
            process.exit(1);
        } else {   
            const portNumber: number = parseInt(portConfig);
            return portNumber;
        }
    }
}

export default ServerConfig;
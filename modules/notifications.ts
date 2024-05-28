//////////////////////////////////////////////////
//////////////     TYPE DEFINITION   /////////////
//////////////////////////////////////////////////

interface NotificationMessages {
    [key: string]: string;
}

interface JsonResponse {
    messageKey: string;
    message: string;
}

//////////////////////////////////////////////////
//////////      RESPONSE TREATMENT   /////////////
//////////////////////////////////////////////////
/**
 * 
 * @param res : Contains the response in json format
 * @param statusNumber : Conatins the status number of the response
 * @param messageKey : Contains the key of the message to be displayed
 * @param notificationMessages :Contains the message corresponding to the key
 * @returns 
 */
function getJsonResponse(
    res: any,
    statusNumber :number,
    messageKey: keyof NotificationMessages,
    notificationMessages: NotificationMessages): JsonResponse {

    return res.status(statusNumber).json({
        messageKey: messageKey,
        message: notificationMessages[messageKey],
    });
}


//////////////////////////////////////////////////
//////////////      MESSAGES LIST    /////////////
//////////////////////////////////////////////////

const notificationMessages: NotificationMessages = {
    "missing-email": "The request misses the email",
    "invalid-email": "The email is not valid",
    "email-success": "The email is exists in the database",
    "email-failure": "The email dosn't exist in the database",
    "dbconnect-error": "Database connection has failed",
    "dbconnect-success": "Connection to the database is done !",
    "maxconnect-reached": "Too many connection to the database, please try later"
}


module.exports = {
    notificationMessages,
    getJsonResponse
}
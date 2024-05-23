/////////////////////////////////////////////////
//////////  IMPORTATIONS & DEFINITIONS  /////////
/////////////////////////////////////////////////

// import middlesware body-parser
import bodyParser, { BodyParser } from "body-parser";

// import express types
import { NextFunction, Request, Response } from "express";




/**
 * 
 * Middleware to parse url encoded data
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export function urlEncodedParser(req: Request, res: Response, next: NextFunction) {
    bodyParser.urlencoded({
        extended: true
    })
    (req, res, next)
};


/**
 * 
 * Middleware to convert datas into json format
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export function jsonParser (req: Request, res: Response, next: NextFunction) {
    bodyParser.json()
    (req, res, next)
}





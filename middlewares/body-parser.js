"use strict";
/////////////////////////////////////////////////
//////////  IMPORTATIONS & DEFINITIONS  /////////
/////////////////////////////////////////////////
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonParser = exports.urlEncodedParser = void 0;
// import middlesware body-parser
const body_parser_1 = __importDefault(require("body-parser"));
/**
 *
 * Middleware to parse url encoded data
 *
 * @param req
 * @param res
 * @param next
 */
function urlEncodedParser(req, res, next) {
    body_parser_1.default.urlencoded({
        extended: true
    })(req, res, next);
}
exports.urlEncodedParser = urlEncodedParser;
;
/**
 *
 * Middleware to convert datas into json format
 *
 * @param req
 * @param res
 * @param next
 */
function jsonParser(req, res, next) {
    body_parser_1.default.json()(req, res, next);
}
exports.jsonParser = jsonParser;

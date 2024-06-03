"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.verifyUser = void 0;
const error_middleware_1 = require("./error.middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyUser = (req, res, next) => {
    const validationReq = req;
    const { authorization } = validationReq.headers;
    if (!authorization) {
        throw new error_middleware_1.ResponseError(401, 'Please login to get access');
    }
    const token = authorization.split(' ')[1];
    const secret = process.env.JWT_SECRET;
    try {
        const jwtDecode = jsonwebtoken_1.default.verify(token, secret);
        if (typeof jwtDecode !== 'string') {
            validationReq.userData = jwtDecode;
        }
    }
    catch (error) {
        throw new error_middleware_1.ResponseError(401, 'Unauthorized');
    }
    next();
};
exports.verifyUser = verifyUser;
const adminOnly = (req, res, next) => {
    const validationReq = req;
    if (validationReq.userData.role !== 'admin') {
        throw new error_middleware_1.ResponseError(403, "You don't have permission");
    }
    next();
};
exports.adminOnly = adminOnly;

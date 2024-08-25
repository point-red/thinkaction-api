"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = exports.ResponseError2 = exports.ResponseError = void 0;
class ResponseError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.ResponseError = ResponseError;
class ResponseError2 extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.ResponseError2 = ResponseError2;
const errorMiddleware = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!err) {
        next();
        return;
    }
    console.log(err);
    if (err instanceof ResponseError) {
        res
            .status(err.status)
            .json({
            errors: err.message,
        })
            .end();
    }
    else if (err instanceof ResponseError2) {
        res
            .status(err.status)
            .json({
            errors: JSON.parse(err.message),
        })
            .end();
    }
    else {
        res
            .status(500)
            .json({
            errors: err.message,
        })
            .end();
    }
});
exports.errorMiddleware = errorMiddleware;

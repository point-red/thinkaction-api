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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashObject = exports.verify = exports.hash = void 0;
const argon2_1 = require("argon2");
const object_hash_1 = __importDefault(require("object-hash"));
const hash = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, argon2_1.hash)(data);
    }
    catch (error) {
        throw error;
    }
});
exports.hash = hash;
const verify = (encryptedData, plainData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, argon2_1.verify)(encryptedData, plainData);
    }
    catch (error) {
        throw error;
    }
});
exports.verify = verify;
const hashObject = (obj) => {
    return (0, object_hash_1.default)(obj);
};
exports.hashObject = hashObject;

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
exports.CloudStorage = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const crypto_1 = require("crypto");
dotenv_1.default.config();
class CloudStorage {
    static move(file) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!file) {
                    return null;
                }
                const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
                const body = [
                    `--${boundary}`,
                    `Content-Disposition: form-data; name="file"; filename="${file.originalname}"`,
                    `Content-Type: ${file.mimetype}`,
                    '',
                    file.buffer.toString('binary'),
                    `--${boundary}--`
                ].join('\r\n');
                const bodyBuffer = Buffer.from(body, 'binary');
                const response = yield axios_1.default.post(process.env.CLOUD_STORAGE + '/upload', bodyBuffer, {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${boundary}`,
                        'x-secret-key': process.env.SECRET_KEY || '',
                    },
                });
                const result = response.data;
                return (_a = result === null || result === void 0 ? void 0 : result.filename) !== null && _a !== void 0 ? _a : '';
            }
            catch (e) {
                console.log(e);
                throw new Error('Failed to upload');
            }
        });
    }
    static send(response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const imageBuffer = yield response.buffer();
            const name = (0, crypto_1.randomBytes)(16).toString('hex');
            const mimetype = ((_a = response === null || response === void 0 ? void 0 : response.headers) === null || _a === void 0 ? void 0 : _a.get('content-type')) || 'application/octet-stream';
            try {
                const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
                const body = [
                    `--${boundary}`,
                    `Content-Disposition: form-data; name="file"; filename="${name}"`,
                    `Content-Type: ${mimetype}`,
                    '',
                    imageBuffer.toString('binary'),
                    `--${boundary}--`
                ].join('\r\n');
                const bodyBuffer = Buffer.from(body, 'binary');
                const response = yield axios_1.default.post(process.env.CLOUD_STORAGE + '/upload', bodyBuffer, {
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${boundary}`,
                        'x-secret-key': process.env.SECRET_KEY || '',
                    },
                });
                const result = response.data;
                return (_b = result === null || result === void 0 ? void 0 : result.filename) !== null && _b !== void 0 ? _b : '';
            }
            catch (e) {
                console.log(e);
                throw new Error('Failed to upload');
            }
        });
    }
    static remove(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
}
exports.CloudStorage = CloudStorage;

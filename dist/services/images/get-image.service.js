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
const client_s3_1 = require("@aws-sdk/client-s3");
const image_entity_1 = __importDefault(require("../../entities/image.entity"));
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
class GetImageService {
    constructor() {
        this.s3 = new image_entity_1.default();
    }
    handle(Key) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.s3.bucket,
                Key
            });
            const data = yield (0, s3_request_presigner_1.getSignedUrl)(this.s3.client, command, { expiresIn: 36000 });
            return data;
        });
    }
}
exports.default = GetImageService;
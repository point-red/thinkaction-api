"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
class ImageEntity {
    constructor() {
        this.client = this.generateS3Client();
        this.bucket = process.env.S3_BUCKET;
    }
    generateS3Client() {
        return new client_s3_1.S3Client({
            region: 'ap-shouteast-1',
            useArnRegion: true,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
            }
        });
    }
}
exports.default = ImageEntity;

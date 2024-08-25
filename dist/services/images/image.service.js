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
exports.ImageService = void 0;
const cloud_storage_1 = require("../../utils/cloud-storage");
const uploader_1 = __importDefault(require("../uploader"));
// import GetImageService from "./get-image.service";
// import UploadImageService from "./upload-image.service";
const fs_1 = __importDefault(require("fs"));
class ImageService {
    static move(file) {
        return __awaiter(this, void 0, void 0, function* () {
            // const url = ''
            if (!Array.isArray(file)) {
                return this.move([file]);
            }
            return yield Promise.all(file.map(f => cloud_storage_1.CloudStorage.move(f)));
            // Local Save Configuration
            // const uploader = new Uploader(file);
            // return await uploader.move();
            // AWS Configuration
            // const uploadService = new UploadImageService();
            // if (Array.isArray(file)) {
            //   return file.map(async (f) => await uploadService.handle(f));
            // }
            // return uploadService.handle(file);
        });
    }
    static remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(key)) {
                key.forEach((k) => __awaiter(this, void 0, void 0, function* () {
                    yield ImageService.remove(k);
                }));
            }
            const path = yield ImageService.get(key);
            if (path) {
                fs_1.default.rmSync(path);
            }
        });
    }
    static replace(key, file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file) {
                return key;
            }
            if (key) {
                yield ImageService.remove(key);
            }
            return yield ImageService.move(file);
        });
    }
    static get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagePath = uploader_1.default.getPath(key);
            if (fs_1.default.existsSync(imagePath)) {
                // Set headers similar to file attachment
                return imagePath;
            }
            else {
                return null;
            }
            // AWS Configuration
            // return new GetImageService().handle(key);
        });
    }
}
exports.ImageService = ImageService;

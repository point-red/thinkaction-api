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
const path_1 = __importDefault(require("path"));
const cloud_storage_1 = require("../utils/cloud-storage");
class Uploader {
    constructor(files) {
        this.files = [];
        this.files = Array.isArray(files) ? files : !files ? null : [files];
    }
    move(uploadPath = '../images/') {
        const photos = this.files;
        let files = [];
        if (photos === null || photos === void 0 ? void 0 : photos.length) {
            photos.forEach((photo) => __awaiter(this, void 0, void 0, function* () {
                files.push(yield cloud_storage_1.CloudStorage.move(photo));
                // const _path = photo.path;
                // if (_path) {
                //   if (!fs.existsSync(path.join(__dirname, uploadPath))) {
                //     fs.mkdirSync(path.join(__dirname, uploadPath));
                //   }
                //   const newPath = path.join(__dirname, uploadPath + photo.filename);
                //   fs.renameSync(_path, newPath);
                //   files.push('images/' + photo.filename);
                // }
            }));
        }
        else {
            files = null;
        }
        return files;
    }
    static getPath(filename) {
        const _path = path_1.default.join(__dirname, '../images/' + filename);
        return _path;
    }
}
exports.default = Uploader;

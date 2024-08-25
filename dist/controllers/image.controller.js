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
const image_service_1 = require("../services/images/image.service");
class ImageController {
    constructor(getImageService, uploadImageService) {
        this.getImageService = getImageService;
        this.uploadImageService = uploadImageService;
    }
    getImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = yield image_service_1.ImageService.get(req.params.key);
                res.setHeader('Content-Disposition', `attachment; filename="${req.params.key}"`);
                if (!url) {
                    return res.status(404).send('Image not found.');
                }
                return res.sendFile(url);
                // AWS Configuration
                // res.status(200).json({ url })
            }
            catch (e) {
                next(e);
            }
        });
    }
    uploadImage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.file) {
                    const key = yield this.uploadImageService.handle(req.file);
                    res.status(200).json({ key });
                }
                else {
                    res.status(400).json({ errors: 'Image not attached' });
                }
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.default = ImageController;

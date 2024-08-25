"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const image_controller_1 = __importDefault(require("../../controllers/image.controller"));
const get_image_service_1 = __importDefault(require("../../services/images/get-image.service"));
const upload_image_service_1 = __importDefault(require("../../services/images/upload-image.service"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
const getImageService = new get_image_service_1.default();
const uploadImageService = new upload_image_service_1.default();
const imageController = new image_controller_1.default(getImageService, uploadImageService);
router.get('/:key', (req, res, next) => imageController.getImage(req, res, next));
router.post('/upload', upload.single('image'), (req, res, next) => imageController.uploadImage(req, res, next));
exports.default = router;

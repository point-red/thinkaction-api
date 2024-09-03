import { Router } from "express";
import { verifyUser } from "../../middleware/auth.middleware";
import path from "path";
import fs from 'fs';
import ImageController from "../../controllers/image.controller";
import GetImageService from "../../services/images/get-image.service";
import UploadImageService from "../../services/images/upload-image.service";
import ImageEntity from "../../entities/image.entity";
import multer from "multer";

const upload = multer()
const router = Router();

const getImageService = new GetImageService()
const uploadImageService = new UploadImageService()
const imageController = new ImageController(getImageService, uploadImageService)

router.get('/:key', (req, res, next) => imageController.getImage(req, res, next));
// router.post('/upload', upload.single('image'), (req, res, next) => imageController.uploadImage(req, res, next))

export default router;
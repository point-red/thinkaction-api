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

const s3 = new ImageEntity()
const getImageService = new GetImageService(s3)
const uploadImageService = new UploadImageService(s3)
const imageController = new ImageController(getImageService, uploadImageService)

router.get('/:key', imageController.getImage);
router.post('/upload', upload.single('image'), imageController.uploadImage)

export default router;
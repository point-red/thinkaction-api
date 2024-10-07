import { Router } from "express";
import ImageController from "../../controllers/image.controller";
import GetImageService from "../../services/images/get-image.service";
import UploadImageService from "../../services/images/upload-image.service";
import multer from "multer";

const router = Router();

const getImageService = new GetImageService()
const uploadImageService = new UploadImageService()
const imageController = new ImageController(getImageService, uploadImageService)

router.get('/:key', (req, res, next) => imageController.getImage(req, res, next));
// router.post('/upload', upload.single('image'), (req, res, next) => imageController.uploadImage(req, res, next))

export default router;
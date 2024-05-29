import { NextFunction, Request, Response } from "express";
import GetImageService from "../services/images/get-image.service";
import UploadImageService from "../services/images/upload-image.service";

export default class ImageController {
  private getImageService: GetImageService
  private uploadImageService: UploadImageService

  constructor(getImageService: GetImageService, uploadImageService: UploadImageService) {
    this.getImageService = getImageService
    this.uploadImageService = uploadImageService
  }

  public async getImage(req: Request, res: Response, next: NextFunction) {
    try {
      const url = await this.getImageService.handle(req.params.key)

      res.status(200).json({ url })
    } catch (e) {
      next(e)
    }
  }

  public async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      await this.uploadImageService.handle(req.file as Express.Multer.File)

      res.status(200).json({ success: true })
    } catch (e) {
      next(e)
    }
  }
}

import fetch, { Response } from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import axios from 'axios';
import { createHmac, randomBytes } from "crypto";
import UploadImageService from "../services/images/upload-image.service";
import RemoveImageService from "../services/images/remove-image.service";

dotenv.config();

export class CloudStorage {

  public static async move(file: Express.Multer.File) {
    try {
      if (!file) {
        return null;
      }
      const service = new UploadImageService();
      const key = await service.handle(file);
      return key;
    } catch (e) {
      throw new Error('Failed to upload');
    }
  }

  public static async send(response: Response) {
    const imageBuffer = await response.buffer();
    const name = randomBytes(16).toString('hex');
    const file = {
      buffer: imageBuffer,
      originalname: name,
    }
    try {
      const service = new UploadImageService();
      const key = await service.handle(file);
      return key;
    } catch (e) {
      throw new Error('Failed to upload');
    }
  }

  public static async remove(path: string) {
    const service = new RemoveImageService();
    const data = await service.handle(path);
    return !!data;
  }

}
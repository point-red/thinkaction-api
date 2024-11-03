import { CloudStorage } from "../../utils/cloud-storage";
import Uploader from "../uploader";
// import GetImageService from "./get-image.service";
// import UploadImageService from "./upload-image.service";
import fs from "fs";

export class ImageService {
  static async move(
    file: Express.Multer.File | Express.Multer.File[]
  ): Promise<string[]> {
    // const url = ''
    if (!Array.isArray(file)) {
      return this.move([file]);
    }
    return (await Promise.all(
      file.map((f) => CloudStorage.move(f))
    )) as string[];
    // Local Save Configuration
    // const uploader = new Uploader(file);
    // return await uploader.move();
    // AWS Configuration
    // const uploadService = new UploadImageService();
    // if (Array.isArray(file)) {
    //   return file.map(async (f) => await uploadService.handle(f));
    // }
    // return uploadService.handle(file);
  }
  static async remove(key: string | string[]): Promise<boolean[]> {
    if (!Array.isArray(key)) {
      return await this.remove([key] as string[]);
    }
    return await Promise.all(key.map((k) => CloudStorage.remove(k)));
    // const path = await ImageService.get(key as string);
    // if (path) {
    //   fs.rmSync(path);
    // }
  }
  static async replace(key: string, file: Express.Multer.File) {
    if (!file) {
      return key;
    }
    if (key) {
      await ImageService.remove(key);
    }
    return await ImageService.move(file);
  }
  static async get(key: string) {
    const imagePath = Uploader.getPath(key);
    if (fs.existsSync(imagePath)) {
      // Set headers similar to file attachment
      return imagePath;
    } else {
      return null;
    }
    // AWS Configuration
    // return new GetImageService().handle(key);
  }
}

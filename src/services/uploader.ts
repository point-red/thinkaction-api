import path from "path";
import fs from "fs";
import { CloudStorage } from "../utils/cloud-storage";

export default class Uploader {
  files: any = [];
  constructor(files: any) {
    this.files = Array.isArray(files) ? files : !files ? null : [files];
  }
  move(uploadPath = '../images/') {
    const photos = this.files;
    let files: any = [];
    if (photos?.length) {
      photos.forEach(async (photo: any) => {
        files.push(await CloudStorage.move(photo));
        // const _path = photo.path;
        // if (_path) {
        //   if (!fs.existsSync(path.join(__dirname, uploadPath))) {
        //     fs.mkdirSync(path.join(__dirname, uploadPath));
        //   }
        //   const newPath = path.join(__dirname, uploadPath + photo.filename);
        //   fs.renameSync(_path, newPath);
        //   files.push('images/' + photo.filename);
        // }
      });
    } else {
      files = null;
    }
    return files;
  }
  static getPath(filename: string) {
    const _path = path.join(__dirname, '../images/' + filename);
    return _path;
  }
}
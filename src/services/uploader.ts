import path from "path";
import fs from "fs";

export default class Uploader {
    files: any = [];
    constructor(files: any) {
        this.files = files;
    }
    move(uploadPath = '../images/'){
        const photos = this.files;
        let files: any = [];
        if (photos?.length) {
          photos.forEach((photo: any) => {
            const _path = photo.path;
            if (_path) {
              if (!fs.existsSync(path.join(__dirname, ))) {
                fs.mkdirSync(path.join(__dirname, uploadPath));
              }
              const newPath = path.join(__dirname, uploadPath + photo.filename);
              fs.renameSync(_path, newPath);
              files.push('images/' + photo.filename);
            }
          });
        } else {
          files = null;
        }
        return files;
    }
}
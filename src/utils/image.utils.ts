import multerS3 from 'multer-s3'
import ImageEntity from "../entities/image.entity";

export const storage = multerS3({
  s3: new ImageEntity().client,
  bucket: process.env.S3_BUCKET as string,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: function (req, file, cb) {
    cb(null, {fieldName: file.fieldname});
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString())
  }
})

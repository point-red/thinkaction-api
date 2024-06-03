import { PutObjectCommand } from "@aws-sdk/client-s3";
import ImageEntity from "../../entities/image.entity";

export default class UploadImageService {
  private s3: ImageEntity

  constructor(s3: ImageEntity) {
    this.s3 = s3
  }

  async handle(file: Express.Multer.File) {
    const command = new PutObjectCommand({
      Bucket: this.s3.bucket,
      Key: file.originalname,
      Body: file.buffer
    })

    await this.s3.client.send(command)
    return command.input.Key
  }
}
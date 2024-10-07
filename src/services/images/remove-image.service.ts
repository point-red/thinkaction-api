import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import ImageEntity from "../../entities/image.entity";

export default class RemoveImageService {
  private s3: ImageEntity

  constructor() {
    this.s3 = new ImageEntity();
  }

  async handle(Key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.s3.bucket,
      Key,
    })

    await this.s3.client.send(command)
    return command.input.Key
  }
}
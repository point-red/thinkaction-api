import { GetObjectCommand } from "@aws-sdk/client-s3";
import ImageEntity from "../../entities/image.entity";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default class GetImageService {
  private s3: ImageEntity

  constructor(s3: ImageEntity) {
    this.s3 = s3
  }

  async handle(Key: string) {
    const command = new GetObjectCommand({
      Bucket: this.s3.bucket,
      Key
    })

    const data = await getSignedUrl(this.s3.client, command, { expiresIn: 36000 })
    return data
  }
}
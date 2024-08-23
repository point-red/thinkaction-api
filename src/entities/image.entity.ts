import { S3Client } from "@aws-sdk/client-s3"

export interface S3ImageObject {
  bucket: string
  key: string
}

export default class ImageEntity {
  client: S3Client
  bucket: string

  constructor() {
    this.client = this.generateS3Client()
    this.bucket = process.env.S3_BUCKET as string
  }

  private generateS3Client() {
    return new S3Client({
      region: 'ap-shouteast-1',
      useArnRegion: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string
      }
    })
  }
}
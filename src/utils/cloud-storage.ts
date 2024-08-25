import fetch, { Response } from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
import axios from 'axios';
import { randomBytes } from "crypto";

dotenv.config();

export class CloudStorage {

  public static async move(file: Express.Multer.File) {
    try {
      if (!file) {
        return null;
      }
      const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
      const body = [
        `--${boundary}`,
        `Content-Disposition: form-data; name="file"; filename="${file.originalname}"`,
        `Content-Type: ${file.mimetype}`,
        '',
        file.buffer.toString('binary'),
        `--${boundary}--`
      ].join('\r\n');
      const bodyBuffer = Buffer.from(body, 'binary');

      const response = await axios.post(process.env.CLOUD_STORAGE + '/upload', bodyBuffer, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'x-secret-key': process.env.SECRET_KEY || '',
        },
      })
      const result = response.data;
      return result?.filename ?? '';
    } catch (e) {
      console.log(e);
      throw new Error('Failed to upload');
    }
  }

  public static async send(response: Response) {
    const imageBuffer = await response.buffer();
    const name = randomBytes(16).toString('hex');
    const mimetype = response?.headers?.get('content-type') || 'application/octet-stream'
    try {
      const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
      const body = [
        `--${boundary}`,
        `Content-Disposition: form-data; name="file"; filename="${name}"`,
        `Content-Type: ${mimetype}`,
        '',
        imageBuffer.toString('binary'),
        `--${boundary}--`
      ].join('\r\n');
      const bodyBuffer = Buffer.from(body, 'binary');

      const response = await axios.post(process.env.CLOUD_STORAGE + '/upload', bodyBuffer, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'x-secret-key': process.env.SECRET_KEY || '',
        },
      })
      const result = response.data;
      return result?.filename ?? '';
    } catch (e) {
      console.log(e);
      throw new Error('Failed to upload');
    }
  }

  public static async remove(path: string) {
    return true;
  }

}
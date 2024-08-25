import fs from 'fs';
import fetch from 'node-fetch';

export async function downloadImage(url: string, filePath: string) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch image. Status: ${response.status}`);
    }

    const fileStream = fs.createWriteStream(filePath);
    response.body?.pipe(fileStream);

    return new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });
  } catch (error) {
    console.error('Error downloading the image:', error);
    throw error;
  }
}

export const getResponse = async (url: string) => {
  try {
    const response = await fetch(url);
    return response;
  } catch (error) {
    console.error('Error downloading the image:', error);
    throw error;
  }
}

export default {
  downloadImage,
  getResponse,
}
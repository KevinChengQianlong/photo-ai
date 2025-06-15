import * as Crypto from 'expo-crypto';
import meituConfig from '@/constants/meituConfig';
import { hmacSHA256 } from 'react-native-hmac';

const { MEITU_API_KEY, MEITU_SECRET_KEY } = meituConfig;

const BASE_URL = 'https://openapi.meitu.com';

interface MeituApiResponse {
  code: number;
  msg: string;
  data: any;
}

async function signRequest(timestamp: number, nonce: string, body: string): Promise<string> {
  const rawString = `nonce=${nonce}&timestamp=${timestamp}&body=${body}`;
  const signature = await hmacSHA256(rawString, MEITU_SECRET_KEY);
  return signature;
}

export async function uploadIdPhoto(imageUri: string, imageBase64: string): Promise<string> {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 15);

  const requestBody = JSON.stringify({
    image_base64: imageBase64,
    // 其他参数根据美图API文档添加，例如尺寸、背景色等
  });

  const signature = await signRequest(timestamp, nonce, requestBody);

  const headers = {
    'Content-Type': 'application/json',
    'x-nonce': nonce,
    'x-timestamp': timestamp.toString(),
    'x-app-key': MEITU_API_KEY,
    'x-signature': signature,
  };

  try {
    const response = await fetch(`${BASE_URL}/id_photo/make_watermark`, {
      method: 'POST',
      headers: headers,
      body: requestBody,
    });

    const data: MeituApiResponse = await response.json();

    if (data.code === 0) {
      return data.data.image_uri;
    } else {
      throw new Error(`美图API错误: ${data.msg}`);
    }
  } catch (error) {
    console.error('上传证件照失败:', error);
    throw error;
  }
}

// 更多API函数，例如查询无水印图片，可以在这里添加 
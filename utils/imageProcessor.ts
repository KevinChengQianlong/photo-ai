import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

export interface ImageSize {
  width: number;
  height: number;
}

export const PHOTO_SIZES = {
  '1inch': { width: 295, height: 413 }, // 一寸照片尺寸
  '2inch': { width: 413, height: 579 }, // 二寸照片尺寸
};

export class ImageProcessor {
  /**
   * 调整图片尺寸
   */
  static async resizeImage(
    uri: string,
    size: ImageSize,
    format: SaveFormat = SaveFormat.JPEG
  ): Promise<string> {
    try {
      const result = await manipulateAsync(
        uri,
        [{ resize: size }],
        { format, compress: 1 }
      );
      return result.uri;
    } catch (error) {
      console.error('调整图片尺寸失败:', error);
      throw error;
    }
  }

  /**
   * 处理背景色
   */
  static async processBackground(
    uri: string,
    backgroundColor: string,
    format: SaveFormat = SaveFormat.JPEG
  ): Promise<string> {
    try {
      // 1. 先调整图片尺寸为标准尺寸
      const imageInfo = await this.getImageInfo(uri);
      const standardSize = PHOTO_SIZES['1inch']; // 使用一寸照片尺寸作为标准
      
      // 2. 调整图片尺寸
      const resizedImage = await this.resizeImage(uri, standardSize, format);
      
      // 3. 创建带背景色的图片
      // TODO: 使用 expo-image-manipulator 或其他库实现背景色处理
      // 这里需要实现具体的背景色处理逻辑
      
      return resizedImage; // 临时返回调整尺寸后的图片
    } catch (error) {
      console.error('处理背景色失败:', error);
      throw error;
    }
  }

  /**
   * 保存图片到临时目录
   */
  static async saveToTemp(uri: string): Promise<string> {
    try {
      const tempDir = FileSystem.cacheDirectory;
      const fileName = `photo_${Date.now()}.jpg`;
      const tempUri = `${tempDir}${fileName}`;
      
      await FileSystem.copyAsync({
        from: uri,
        to: tempUri
      });
      
      return tempUri;
    } catch (error) {
      console.error('保存图片到临时目录失败:', error);
      throw error;
    }
  }

  /**
   * 获取图片信息
   */
  static async getImageInfo(uri: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = reject;
      img.src = uri;
    });
  }

  /**
   * 清理临时文件
   */
  static async cleanupTempFiles(): Promise<void> {
    try {
      const tempDir = FileSystem.cacheDirectory;
      if (tempDir) {
        await FileSystem.deleteAsync(tempDir, { idempotent: true });
      }
    } catch (error) {
      console.error('清理临时文件失败:', error);
    }
  }
} 
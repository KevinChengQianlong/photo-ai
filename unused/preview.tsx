import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function PreviewScreen() {
  const { imageUri, backgroundColor } = useLocalSearchParams();
  const router = useRouter();

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('需要访问相册权限才能保存图片！');
        return;
      }

      // TODO: 实现图片背景色处理
      const processedImageUri = imageUri as string;

      const asset = await MediaLibrary.createAssetAsync(processedImageUri);
      await MediaLibrary.createAlbumAsync('证件照', asset, false);
      
      alert('图片已保存到相册！');
    } catch (error) {
      console.error('保存图片失败:', error);
      alert('保存图片失败，请重试！');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        url: imageUri as string,
        message: '我的证件照',
      });
    } catch (error) {
      console.error('分享失败:', error);
      alert('分享失败，请重试！');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewContainer}>
        <Image 
          source={{ uri: imageUri as string }} 
          style={styles.previewImage}
        />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
          <Text style={styles.actionButtonText}>保存到相册</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionButtonText}>分享</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.newPhotoButton]} 
          onPress={() => router.push('/upload')}
        >
          <Text style={styles.actionButtonText}>拍摄新照片</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newPhotoButton: {
    backgroundColor: '#34C759',
  },
}); 
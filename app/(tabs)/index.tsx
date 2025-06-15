import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { uploadIdPhoto } from '@/utils/meituApi';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const pickImage = async (source: 'camera' | 'gallery') => {
    let result;
    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4], // 证件照常用比例
        quality: 1,
        base64: true, // 请求Base64编码的图片
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
        base64: true,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      const base64 = result.assets[0].base64;

      if (base64) {
        await uploadAndDisplayPhoto(uri, base64);
      } else if (uri) {
        // Fallback for when base64 is not directly available (though it should be with base64: true)
        const fileInfo = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        await uploadAndDisplayPhoto(uri, fileInfo);
      }
    } else if (result.canceled) {
      Alert.alert('提示', '操作已取消');
    }
  };

  const uploadAndDisplayPhoto = async (uri: string, base64: string) => {
    setIsUploading(true);
    try {
      const uploadedImageUrl = await uploadIdPhoto(uri, base64);
      setSelectedImageUri(uploadedImageUrl); // 显示美图API返回的图片URL
      router.push({
        pathname: 'edit' as any, // 跳转到编辑页面
        params: { imageUri: uploadedImageUrl },
      });
    } catch (error) {
      console.error('上传照片失败:', error);
      Alert.alert('错误', `上传照片失败: ${(error as Error).message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI证件照</Text>
        <Text style={styles.subtitle}>快速生成专业证件照</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <FontAwesome name="magic" size={24} color="#007AFF" />
            <Text style={styles.featureText}>智能背景替换</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="crop" size={24} color="#007AFF" />
            <Text style={styles.featureText}>标准尺寸裁剪</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="smile-o" size={24} color="#007AFF" />
            <Text style={styles.featureText}>智能美颜</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]} 
            onPress={() => pickImage('camera')}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <FontAwesome name="camera" size={24} color="#fff" />
                <Text style={styles.buttonText}>拍照</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => pickImage('gallery')}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#007AFF" />
            ) : (
              <>
                <FontAwesome name="photo" size={24} color="#007AFF" />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>从相册选择</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {selectedImageUri && (
          <View style={styles.uploadedImageContainer}>
            <Text style={styles.uploadedImageText}>上传的图片:</Text>
            <Image source={{ uri: selectedImageUri }} style={styles.uploadedImage} />
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  featureList: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  featureText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  actionButtons: {
    gap: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  uploadedImageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  uploadedImageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  uploadedImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

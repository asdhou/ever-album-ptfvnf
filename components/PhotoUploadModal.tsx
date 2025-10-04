
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

interface PhotoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onPhotosSelected: (photos: ImagePicker.ImagePickerAsset[]) => void;
}

export default function PhotoUploadModal({
  visible,
  onClose,
  onPhotosSelected,
}: PhotoUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '需要权限',
        '请授予访问相册的权限以上传照片。'
      );
      return false;
    }
    return true;
  };

  const pickFromLibrary = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsUploading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1, // Original quality for no compression
        exif: true,
      });

      if (!result.canceled && result.assets) {
        onPhotosSelected(result.assets);
        onClose();
      }
    } catch (error) {
      console.log('Error picking images:', error);
      Alert.alert('错误', '从相册选择图片失败');
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '需要权限',
        '请授予访问相机的权限以拍摄照片。'
      );
      return;
    }

    setIsUploading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1, // Original quality for no compression
        exif: true,
      });

      if (!result.canceled && result.assets) {
        onPhotosSelected(result.assets);
        onClose();
      }
    } catch (error) {
      console.log('Error taking photo:', error);
      Alert.alert('错误', '拍摄照片失败');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>添加照片</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <TouchableOpacity
              style={[buttonStyles.primary, styles.option]}
              onPress={pickFromLibrary}
              disabled={isUploading}
            >
              <IconSymbol name="photo.on.rectangle" size={24} color={colors.card} />
              <Text style={[commonStyles.buttonText, styles.optionText]}>
                从相册选择
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[buttonStyles.accent, styles.option]}
              onPress={takePhoto}
              disabled={isUploading}
            >
              <IconSymbol name="camera" size={24} color={colors.card} />
              <Text style={[commonStyles.buttonText, styles.optionText]}>
                拍摄照片
              </Text>
            </TouchableOpacity>

            {isUploading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>正在处理照片...</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 16,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
});

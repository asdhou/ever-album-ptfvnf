
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { IconSymbol } from '@/components/IconSymbol';
import PhotoGrid from '@/components/PhotoGrid';
import AlbumCard from '@/components/AlbumCard';
import PhotoUploadModal from '@/components/PhotoUploadModal';
import CreateAlbumModal from '@/components/CreateAlbumModal';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Photo {
  id: string;
  uri: string;
  name: string;
  date: string;
  size: number;
  album?: string;
}

interface Album {
  id: string;
  name: string;
  photoCount: number;
  coverPhoto?: string;
  createdAt: string;
}

export default function HomeScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'photos' | 'albums'>('photos');
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [createAlbumModalVisible, setCreateAlbumModalVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  // Initialize with some sample albums
  useEffect(() => {
    const sampleAlbums: Album[] = [
      {
        id: '1',
        name: '家庭照片',
        photoCount: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: '2024年旅行',
        photoCount: 0,
        createdAt: new Date().toISOString(),
      },
    ];
    setAlbums(sampleAlbums);
  }, []);

  const handlePhotosSelected = (selectedAssets: ImagePicker.ImagePickerAsset[]) => {
    console.log('Photos selected:', selectedAssets.length);
    
    const newPhotos: Photo[] = selectedAssets.map((asset, index) => ({
      id: `photo_${Date.now()}_${index}`,
      uri: asset.uri,
      name: asset.fileName || `照片 ${Date.now()}`,
      date: new Date().toISOString(),
      size: asset.fileSize || 0,
    }));

    setPhotos(prev => [...newPhotos, ...prev]);
    
    Alert.alert(
      '成功',
      `已成功添加 ${newPhotos.length} 张照片！`
    );
  };

  const handlePhotoPress = (photo: Photo) => {
    if (selectionMode) {
      togglePhotoSelection(photo.id);
    } else {
      // TODO: Open photo viewer
      console.log('Open photo viewer for:', photo.name);
      Alert.alert('照片查看器', `正在打开 ${photo.name}`);
    }
  };

  const handlePhotoLongPress = (photo: Photo) => {
    if (!selectionMode) {
      setSelectionMode(true);
      setSelectedPhotos([photo.id]);
    }
  };

  const togglePhotoSelection = (photoId: string) => {
    setSelectedPhotos(prev => {
      if (prev.includes(photoId)) {
        const newSelection = prev.filter(id => id !== photoId);
        if (newSelection.length === 0) {
          setSelectionMode(false);
        }
        return newSelection;
      } else {
        return [...prev, photoId];
      }
    });
  };

  const handleCreateAlbum = (name: string) => {
    const newAlbum: Album = {
      id: `album_${Date.now()}`,
      name,
      photoCount: 0,
      createdAt: new Date().toISOString(),
    };

    setAlbums(prev => [newAlbum, ...prev]);
    Alert.alert('成功', `相册"${name}"创建成功！`);
  };

  const handleAlbumPress = (album: Album) => {
    // TODO: Navigate to album view
    console.log('Open album:', album.name);
    Alert.alert('相册查看', `正在打开相册：${album.name}`);
  };

  const deleteSelectedPhotos = () => {
    Alert.alert(
      '删除照片',
      `确定要删除 ${selectedPhotos.length} 张照片吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setPhotos(prev => prev.filter(photo => !selectedPhotos.includes(photo.id)));
            setSelectedPhotos([]);
            setSelectionMode(false);
          },
        },
      ]
    );
  };

  const renderHeaderRight = () => (
    <View style={styles.headerButtons}>
      {selectionMode ? (
        <TouchableOpacity
          onPress={deleteSelectedPhotos}
          style={styles.headerButton}
        >
          <IconSymbol name="trash" size={20} color={colors.error} />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => setViewMode(viewMode === 'photos' ? 'albums' : 'photos')}
            style={styles.headerButton}
          >
            <IconSymbol 
              name={viewMode === 'photos' ? 'folder' : 'photo'} 
              size={20} 
              color={colors.primary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUploadModalVisible(true)}
            style={styles.headerButton}
          >
            <IconSymbol name="plus" size={20} color={colors.primary} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderHeaderLeft = () => {
    if (selectionMode) {
      return (
        <TouchableOpacity
          onPress={() => {
            setSelectionMode(false);
            setSelectedPhotos([]);
          }}
          style={styles.headerButton}
        >
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const getTitle = () => {
    if (selectionMode) {
      return `已选择 ${selectedPhotos.length} 张`;
    }
    return viewMode === 'photos' ? '照片' : '相册';
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <Stack.Screen
        options={{
          title: getTitle(),
          headerRight: renderHeaderRight,
          headerLeft: renderHeaderLeft,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
        }}
      />

      <View style={commonStyles.container}>
        {viewMode === 'photos' ? (
          <PhotoGrid
            photos={photos}
            onPhotoPress={handlePhotoPress}
            onPhotoLongPress={handlePhotoLongPress}
            selectedPhotos={selectedPhotos}
          />
        ) : (
          <ScrollView 
            style={styles.albumsContainer}
            contentContainerStyle={styles.albumsContent}
          >
            <View style={styles.albumsHeader}>
              <Text style={commonStyles.subtitle}>我的相册</Text>
              <TouchableOpacity
                onPress={() => setCreateAlbumModalVisible(true)}
                style={styles.createAlbumButton}
              >
                <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
                <Text style={styles.createAlbumText}>创建相册</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.albumsGrid}>
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onPress={handleAlbumPress}
                />
              ))}
            </View>

            {albums.length === 0 && (
              <View style={[commonStyles.center, styles.emptyAlbums]}>
                <IconSymbol name="folder" size={64} color={colors.textSecondary} />
                <Text style={[commonStyles.text, styles.emptyText]}>暂无相册</Text>
                <Text style={[commonStyles.textSecondary, styles.emptySubtext]}>
                  创建您的第一个相册来整理照片
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <PhotoUploadModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        onPhotosSelected={handlePhotosSelected}
      />

      <CreateAlbumModal
        visible={createAlbumModalVisible}
        onClose={() => setCreateAlbumModalVisible(false)}
        onCreateAlbum={handleCreateAlbum}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  cancelText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  albumsContainer: {
    flex: 1,
  },
  albumsContent: {
    padding: 16,
    paddingBottom: 100, // Space for floating tab bar
  },
  albumsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  createAlbumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  createAlbumText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  albumsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyAlbums: {
    flex: 1,
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
  },
});

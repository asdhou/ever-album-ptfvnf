
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Photo {
  id: string;
  uri: string;
  name: string;
  date: string;
  size: number;
  album?: string;
}

interface PhotoGridProps {
  photos: Photo[];
  onPhotoPress: (photo: Photo) => void;
  onPhotoLongPress: (photo: Photo) => void;
  selectedPhotos?: string[];
  numColumns?: number;
}

const { width } = Dimensions.get('window');

export default function PhotoGrid({
  photos,
  onPhotoPress,
  onPhotoLongPress,
  selectedPhotos = [],
  numColumns = 3,
}: PhotoGridProps) {
  const itemSize = (width - 32 - (numColumns - 1) * 4) / numColumns;

  const renderPhoto = ({ item }: { item: Photo }) => {
    const isSelected = selectedPhotos.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.photoContainer, { width: itemSize, height: itemSize }]}
        onPress={() => onPhotoPress(item)}
        onLongPress={() => onPhotoLongPress(item)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.uri }} style={styles.photo} />
        {isSelected && (
          <View style={styles.selectedOverlay}>
            <View style={styles.checkmark}>
              <IconSymbol name="checkmark" size={16} color={colors.card} />
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (photos.length === 0) {
    return (
      <View style={[commonStyles.center, styles.emptyContainer]}>
        <IconSymbol name="photo" size={64} color={colors.textSecondary} />
        <Text style={[commonStyles.text, styles.emptyText]}>No photos yet</Text>
        <Text style={[commonStyles.textSecondary, styles.emptySubtext]}>
          Tap the + button to add your first photo
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      renderItem={renderPhoto}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={styles.gridContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: 16,
    paddingBottom: 100, // Space for floating tab bar
  },
  photoContainer: {
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(63, 81, 181, 0.3)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 8,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
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
  separator: {
    height: 4,
  },
});

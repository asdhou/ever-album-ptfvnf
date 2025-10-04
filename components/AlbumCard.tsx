
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles } from '@/styles/commonStyles';

interface Album {
  id: string;
  name: string;
  photoCount: number;
  coverPhoto?: string;
  createdAt: string;
}

interface AlbumCardProps {
  album: Album;
  onPress: (album: Album) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

export default function AlbumCard({ album, onPress }: AlbumCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `创建于 ${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }]}
      onPress={() => onPress(album)}
      activeOpacity={0.8}
    >
      <View style={styles.coverContainer}>
        {album.coverPhoto ? (
          <Image source={{ uri: album.coverPhoto }} style={styles.coverImage} />
        ) : (
          <View style={styles.placeholderCover}>
            <IconSymbol name="photo.stack" size={32} color={colors.textSecondary} />
          </View>
        )}
        <View style={styles.photoCountBadge}>
          <Text style={styles.photoCountText}>{album.photoCount}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.albumName} numberOfLines={1}>
          {album.name}
        </Text>
        <Text style={styles.createdDate}>
          {formatDate(album.createdAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    overflow: 'hidden',
  },
  coverContainer: {
    height: 120,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
  placeholderCover: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCountText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});


import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

interface CreateAlbumModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateAlbum: (name: string) => void;
}

export default function CreateAlbumModal({
  visible,
  onClose,
  onCreateAlbum,
}: CreateAlbumModalProps) {
  const [albumName, setAlbumName] = useState('');

  const handleCreate = () => {
    if (!albumName.trim()) {
      Alert.alert('Error', 'Please enter an album name');
      return;
    }

    onCreateAlbum(albumName.trim());
    setAlbumName('');
    onClose();
  };

  const handleClose = () => {
    setAlbumName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Album</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Album Name</Text>
            <TextInput
              style={[commonStyles.input, styles.input]}
              value={albumName}
              onChangeText={setAlbumName}
              placeholder="Enter album name"
              placeholderTextColor={colors.textSecondary}
              autoFocus
              maxLength={50}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[buttonStyles.outline, styles.button]}
                onPress={handleClose}
              >
                <Text style={commonStyles.buttonTextOutline}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[buttonStyles.primary, styles.button]}
                onPress={handleCreate}
              >
                <Text style={commonStyles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
});

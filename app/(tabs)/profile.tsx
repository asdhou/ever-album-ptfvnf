
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

interface StorageInfo {
  used: number;
  total: number;
  unit: string;
}

export default function ProfileScreen() {
  const [autoBackup, setAutoBackup] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const storageInfo: StorageInfo = {
    used: 0.3,
    total: 1,
    unit: 'GB',
  };

  const usagePercentage = (storageInfo.used / storageInfo.total) * 100;

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade Storage',
      'Choose your storage plan:\n\n• 5GB - $2.99/month\n• 15GB - $5.99/month\n• 50GB - $9.99/month\n• Unlimited - $19.99/month',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Choose Plan', onPress: () => console.log('Navigate to upgrade') },
      ]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      'Backup Photos',
      'Start backing up your photos to the cloud?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Backup', onPress: () => console.log('Start backup') },
      ]
    );
  };

  const handleExport = () => {
    Alert.alert(
      'Export Photos',
      'Export all your photos to device storage?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export photos') },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Sign out') },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[commonStyles.card, styles.profileHeader]}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <IconSymbol name="camera.fill" size={16} color={colors.card} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.email}>john.doe@example.com</Text>
          <TouchableOpacity style={[buttonStyles.outline, styles.editProfileButton]}>
            <Text style={commonStyles.buttonTextOutline}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Storage Info */}
        <View style={[commonStyles.card, styles.section]}>
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <Text style={commonStyles.subtitle}>Storage</Text>
            <TouchableOpacity onPress={handleUpgrade}>
              <Text style={styles.upgradeText}>Upgrade</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.storageBar}>
            <View style={[styles.storageUsed, { width: `${usagePercentage}%` }]} />
          </View>
          
          <Text style={styles.storageText}>
            {storageInfo.used} {storageInfo.unit} of {storageInfo.total} {storageInfo.unit} used
          </Text>
          
          <View style={styles.storageActions}>
            <TouchableOpacity 
              style={[buttonStyles.accent, styles.storageButton]}
              onPress={handleBackup}
            >
              <IconSymbol name="icloud.and.arrow.up" size={16} color={colors.card} />
              <Text style={[commonStyles.buttonText, styles.buttonText]}>Backup</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[buttonStyles.outline, styles.storageButton]}
              onPress={handleExport}
            >
              <IconSymbol name="square.and.arrow.up" size={16} color={colors.primary} />
              <Text style={[commonStyles.buttonTextOutline, styles.buttonText]}>Export</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={commonStyles.subtitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="icloud" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Auto Backup</Text>
                <Text style={styles.settingDescription}>
                  Automatically backup new photos
                </Text>
              </View>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="photo" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>High Quality Upload</Text>
                <Text style={styles.settingDescription}>
                  Upload original quality photos
                </Text>
              </View>
            </View>
            <Switch
              value={highQuality}
              onValueChange={setHighQuality}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="bell" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive backup and sharing notifications
                </Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.card}
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={[commonStyles.card, styles.section]}>
          <TouchableOpacity style={styles.actionItem}>
            <IconSymbol name="person.2" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Family Sharing</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={commonStyles.divider} />

          <TouchableOpacity style={styles.actionItem}>
            <IconSymbol name="shield" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Privacy & Security</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={commonStyles.divider} />

          <TouchableOpacity style={styles.actionItem}>
            <IconSymbol name="questionmark.circle" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>Help & Support</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={commonStyles.divider} />

          <TouchableOpacity style={styles.actionItem} onPress={handleSignOut}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for floating tab bar
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 16,
  },
  upgradeText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  storageBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  storageUsed: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  storageText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  storageActions: {
    flexDirection: 'row',
    gap: 12,
  },
  storageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  buttonText: {
    marginLeft: 6,
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
});

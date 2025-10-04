
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
      '升级存储空间',
      '选择您的存储套餐：\n\n• 5GB - ¥19.9/月\n• 15GB - ¥39.9/月\n• 50GB - ¥69.9/月\n• 无限制 - ¥129.9/月',
      [
        { text: '取消', style: 'cancel' },
        { text: '选择套餐', onPress: () => console.log('Navigate to upgrade') },
      ]
    );
  };

  const handleBackup = () => {
    Alert.alert(
      '备份照片',
      '开始将您的照片备份到云端？',
      [
        { text: '取消', style: 'cancel' },
        { text: '开始备份', onPress: () => console.log('Start backup') },
      ]
    );
  };

  const handleExport = () => {
    Alert.alert(
      '导出照片',
      '将所有照片导出到设备存储？',
      [
        { text: '取消', style: 'cancel' },
        { text: '导出', onPress: () => console.log('Export photos') },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '退出', style: 'destructive', onPress: () => console.log('Sign out') },
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
          <Text style={styles.name}>张三</Text>
          <Text style={styles.email}>zhangsan@example.com</Text>
          <TouchableOpacity style={[buttonStyles.outline, styles.editProfileButton]}>
            <Text style={commonStyles.buttonTextOutline}>编辑资料</Text>
          </TouchableOpacity>
        </View>

        {/* Storage Info */}
        <View style={[commonStyles.card, styles.section]}>
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <Text style={commonStyles.subtitle}>存储空间</Text>
            <TouchableOpacity onPress={handleUpgrade}>
              <Text style={styles.upgradeText}>升级</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.storageBar}>
            <View style={[styles.storageUsed, { width: `${usagePercentage}%` }]} />
          </View>
          
          <Text style={styles.storageText}>
            已使用 {storageInfo.used} {storageInfo.unit}，共 {storageInfo.total} {storageInfo.unit}
          </Text>
          
          <View style={styles.storageActions}>
            <TouchableOpacity 
              style={[buttonStyles.accent, styles.storageButton]}
              onPress={handleBackup}
            >
              <IconSymbol name="icloud.and.arrow.up" size={16} color={colors.card} />
              <Text style={[commonStyles.buttonText, styles.buttonText]}>备份</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[buttonStyles.outline, styles.storageButton]}
              onPress={handleExport}
            >
              <IconSymbol name="square.and.arrow.up" size={16} color={colors.primary} />
              <Text style={[commonStyles.buttonTextOutline, styles.buttonText]}>导出</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View style={[commonStyles.card, styles.section]}>
          <Text style={commonStyles.subtitle}>设置</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <IconSymbol name="icloud" size={20} color={colors.textSecondary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>自动备份</Text>
                <Text style={styles.settingDescription}>
                  自动备份新照片
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
                <Text style={styles.settingTitle}>高质量上传</Text>
                <Text style={styles.settingDescription}>
                  上传原始质量照片
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
                <Text style={styles.settingTitle}>通知</Text>
                <Text style={styles.settingDescription}>
                  接收备份和分享通知
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
            <Text style={styles.actionText}>家庭共享</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={commonStyles.divider} />

          <TouchableOpacity style={styles.actionItem}>
            <IconSymbol name="shield" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>隐私与安全</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={commonStyles.divider} />

          <TouchableOpacity style={styles.actionItem}>
            <IconSymbol name="questionmark.circle" size={20} color={colors.textSecondary} />
            <Text style={styles.actionText}>帮助与支持</Text>
            <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={commonStyles.divider} />

          <TouchableOpacity style={styles.actionItem} onPress={handleSignOut}>
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error }]}>退出登录</Text>
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

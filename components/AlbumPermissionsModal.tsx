
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'member' | 'child';
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'pending' | 'inactive';
}

interface SharedAlbum {
  id: string;
  name: string;
  creator: string;
  members: string[];
  permissions: {
    view: string[];
    upload: string[];
    edit: string[];
    delete: string[];
    download: string[];
  };
  photoCount: number;
  createdAt: string;
}

interface AlbumPermissionsModalProps {
  visible: boolean;
  onClose: () => void;
  album: SharedAlbum | null;
  members: FamilyMember[];
  onUpdatePermissions: (albumId: string, permissions: SharedAlbum['permissions']) => void;
}

export default function AlbumPermissionsModal({
  visible,
  onClose,
  album,
  members,
  onUpdatePermissions,
}: AlbumPermissionsModalProps) {
  const [permissions, setPermissions] = useState<SharedAlbum['permissions']>(
    album?.permissions || {
      view: [],
      upload: [],
      edit: [],
      delete: [],
      download: [],
    }
  );

  const [showAdvanced, setShowAdvanced] = useState(false);

  const permissionLabels = {
    view: '查看',
    upload: '上传',
    edit: '编辑',
    delete: '删除',
    download: '下载',
  };

  const permissionDescriptions = {
    view: '可以浏览相册中的照片',
    upload: '可以向相册添加新照片',
    edit: '可以编辑照片（裁剪、滤镜等）',
    delete: '可以删除相册中的照片',
    download: '可以下载照片到本地设备',
  };

  const permissionIcons = {
    view: 'eye',
    upload: 'plus.circle',
    edit: 'pencil',
    delete: 'trash',
    download: 'arrow.down.circle',
  };

  const togglePermission = (memberId: string, permission: keyof SharedAlbum['permissions']) => {
    setPermissions(prev => {
      const currentPermissions = prev[permission] || [];
      const hasPermission = currentPermissions.includes(memberId);
      
      return {
        ...prev,
        [permission]: hasPermission
          ? currentPermissions.filter(id => id !== memberId)
          : [...currentPermissions, memberId],
      };
    });
  };

  const setPresetPermissions = (memberId: string, preset: 'none' | 'viewer' | 'contributor' | 'admin') => {
    const presets = {
      none: {
        view: false,
        upload: false,
        edit: false,
        delete: false,
        download: false,
      },
      viewer: {
        view: true,
        upload: false,
        edit: false,
        delete: false,
        download: true,
      },
      contributor: {
        view: true,
        upload: true,
        edit: true,
        delete: false,
        download: true,
      },
      admin: {
        view: true,
        upload: true,
        edit: true,
        delete: true,
        download: true,
      },
    };

    const presetConfig = presets[preset];
    
    setPermissions(prev => {
      const newPermissions = { ...prev };
      
      Object.keys(presetConfig).forEach(permission => {
        const key = permission as keyof SharedAlbum['permissions'];
        const shouldHave = presetConfig[permission as keyof typeof presetConfig];
        const currentList = newPermissions[key] || [];
        const hasPermission = currentList.includes(memberId);
        
        if (shouldHave && !hasPermission) {
          newPermissions[key] = [...currentList, memberId];
        } else if (!shouldHave && hasPermission) {
          newPermissions[key] = currentList.filter(id => id !== memberId);
        }
      });
      
      return newPermissions;
    });
  };

  const handleSave = () => {
    if (!album) return;
    
    onUpdatePermissions(album.id, permissions);
    Alert.alert('成功', '权限设置已更新');
    onClose();
  };

  const getMemberPreset = (memberId: string): string => {
    const memberPermissions = {
      view: permissions.view?.includes(memberId) || false,
      upload: permissions.upload?.includes(memberId) || false,
      edit: permissions.edit?.includes(memberId) || false,
      delete: permissions.delete?.includes(memberId) || false,
      download: permissions.download?.includes(memberId) || false,
    };

    if (!memberPermissions.view) return 'none';
    if (memberPermissions.delete) return 'admin';
    if (memberPermissions.upload || memberPermissions.edit) return 'contributor';
    return 'viewer';
  };

  if (!album) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={commonStyles.subtitle}>权限设置</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
            {album.name}
          </Text>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {members.map((member) => (
              <View key={member.id} style={styles.memberSection}>
                <View style={styles.memberHeader}>
                  <View style={commonStyles.row}>
                    <IconSymbol name="person.circle.fill" size={32} color={colors.primary} />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={commonStyles.textSecondary}>{member.email}</Text>
                      <View style={[styles.roleTag, { 
                        backgroundColor: member.role === 'organizer' ? colors.primary : 
                                       member.role === 'child' ? colors.warning : colors.accent 
                      }]}>
                        <Text style={styles.roleText}>
                          {member.role === 'organizer' ? '组织者' : 
                           member.role === 'child' ? '儿童账户' : '成员'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* 预设权限 */}
                <View style={styles.presetSection}>
                  <Text style={styles.sectionTitle}>快速设置</Text>
                  <View style={styles.presetButtons}>
                    {[
                      { key: 'none', label: '无权限', color: colors.textSecondary },
                      { key: 'viewer', label: '查看者', color: colors.accent },
                      { key: 'contributor', label: '贡献者', color: colors.success },
                      { key: 'admin', label: '管理员', color: colors.secondary },
                    ].map((preset) => (
                      <TouchableOpacity
                        key={preset.key}
                        style={[
                          styles.presetButton,
                          getMemberPreset(member.id) === preset.key && styles.presetButtonActive,
                          { borderColor: preset.color }
                        ]}
                        onPress={() => setPresetPermissions(member.id, preset.key as any)}
                      >
                        <Text style={[
                          styles.presetButtonText,
                          getMemberPreset(member.id) === preset.key && { color: preset.color }
                        ]}>
                          {preset.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 详细权限 */}
                {showAdvanced && (
                  <View style={styles.detailedPermissions}>
                    <Text style={styles.sectionTitle}>详细权限</Text>
                    {Object.entries(permissionLabels).map(([permission, label]) => (
                      <View key={permission} style={styles.permissionItem}>
                        <View style={styles.permissionInfo}>
                          <IconSymbol 
                            name={permissionIcons[permission as keyof typeof permissionIcons] as any} 
                            size={16} 
                            color={colors.textSecondary} 
                          />
                          <View style={styles.permissionText}>
                            <Text style={styles.permissionLabel}>{label}</Text>
                            <Text style={styles.permissionDescription}>
                              {permissionDescriptions[permission as keyof typeof permissionDescriptions]}
                            </Text>
                          </View>
                        </View>
                        <Switch
                          value={permissions[permission as keyof SharedAlbum['permissions']]?.includes(member.id) || false}
                          onValueChange={() => togglePermission(member.id, permission as keyof SharedAlbum['permissions'])}
                          trackColor={{ false: colors.border, true: colors.primary }}
                          thumbColor={colors.card}
                        />
                      </View>
                    ))}
                  </View>
                )}

                {/* 特殊提示 */}
                {member.role === 'child' && (
                  <View style={styles.childWarning}>
                    <IconSymbol name="exclamationmark.triangle" size={16} color={colors.warning} />
                    <Text style={styles.childWarningText}>
                      儿童账户的上传内容可能需要家长审批
                    </Text>
                  </View>
                )}
              </View>
            ))}

            {/* 高级选项切换 */}
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
            >
              <Text style={styles.advancedToggleText}>
                {showAdvanced ? '隐藏' : '显示'}详细权限设置
              </Text>
              <IconSymbol 
                name={showAdvanced ? 'chevron.up' : 'chevron.down'} 
                size={16} 
                color={colors.primary} 
              />
            </TouchableOpacity>

            {/* 安全提示 */}
            <View style={styles.securityTip}>
              <IconSymbol name="shield" size={16} color={colors.accent} />
              <Text style={styles.securityTipText}>
                建议定期检查和更新权限设置，确保家庭照片的安全
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
              onPress={onClose}
            >
              <Text style={commonStyles.buttonTextOutline}>取消</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
              onPress={handleSave}
            >
              <Text style={commonStyles.buttonText}>保存</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    width: '95%',
    maxHeight: '90%',
    padding: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    maxHeight: 500,
    padding: 20,
  },
  memberSection: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberHeader: {
    marginBottom: 16,
  },
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  roleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 4,
  },
  roleText: {
    fontSize: 10,
    color: colors.card,
    fontWeight: '600',
  },
  presetSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  presetButtonActive: {
    backgroundColor: colors.card,
    borderWidth: 2,
  },
  presetButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailedPermissions: {
    marginTop: 16,
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  permissionText: {
    marginLeft: 12,
    flex: 1,
  },
  permissionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  permissionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  childWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  childWarningText: {
    fontSize: 12,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
  advancedToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 16,
  },
  advancedToggleText: {
    fontSize: 14,
    color: colors.primary,
    marginRight: 8,
  },
  securityTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.accent + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  securityTipText: {
    fontSize: 12,
    color: colors.accent,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

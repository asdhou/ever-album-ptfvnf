
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
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

interface FamilyGroup {
  id: string;
  name: string;
  organizer: string;
  members: FamilyMember[];
  createdAt: string;
  maxMembers: number;
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

interface Invitation {
  id: string;
  email: string;
  status: 'sent' | 'accepted' | 'expired' | 'cancelled';
  sentAt: string;
  expiresAt: string;
}

export default function FamilyScreen() {
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [sharedAlbums, setSharedAlbums] = useState<SharedAlbum[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showInviteMember, setShowInviteMember] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<SharedAlbum | null>(null);
  const [groupName, setGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'albums' | 'members' | 'settings'>('overview');

  // 智能推荐设置
  const [smartSuggestions, setSmartSuggestions] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(true);
  const [notifications, setNotifications] = useState({
    newPhotos: true,
    comments: true,
    invitations: true,
    approvals: true,
  });

  // 家长控制设置
  const [parentalControls, setParentalControls] = useState({
    requireApproval: true,
    restrictDownload: true,
    contentFilter: true,
  });

  useEffect(() => {
    // 初始化示例数据
    const sampleGroup: FamilyGroup = {
      id: 'group_1',
      name: '张家大院',
      organizer: 'user_1',
      maxMembers: 6,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'user_1',
          name: '张爸爸',
          email: 'zhangbaba@example.com',
          role: 'organizer',
          joinedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: 'user_2',
          name: '张妈妈',
          email: 'zhangmama@example.com',
          role: 'member',
          joinedAt: new Date().toISOString(),
          status: 'active',
        },
        {
          id: 'user_3',
          name: '小明',
          email: 'xiaoming@example.com',
          role: 'child',
          joinedAt: new Date().toISOString(),
          status: 'active',
        },
      ],
    };

    const sampleAlbums: SharedAlbum[] = [
      {
        id: 'album_1',
        name: '2024家庭旅行',
        creator: 'user_1',
        members: ['user_1', 'user_2', 'user_3'],
        permissions: {
          view: ['user_1', 'user_2', 'user_3'],
          upload: ['user_1', 'user_2'],
          edit: ['user_1', 'user_2'],
          delete: ['user_1'],
          download: ['user_1', 'user_2'],
        },
        photoCount: 25,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'album_2',
        name: '宝宝成长记',
        creator: 'user_2',
        members: ['user_1', 'user_2'],
        permissions: {
          view: ['user_1', 'user_2'],
          upload: ['user_1', 'user_2'],
          edit: ['user_1', 'user_2'],
          delete: ['user_1', 'user_2'],
          download: ['user_1', 'user_2'],
        },
        photoCount: 156,
        createdAt: new Date().toISOString(),
      },
    ];

    const sampleInvitations: Invitation[] = [
      {
        id: 'inv_1',
        email: 'zhangye@example.com',
        status: 'sent',
        sentAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setFamilyGroup(sampleGroup);
    setSharedAlbums(sampleAlbums);
    setInvitations(sampleInvitations);
  }, []);

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('错误', '请输入群组名称');
      return;
    }

    const newGroup: FamilyGroup = {
      id: `group_${Date.now()}`,
      name: groupName,
      organizer: 'current_user',
      maxMembers: 6,
      createdAt: new Date().toISOString(),
      members: [
        {
          id: 'current_user',
          name: '我',
          email: 'current@example.com',
          role: 'organizer',
          joinedAt: new Date().toISOString(),
          status: 'active',
        },
      ],
    };

    setFamilyGroup(newGroup);
    setGroupName('');
    setShowCreateGroup(false);
    Alert.alert('成功', `家庭群组"${groupName}"创建成功！`);
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) {
      Alert.alert('错误', '请输入邮箱地址');
      return;
    }

    if (familyGroup && familyGroup.members.length >= familyGroup.maxMembers) {
      Alert.alert('错误', `群组成员已达上限（${familyGroup.maxMembers}人）`);
      return;
    }

    const newInvitation: Invitation = {
      id: `inv_${Date.now()}`,
      email: inviteEmail,
      status: 'sent',
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setInvitations(prev => [...prev, newInvitation]);
    setInviteEmail('');
    setShowInviteMember(false);
    Alert.alert('成功', `邀请已发送至 ${inviteEmail}`);
  };

  const handleCreateSharedAlbum = () => {
    if (!albumName.trim()) {
      Alert.alert('错误', '请输入相册名称');
      return;
    }

    const newAlbum: SharedAlbum = {
      id: `album_${Date.now()}`,
      name: albumName,
      creator: 'current_user',
      members: ['current_user'],
      permissions: {
        view: ['current_user'],
        upload: ['current_user'],
        edit: ['current_user'],
        delete: ['current_user'],
        download: ['current_user'],
      },
      photoCount: 0,
      createdAt: new Date().toISOString(),
    };

    setSharedAlbums(prev => [...prev, newAlbum]);
    setAlbumName('');
    setShowCreateAlbum(false);
    Alert.alert('成功', `共享相册"${albumName}"创建成功！`);
  };

  const handleRemoveMember = (memberId: string) => {
    if (!familyGroup) return;

    Alert.alert(
      '移除成员',
      '确定要移除此成员吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '移除',
          style: 'destructive',
          onPress: () => {
            setFamilyGroup(prev => prev ? {
              ...prev,
              members: prev.members.filter(m => m.id !== memberId)
            } : null);
          },
        },
      ]
    );
  };

  const handleResendInvitation = (invitationId: string) => {
    setInvitations(prev => prev.map(inv => 
      inv.id === invitationId 
        ? { ...inv, sentAt: new Date().toISOString(), status: 'sent' as const }
        : inv
    ));
    Alert.alert('成功', '邀请已重新发送');
  };

  const handleCancelInvitation = (invitationId: string) => {
    setInvitations(prev => prev.map(inv => 
      inv.id === invitationId 
        ? { ...inv, status: 'cancelled' as const }
        : inv
    ));
    Alert.alert('成功', '邀请已取消');
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'organizer': return '组织者';
      case 'member': return '成员';
      case 'child': return '儿童账户';
      default: return '未知';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return '已发送';
      case 'accepted': return '已接受';
      case 'expired': return '已过期';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  const renderOverview = () => (
    <ScrollView style={styles.tabContent}>
      {/* 群组信息 */}
      <View style={[commonStyles.card, styles.groupInfo]}>
        <View style={[commonStyles.row, commonStyles.spaceBetween]}>
          <View>
            <Text style={commonStyles.subtitle}>{familyGroup?.name || '未加入群组'}</Text>
            <Text style={commonStyles.textSecondary}>
              {familyGroup ? `${familyGroup.members.length}/${familyGroup.maxMembers} 成员` : '创建或加入家庭群组'}
            </Text>
          </View>
          <IconSymbol name="house.fill" size={32} color={colors.primary} />
        </View>
        
        {familyGroup && (
          <View style={styles.groupStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{sharedAlbums.length}</Text>
              <Text style={styles.statLabel}>共享相册</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {sharedAlbums.reduce((sum, album) => sum + album.photoCount, 0)}
              </Text>
              <Text style={styles.statLabel}>共享照片</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{invitations.filter(inv => inv.status === 'sent').length}</Text>
              <Text style={styles.statLabel}>待处理邀请</Text>
            </View>
          </View>
        )}
      </View>

      {/* 快速操作 */}
      <View style={[commonStyles.card, styles.quickActions]}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>快速操作</Text>
        
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowCreateAlbum(true)}
          >
            <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
            <Text style={styles.actionText}>创建相册</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowInviteMember(true)}
          >
            <IconSymbol name="person.badge.plus" size={24} color={colors.accent} />
            <Text style={styles.actionText}>邀请成员</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveTab('settings')}
          >
            <IconSymbol name="gear" size={24} color={colors.secondary} />
            <Text style={styles.actionText}>群组设置</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => Alert.alert('智能推荐', '基于人脸识别为您推荐分享对象')}
          >
            <IconSymbol name="brain.head.profile" size={24} color={colors.warning} />
            <Text style={styles.actionText}>智能推荐</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 最近活动 */}
      <View style={[commonStyles.card, styles.recentActivity]}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>最近活动</Text>
        
        <View style={styles.activityItem}>
          <IconSymbol name="photo.badge.plus" size={20} color={colors.success} />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>张妈妈 上传了 3 张照片</Text>
            <Text style={styles.activityTime}>2 小时前 • 宝宝成长记</Text>
          </View>
        </View>
        
        <View style={styles.activityItem}>
          <IconSymbol name="person.badge.plus" size={20} color={colors.accent} />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>邀请了新成员</Text>
            <Text style={styles.activityTime}>1 天前 • zhangye@example.com</Text>
          </View>
        </View>
        
        <View style={styles.activityItem}>
          <IconSymbol name="folder.badge.plus" size={20} color={colors.primary} />
          <View style={styles.activityText}>
            <Text style={styles.activityTitle}>创建了新相册</Text>
            <Text style={styles.activityTime}>3 天前 • 2024家庭旅行</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderAlbums = () => (
    <ScrollView style={styles.tabContent}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 16 }]}>
        <Text style={commonStyles.subtitle}>共享相册</Text>
        <TouchableOpacity onPress={() => setShowCreateAlbum(true)}>
          <IconSymbol name="plus.circle.fill" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {sharedAlbums.map((album) => (
        <View key={album.id} style={[commonStyles.card, styles.albumItem]}>
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <View style={styles.albumInfo}>
              <Text style={styles.albumName}>{album.name}</Text>
              <Text style={commonStyles.textSecondary}>
                {album.photoCount} 张照片 • {album.members.length} 名成员
              </Text>
              <Text style={styles.albumCreator}>
                创建者: {familyGroup?.members.find(m => m.id === album.creator)?.name || '未知'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setSelectedAlbum(album);
                setShowPermissions(true);
              }}
            >
              <IconSymbol name="gear" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.albumPermissions}>
            <View style={styles.permissionTag}>
              <IconSymbol name="eye" size={12} color={colors.accent} />
              <Text style={styles.permissionText}>查看: {album.permissions.view.length}</Text>
            </View>
            <View style={styles.permissionTag}>
              <IconSymbol name="plus" size={12} color={colors.success} />
              <Text style={styles.permissionText}>上传: {album.permissions.upload.length}</Text>
            </View>
            <View style={styles.permissionTag}>
              <IconSymbol name="pencil" size={12} color={colors.warning} />
              <Text style={styles.permissionText}>编辑: {album.permissions.edit.length}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderMembers = () => (
    <ScrollView style={styles.tabContent}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 16 }]}>
        <Text style={commonStyles.subtitle}>群组成员</Text>
        <TouchableOpacity onPress={() => setShowInviteMember(true)}>
          <IconSymbol name="person.badge.plus" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {familyGroup?.members.map((member) => (
        <View key={member.id} style={[commonStyles.card, styles.memberItem]}>
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <View style={commonStyles.row}>
              <IconSymbol name="person.circle.fill" size={40} color={colors.primary} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={commonStyles.textSecondary}>{member.email}</Text>
                <View style={[styles.roleTag, { backgroundColor: member.role === 'organizer' ? colors.primary : member.role === 'child' ? colors.warning : colors.accent }]}>
                  <Text style={styles.roleText}>{getRoleText(member.role)}</Text>
                </View>
              </View>
            </View>
            
            {member.role !== 'organizer' && (
              <TouchableOpacity
                onPress={() => handleRemoveMember(member.id)}
                style={styles.removeButton}
              >
                <IconSymbol name="minus.circle" size={20} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      {/* 邀请状态 */}
      {invitations.length > 0 && (
        <>
          <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 16 }]}>邀请状态</Text>
          {invitations.map((invitation) => (
            <View key={invitation.id} style={[commonStyles.card, styles.invitationItem]}>
              <View style={[commonStyles.row, commonStyles.spaceBetween]}>
                <View>
                  <Text style={styles.invitationEmail}>{invitation.email}</Text>
                  <Text style={commonStyles.textSecondary}>
                    {getStatusText(invitation.status)} • {new Date(invitation.sentAt).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={commonStyles.row}>
                  {invitation.status === 'sent' && (
                    <>
                      <TouchableOpacity
                        onPress={() => handleResendInvitation(invitation.id)}
                        style={[styles.invitationButton, { marginRight: 8 }]}
                      >
                        <Text style={styles.invitationButtonText}>重发</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleCancelInvitation(invitation.id)}
                        style={[styles.invitationButton, { backgroundColor: colors.error }]}
                      >
                        <Text style={styles.invitationButtonText}>取消</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.tabContent}>
      {/* 群组设置 */}
      <View style={[commonStyles.card, styles.settingsSection]}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>群组设置</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>群组名称</Text>
          <TextInput
            style={styles.settingInput}
            value={familyGroup?.name || ''}
            placeholder="输入群组名称"
            placeholderTextColor={colors.textSecondary}
          />
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>成员上限</Text>
          <Text style={styles.settingValue}>{familyGroup?.maxMembers || 6} 人</Text>
        </View>
      </View>

      {/* 智能功能 */}
      <View style={[commonStyles.card, styles.settingsSection]}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>智能功能</Text>
        
        <View style={styles.switchItem}>
          <View>
            <Text style={styles.switchLabel}>智能推荐分享</Text>
            <Text style={styles.switchDescription}>基于人脸识别推荐分享对象</Text>
          </View>
          <Switch
            value={smartSuggestions}
            onValueChange={setSmartSuggestions}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.switchItem}>
          <View>
            <Text style={styles.switchLabel}>自动同步</Text>
            <Text style={styles.switchDescription}>自动同步共享相册内容</Text>
          </View>
          <Switch
            value={autoSync}
            onValueChange={setAutoSync}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.switchItem}>
          <View>
            <Text style={styles.switchLabel}>仅Wi-Fi同步</Text>
            <Text style={styles.switchDescription}>仅在Wi-Fi环境下同步照片</Text>
          </View>
          <Switch
            value={wifiOnly}
            onValueChange={setWifiOnly}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </View>

      {/* 通知设置 */}
      <View style={[commonStyles.card, styles.settingsSection]}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>通知设置</Text>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>新照片上传</Text>
          <Switch
            value={notifications.newPhotos}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, newPhotos: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>照片评论</Text>
          <Switch
            value={notifications.comments}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, comments: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>相册邀请</Text>
          <Switch
            value={notifications.invitations}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, invitations: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>审批请求</Text>
          <Switch
            value={notifications.approvals}
            onValueChange={(value) => setNotifications(prev => ({ ...prev, approvals: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </View>

      {/* 家长控制 */}
      <View style={[commonStyles.card, styles.settingsSection]}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>家长控制</Text>
        
        <View style={styles.switchItem}>
          <View>
            <Text style={styles.switchLabel}>上传前询问</Text>
            <Text style={styles.switchDescription}>儿童账户上传照片需要审批</Text>
          </View>
          <Switch
            value={parentalControls.requireApproval}
            onValueChange={(value) => setParentalControls(prev => ({ ...prev, requireApproval: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.switchItem}>
          <View>
            <Text style={styles.switchLabel}>限制下载</Text>
            <Text style={styles.switchDescription}>限制儿童账户下载照片</Text>
          </View>
          <Switch
            value={parentalControls.restrictDownload}
            onValueChange={(value) => setParentalControls(prev => ({ ...prev, restrictDownload: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.switchItem}>
          <View>
            <Text style={styles.switchLabel}>内容过滤</Text>
            <Text style={styles.switchDescription}>自动过滤不适宜内容</Text>
          </View>
          <Switch
            value={parentalControls.contentFilter}
            onValueChange={(value) => setParentalControls(prev => ({ ...prev, contentFilter: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </View>

      {/* 危险操作 */}
      <View style={[commonStyles.card, styles.settingsSection]}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16, color: colors.error }]}>危险操作</Text>
        
        <TouchableOpacity
          style={[buttonStyles.outline, { borderColor: colors.error }]}
          onPress={() => Alert.alert('退出群组', '确定要退出家庭群组吗？')}
        >
          <Text style={[commonStyles.buttonTextOutline, { color: colors.error }]}>退出群组</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (!familyGroup) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={[commonStyles.container, commonStyles.center]}>
          <IconSymbol name="house" size={80} color={colors.textSecondary} />
          <Text style={[commonStyles.subtitle, { marginTop: 24, textAlign: 'center' }]}>
            欢迎使用家庭共享
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8, marginBottom: 32 }]}>
            创建家庭群组，与家人分享美好时光
          </Text>
          
          <TouchableOpacity
            style={[buttonStyles.primary, { marginBottom: 16 }]}
            onPress={() => setShowCreateGroup(true)}
          >
            <Text style={commonStyles.buttonText}>创建家庭群组</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={buttonStyles.outline}
            onPress={() => Alert.alert('加入群组', '请输入邀请码或扫描二维码')}
          >
            <Text style={commonStyles.buttonTextOutline}>加入现有群组</Text>
          </TouchableOpacity>
        </View>

        {/* 创建群组模态框 */}
        <Modal visible={showCreateGroup} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>创建家庭群组</Text>
              
              <TextInput
                style={[commonStyles.input, { marginBottom: 16 }]}
                placeholder="输入群组名称（如：张家大院）"
                placeholderTextColor={colors.textSecondary}
                value={groupName}
                onChangeText={setGroupName}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                  onPress={() => {
                    setShowCreateGroup(false);
                    setGroupName('');
                  }}
                >
                  <Text style={commonStyles.buttonTextOutline}>取消</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                  onPress={handleCreateGroup}
                >
                  <Text style={commonStyles.buttonText}>创建</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      {/* 标签栏 */}
      <View style={styles.tabBar}>
        {[
          { key: 'overview', label: '概览', icon: 'house' },
          { key: 'albums', label: '相册', icon: 'folder' },
          { key: 'members', label: '成员', icon: 'person.2' },
          { key: 'settings', label: '设置', icon: 'gear' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.tabItemActive]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <IconSymbol 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.tabLabel,
              activeTab === tab.key && styles.tabLabelActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 内容区域 */}
      <View style={commonStyles.container}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'albums' && renderAlbums()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'settings' && renderSettings()}
      </View>

      {/* 邀请成员模态框 */}
      <Modal visible={showInviteMember} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>邀请成员</Text>
            
            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="输入邮箱地址"
              placeholderTextColor={colors.textSecondary}
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
            />
            
            <Text style={[commonStyles.textSecondary, { marginBottom: 16 }]}>
              邀请链接将发送到此邮箱，有效期7天
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                onPress={() => {
                  setShowInviteMember(false);
                  setInviteEmail('');
                }}
              >
                <Text style={commonStyles.buttonTextOutline}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleInviteMember}
              >
                <Text style={commonStyles.buttonText}>发送邀请</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 创建相册模态框 */}
      <Modal visible={showCreateAlbum} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>创建共享相册</Text>
            
            <TextInput
              style={[commonStyles.input, { marginBottom: 16 }]}
              placeholder="输入相册名称（如：2024家庭旅行）"
              placeholderTextColor={colors.textSecondary}
              value={albumName}
              onChangeText={setAlbumName}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                onPress={() => {
                  setShowCreateAlbum(false);
                  setAlbumName('');
                }}
              >
                <Text style={commonStyles.buttonTextOutline}>取消</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[buttonStyles.primary, { flex: 1, marginLeft: 8 }]}
                onPress={handleCreateSharedAlbum}
              >
                <Text style={commonStyles.buttonText}>创建</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 权限设置模态框 */}
      <Modal visible={showPermissions} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              权限设置 - {selectedAlbum?.name}
            </Text>
            
            <ScrollView>
              {familyGroup?.members.map((member) => (
                <View key={member.id} style={styles.permissionMember}>
                  <View style={[commonStyles.row, { marginBottom: 8 }]}>
                    <IconSymbol name="person.circle.fill" size={24} color={colors.primary} />
                    <Text style={[styles.memberName, { marginLeft: 8 }]}>{member.name}</Text>
                  </View>
                  
                  <View style={styles.permissionOptions}>
                    {['view', 'upload', 'edit', 'delete', 'download'].map((permission) => (
                      <View key={permission} style={styles.permissionOption}>
                        <Text style={styles.permissionLabel}>
                          {permission === 'view' ? '查看' :
                           permission === 'upload' ? '上传' :
                           permission === 'edit' ? '编辑' :
                           permission === 'delete' ? '删除' : '下载'}
                        </Text>
                        <Switch
                          value={selectedAlbum?.permissions[permission as keyof typeof selectedAlbum.permissions]?.includes(member.id) || false}
                          onValueChange={(value) => {
                            // 这里应该更新权限逻辑
                            console.log(`Toggle ${permission} for ${member.name}: ${value}`);
                          }}
                          trackColor={{ false: colors.border, true: colors.primary }}
                          thumbColor={colors.card}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={[buttonStyles.primary, { marginTop: 16 }]}
              onPress={() => setShowPermissions(false)}
            >
              <Text style={commonStyles.buttonText}>完成</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  groupInfo: {
    marginBottom: 16,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  quickActions: {
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  recentActivity: {
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityText: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  albumItem: {
    marginBottom: 12,
  },
  albumInfo: {
    flex: 1,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  albumCreator: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  albumPermissions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  permissionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  permissionText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  memberItem: {
    marginBottom: 12,
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
  removeButton: {
    padding: 8,
  },
  invitationItem: {
    marginBottom: 12,
  },
  invitationEmail: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  invitationButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  invitationButtonText: {
    fontSize: 12,
    color: colors.card,
    fontWeight: '600',
  },
  settingsSection: {
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  settingInput: {
    ...commonStyles.input,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  switchDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  permissionMember: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  permissionOptions: {
    marginLeft: 32,
  },
  permissionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionLabel: {
    fontSize: 14,
    color: colors.text,
  },
});

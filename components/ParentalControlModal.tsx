
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';

interface Photo {
  id: string;
  uri: string;
  name: string;
  date: string;
  size: number;
  album?: string;
}

interface ApprovalRequest {
  id: string;
  childId: string;
  childName: string;
  photo: Photo;
  albumId: string;
  albumName: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
}

interface ParentalControlSettings {
  requireApproval: boolean;
  restrictDownload: boolean;
  contentFilter: boolean;
  allowedHours: {
    start: string;
    end: string;
  };
  maxDailyUploads: number;
}

interface ParentalControlModalProps {
  visible: boolean;
  onClose: () => void;
  requests: ApprovalRequest[];
  settings: ParentalControlSettings;
  onUpdateSettings: (settings: ParentalControlSettings) => void;
  onApproveRequest: (requestId: string) => void;
  onRejectRequest: (requestId: string, reason?: string) => void;
}

export default function ParentalControlModal({
  visible,
  onClose,
  requests,
  settings,
  onUpdateSettings,
  onApproveRequest,
  onRejectRequest,
}: ParentalControlModalProps) {
  const [activeTab, setActiveTab] = useState<'requests' | 'settings'>('requests');
  const [localSettings, setLocalSettings] = useState<ParentalControlSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  const handleApprove = (requestId: string) => {
    Alert.alert(
      '批准上传',
      '确定要批准这张照片的上传吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '批准',
          onPress: () => {
            onApproveRequest(requestId);
            Alert.alert('成功', '已批准照片上传');
          },
        },
      ]
    );
  };

  const handleReject = (requestId: string) => {
    Alert.alert(
      '拒绝上传',
      '请选择拒绝原因：',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '内容不适宜',
          onPress: () => {
            onRejectRequest(requestId, '内容不适宜');
            Alert.alert('已拒绝', '已拒绝照片上传');
          },
        },
        {
          text: '隐私考虑',
          onPress: () => {
            onRejectRequest(requestId, '隐私考虑');
            Alert.alert('已拒绝', '已拒绝照片上传');
          },
        },
        {
          text: '其他原因',
          onPress: () => {
            onRejectRequest(requestId, '其他原因');
            Alert.alert('已拒绝', '已拒绝照片上传');
          },
        },
      ]
    );
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    Alert.alert('成功', '家长控制设置已更新');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'pending': return colors.warning;
      case 'approved': return colors.success;
      case 'rejected': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'pending': return '待审批';
      case 'approved': return '已批准';
      case 'rejected': return '已拒绝';
      default: return '未知';
    }
  };

  const renderRequests = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* 待处理请求 */}
      {pendingRequests.length > 0 && (
        <>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            待审批请求 ({pendingRequests.length})
          </Text>
          
          {pendingRequests.map((request) => (
            <View key={request.id} style={[styles.requestItem, styles.pendingRequest]}>
              <View style={styles.requestHeader}>
                <Image source={{ uri: request.photo.uri }} style={styles.requestPhoto} />
                
                <View style={styles.requestInfo}>
                  <Text style={styles.childName}>{request.childName}</Text>
                  <Text style={styles.requestDetails}>
                    想要上传到 "{request.albumName}"
                  </Text>
                  <Text style={styles.requestTime}>
                    {formatTime(request.requestedAt)}
                  </Text>
                </View>

                <View style={styles.statusBadge}>
                  <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                    {getStatusText(request.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.requestActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.error + '20' }]}
                  onPress={() => handleReject(request.id)}
                >
                  <IconSymbol name="xmark" size={16} color={colors.error} />
                  <Text style={[styles.actionButtonText, { color: colors.error }]}>拒绝</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: colors.success + '20' }]}
                  onPress={() => handleApprove(request.id)}
                >
                  <IconSymbol name="checkmark" size={16} color={colors.success} />
                  <Text style={[styles.actionButtonText, { color: colors.success }]}>批准</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}

      {/* 已处理请求 */}
      {processedRequests.length > 0 && (
        <>
          <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 16 }]}>
            历史记录
          </Text>
          
          {processedRequests.slice(0, 10).map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestHeader}>
                <Image source={{ uri: request.photo.uri }} style={styles.requestPhoto} />
                
                <View style={styles.requestInfo}>
                  <Text style={styles.childName}>{request.childName}</Text>
                  <Text style={styles.requestDetails}>
                    上传到 "{request.albumName}"
                  </Text>
                  <Text style={styles.requestTime}>
                    {formatTime(request.requestedAt)}
                  </Text>
                  {request.message && (
                    <Text style={styles.rejectReason}>原因: {request.message}</Text>
                  )}
                </View>

                <View style={styles.statusBadge}>
                  <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                    {getStatusText(request.status)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </>
      )}

      {requests.length === 0 && (
        <View style={[commonStyles.center, { padding: 40 }]}>
          <IconSymbol name="checkmark.shield" size={64} color={colors.textSecondary} />
          <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
            暂无审批请求
          </Text>
          <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
            儿童账户的上传请求将在这里显示
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderSettings = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* 基础控制 */}
      <View style={styles.settingsSection}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>基础控制</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <IconSymbol name="hand.raised" size={20} color={colors.warning} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>上传前询问</Text>
              <Text style={styles.settingDescription}>
                儿童账户上传照片需要家长审批
              </Text>
            </View>
          </View>
          <Switch
            value={localSettings.requireApproval}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, requireApproval: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <IconSymbol name="arrow.down.circle.fill" size={20} color={colors.error} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>限制下载</Text>
              <Text style={styles.settingDescription}>
                限制儿童账户下载照片到本地
              </Text>
            </View>
          </View>
          <Switch
            value={localSettings.restrictDownload}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, restrictDownload: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <IconSymbol name="eye.slash" size={20} color={colors.accent} />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>内容过滤</Text>
              <Text style={styles.settingDescription}>
                自动过滤不适宜的内容
              </Text>
            </View>
          </View>
          <Switch
            value={localSettings.contentFilter}
            onValueChange={(value) => setLocalSettings(prev => ({ ...prev, contentFilter: value }))}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </View>

      {/* 时间控制 */}
      <View style={styles.settingsSection}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>时间控制</Text>
        
        <View style={styles.timeSettings}>
          <Text style={styles.settingLabel}>允许使用时间</Text>
          <View style={styles.timeRange}>
            <TouchableOpacity style={styles.timeButton}>
              <Text style={styles.timeText}>{localSettings.allowedHours.start}</Text>
            </TouchableOpacity>
            <Text style={styles.timeSeparator}>至</Text>
            <TouchableOpacity style={styles.timeButton}>
              <Text style={styles.timeText}>{localSettings.allowedHours.end}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.limitSettings}>
          <Text style={styles.settingLabel}>每日上传限制</Text>
          <View style={styles.limitControls}>
            <TouchableOpacity
              style={styles.limitButton}
              onPress={() => setLocalSettings(prev => ({ 
                ...prev, 
                maxDailyUploads: Math.max(1, prev.maxDailyUploads - 1) 
              }))}
            >
              <IconSymbol name="minus" size={16} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.limitValue}>{localSettings.maxDailyUploads} 张</Text>
            <TouchableOpacity
              style={styles.limitButton}
              onPress={() => setLocalSettings(prev => ({ 
                ...prev, 
                maxDailyUploads: Math.min(50, prev.maxDailyUploads + 1) 
              }))}
            >
              <IconSymbol name="plus" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 安全提示 */}
      <View style={styles.securityTips}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>安全提示</Text>
        
        <View style={styles.tipItem}>
          <IconSymbol name="shield.checkered" size={16} color={colors.success} />
          <Text style={styles.tipText}>
            定期检查儿童账户的活动记录
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <IconSymbol name="eye" size={16} color={colors.accent} />
          <Text style={styles.tipText}>
            与孩子沟通网络安全和隐私保护
          </Text>
        </View>
        
        <View style={styles.tipItem}>
          <IconSymbol name="clock" size={16} color={colors.warning} />
          <Text style={styles.tipText}>
            合理安排孩子的设备使用时间
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[buttonStyles.primary, { marginTop: 24 }]}
        onPress={handleSaveSettings}
      >
        <Text style={commonStyles.buttonText}>保存设置</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={commonStyles.subtitle}>家长控制</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* 标签栏 */}
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'requests' && styles.tabItemActive]}
              onPress={() => setActiveTab('requests')}
            >
              <IconSymbol 
                name="bell.badge" 
                size={18} 
                color={activeTab === 'requests' ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.tabLabel,
                activeTab === 'requests' && styles.tabLabelActive
              ]}>
                审批请求
              </Text>
              {pendingRequests.length > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{pendingRequests.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tabItem, activeTab === 'settings' && styles.tabItemActive]}
              onPress={() => setActiveTab('settings')}
            >
              <IconSymbol 
                name="gear" 
                size={18} 
                color={activeTab === 'settings' ? colors.primary : colors.textSecondary} 
              />
              <Text style={[
                styles.tabLabel,
                activeTab === 'settings' && styles.tabLabelActive
              ]}>
                控制设置
              </Text>
            </TouchableOpacity>
          </View>

          {/* 内容区域 */}
          {activeTab === 'requests' ? renderRequests() : renderSettings()}
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  tabBadge: {
    position: 'absolute',
    top: 8,
    right: 20,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    color: colors.card,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 20,
    maxHeight: 500,
  },
  requestItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  pendingRequest: {
    borderColor: colors.warning,
    backgroundColor: colors.warning + '10',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  requestPhoto: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  requestInfo: {
    flex: 1,
    marginLeft: 12,
  },
  childName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  requestDetails: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  requestTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  rejectReason: {
    fontSize: 11,
    color: colors.error,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timeSettings: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  timeRange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeButton: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  limitSettings: {
    marginBottom: 16,
  },
  limitControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  limitButton: {
    backgroundColor: colors.primary + '20',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  limitValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 20,
    minWidth: 60,
    textAlign: 'center',
  },
  securityTips: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});

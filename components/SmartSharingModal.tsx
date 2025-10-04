
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

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'member' | 'child';
  avatar?: string;
  joinedAt: string;
  status: 'active' | 'pending' | 'inactive';
}

interface SharingSuggestion {
  id: string;
  photo: Photo;
  suggestedMembers: FamilyMember[];
  reason: 'face_recognition' | 'location' | 'time' | 'event';
  confidence: number;
  reasonText: string;
}

interface SmartSharingModalProps {
  visible: boolean;
  onClose: () => void;
  photos: Photo[];
  members: FamilyMember[];
  onSharePhotos: (photoIds: string[], memberIds: string[], albumId?: string) => void;
}

export default function SmartSharingModal({
  visible,
  onClose,
  photos,
  members,
  onSharePhotos,
}: SmartSharingModalProps) {
  const [suggestions, setSuggestions] = useState<SharingSuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && photos.length > 0) {
      generateSuggestions();
    }
  }, [visible, photos]);

  const generateSuggestions = () => {
    setLoading(true);
    
    // 模拟智能分析过程
    setTimeout(() => {
      const mockSuggestions: SharingSuggestion[] = photos.slice(0, 5).map((photo, index) => {
        const reasons = [
          {
            type: 'face_recognition' as const,
            text: '检测到家庭成员面孔',
            confidence: 0.85 + Math.random() * 0.1,
          },
          {
            type: 'location' as const,
            text: '拍摄于家庭常去地点',
            confidence: 0.75 + Math.random() * 0.15,
          },
          {
            type: 'time' as const,
            text: '拍摄时间与家庭活动匹配',
            confidence: 0.70 + Math.random() * 0.2,
          },
          {
            type: 'event' as const,
            text: '疑似家庭聚会或特殊场合',
            confidence: 0.80 + Math.random() * 0.15,
          },
        ];

        const selectedReason = reasons[index % reasons.length];
        const suggestedMemberCount = Math.floor(Math.random() * members.length) + 1;
        const suggestedMembers = members.slice(0, suggestedMemberCount);

        return {
          id: `suggestion_${photo.id}`,
          photo,
          suggestedMembers,
          reason: selectedReason.type,
          confidence: selectedReason.confidence,
          reasonText: selectedReason.text,
        };
      });

      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1500);
  };

  const toggleSuggestion = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleShareSelected = () => {
    if (selectedSuggestions.length === 0) {
      Alert.alert('提示', '请选择要分享的照片');
      return;
    }

    const selectedSuggestionObjects = suggestions.filter(s => 
      selectedSuggestions.includes(s.id)
    );

    // 收集所有建议的成员ID
    const allMemberIds = new Set<string>();
    selectedSuggestionObjects.forEach(suggestion => {
      suggestion.suggestedMembers.forEach(member => {
        allMemberIds.add(member.id);
      });
    });

    const photoIds = selectedSuggestionObjects.map(s => s.photo.id);
    const memberIds = Array.from(allMemberIds);

    Alert.alert(
      '确认分享',
      `将 ${photoIds.length} 张照片分享给 ${memberIds.length} 位家庭成员？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '分享',
          onPress: () => {
            onSharePhotos(photoIds, memberIds);
            setSelectedSuggestions([]);
            onClose();
            Alert.alert('成功', '照片分享成功！');
          },
        },
      ]
    );
  };

  const getReasonIcon = (reason: SharingSuggestion['reason']) => {
    switch (reason) {
      case 'face_recognition': return 'face.smiling';
      case 'location': return 'location';
      case 'time': return 'clock';
      case 'event': return 'calendar';
      default: return 'sparkles';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return colors.success;
    if (confidence >= 0.6) return colors.warning;
    return colors.textSecondary;
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return '高置信度';
    if (confidence >= 0.6) return '中等置信度';
    return '低置信度';
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={commonStyles.subtitle}>智能分享建议</Text>
              <Text style={commonStyles.textSecondary}>
                基于AI分析为您推荐分享对象
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={[commonStyles.center, { padding: 40 }]}>
              <IconSymbol name="brain.head.profile" size={48} color={colors.primary} />
              <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                AI正在分析照片内容...
              </Text>
              <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
                识别人脸、地点和时间信息
              </Text>
            </View>
          ) : (
            <>
              <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {suggestions.length === 0 ? (
                  <View style={[commonStyles.center, { padding: 40 }]}>
                    <IconSymbol name="exclamationmark.circle" size={48} color={colors.textSecondary} />
                    <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
                      暂无分享建议
                    </Text>
                    <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
                      请确保照片包含家庭成员或相关信息
                    </Text>
                  </View>
                ) : (
                  suggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion.id}
                      style={[
                        styles.suggestionItem,
                        selectedSuggestions.includes(suggestion.id) && styles.suggestionItemSelected
                      ]}
                      onPress={() => toggleSuggestion(suggestion.id)}
                    >
                      <View style={styles.suggestionHeader}>
                        <Image source={{ uri: suggestion.photo.uri }} style={styles.photoThumbnail} />
                        
                        <View style={styles.suggestionInfo}>
                          <Text style={styles.photoName}>{suggestion.photo.name}</Text>
                          
                          <View style={styles.reasonContainer}>
                            <IconSymbol 
                              name={getReasonIcon(suggestion.reason) as any} 
                              size={14} 
                              color={colors.primary} 
                            />
                            <Text style={styles.reasonText}>{suggestion.reasonText}</Text>
                          </View>
                          
                          <View style={styles.confidenceContainer}>
                            <View style={[
                              styles.confidenceBadge,
                              { backgroundColor: getConfidenceColor(suggestion.confidence) + '20' }
                            ]}>
                              <Text style={[
                                styles.confidenceText,
                                { color: getConfidenceColor(suggestion.confidence) }
                              ]}>
                                {getConfidenceText(suggestion.confidence)}
                              </Text>
                            </View>
                            <Text style={styles.confidenceScore}>
                              {Math.round(suggestion.confidence * 100)}%
                            </Text>
                          </View>
                        </View>

                        <View style={styles.selectionIndicator}>
                          {selectedSuggestions.includes(suggestion.id) ? (
                            <IconSymbol name="checkmark.circle.fill" size={24} color={colors.success} />
                          ) : (
                            <IconSymbol name="circle" size={24} color={colors.border} />
                          )}
                        </View>
                      </View>

                      <View style={styles.suggestedMembers}>
                        <Text style={styles.membersLabel}>建议分享给:</Text>
                        <View style={styles.membersList}>
                          {suggestion.suggestedMembers.map((member) => (
                            <View key={member.id} style={styles.memberTag}>
                              <IconSymbol name="person.circle.fill" size={16} color={colors.primary} />
                              <Text style={styles.memberName}>{member.name}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>

              {suggestions.length > 0 && (
                <View style={styles.modalFooter}>
                  <View style={styles.selectionSummary}>
                    <Text style={commonStyles.textSecondary}>
                      已选择 {selectedSuggestions.length} 张照片
                    </Text>
                  </View>
                  
                  <View style={styles.footerButtons}>
                    <TouchableOpacity
                      style={[buttonStyles.outline, { flex: 1, marginRight: 8 }]}
                      onPress={() => {
                        setSelectedSuggestions([]);
                        onClose();
                      }}
                    >
                      <Text style={commonStyles.buttonTextOutline}>取消</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[
                        buttonStyles.primary, 
                        { flex: 1, marginLeft: 8 },
                        selectedSuggestions.length === 0 && { opacity: 0.5 }
                      ]}
                      onPress={handleShareSelected}
                      disabled={selectedSuggestions.length === 0}
                    >
                      <Text style={commonStyles.buttonText}>分享选中</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
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
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    maxHeight: 500,
    padding: 20,
  },
  suggestionItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: colors.background,
  },
  suggestionItemSelected: {
    borderColor: colors.success,
    backgroundColor: colors.success + '10',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  photoThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  suggestionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  photoName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 8,
  },
  confidenceText: {
    fontSize: 10,
    fontWeight: '600',
  },
  confidenceScore: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectionIndicator: {
    marginLeft: 12,
  },
  suggestedMembers: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  membersLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  membersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  memberTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberName: {
    fontSize: 11,
    color: colors.text,
    marginLeft: 4,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 20,
  },
  selectionSummary: {
    alignItems: 'center',
    marginBottom: 16,
  },
  footerButtons: {
    flexDirection: 'row',
  },
});

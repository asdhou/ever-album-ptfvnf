
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

export default function FloatingTabBar({
  tabs,
  containerWidth = Dimensions.get('window').width - 32,
  borderRadius = 25,
  bottomMargin = 34,
}: FloatingTabBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  
  const activeIndex = useSharedValue(0);
  
  // Update active index based on current route
  React.useEffect(() => {
    const currentIndex = tabs.findIndex(tab => pathname.startsWith(tab.route));
    if (currentIndex !== -1) {
      activeIndex.value = withSpring(currentIndex);
    }
  }, [pathname, tabs]);

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      activeIndex.value,
      tabs.map((_, index) => index),
      tabs.map((_, index) => (containerWidth / tabs.length) * index)
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={[styles.container, { bottom: bottomMargin }]}>
        <BlurView
          style={[
            styles.tabBar,
            {
              width: containerWidth,
              borderRadius,
            },
          ]}
          intensity={80}
          tint="light"
        >
          {/* Active tab indicator */}
          <Animated.View
            style={[
              styles.activeIndicator,
              {
                width: containerWidth / tabs.length,
                borderRadius: borderRadius - 4,
              },
              animatedStyle,
            ]}
          />

          {/* Tab buttons */}
          {tabs.map((tab, index) => {
            const isActive = pathname.startsWith(tab.route);
            
            return (
              <TouchableOpacity
                key={tab.name}
                style={[styles.tab, { width: containerWidth / tabs.length }]}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  name={tab.icon as any}
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? colors.primary : colors.textSecondary,
                      fontWeight: isActive ? '600' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: 'box-none',
  },
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card,
    borderWidth: Platform.OS === 'ios' ? 0 : 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    elevation: 8,
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    height: 52,
    backgroundColor: colors.card,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

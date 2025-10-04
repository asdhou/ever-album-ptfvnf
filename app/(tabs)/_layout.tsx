
import React from 'react';
import { Tabs } from 'expo-router';
import FloatingTabBar from '@/components/FloatingTabBar';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  const tabs = [
    {
      name: '(home)',
      title: '照片',
      icon: 'photo',
      route: '/(home)',
    },
    {
      name: 'family',
      title: '家庭共享',
      icon: 'person.2',
      route: '/family',
    },
    {
      name: 'profile',
      title: '我的',
      icon: 'person',
      route: '/profile',
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' }, // Hide default tab bar
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: '照片',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="family"
          options={{
            title: '家庭共享',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '我的',
            headerShown: false,
          }}
        />
      </Tabs>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}

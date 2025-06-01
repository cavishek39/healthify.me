import { Tabs } from 'expo-router'
import React, { useEffect } from 'react'
import { Avatar } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import {
  HKQuantityTypeIdentifier,
  useHealthkitAuthorization,
} from '@kingstinct/react-native-healthkit'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()
  const [authorizationStatus, requestAuthorization] = useHealthkitAuthorization(
    [
      HKQuantityTypeIdentifier.distanceWalkingRunning,
      HKQuantityTypeIdentifier.stepCount,
      HKQuantityTypeIdentifier.activeEnergyBurned,
    ]
  )

  useEffect(() => {
    console.log('Authorization Status:', authorizationStatus)

    if (authorizationStatus) {
      requestAuthorization()
    }
  }, [authorizationStatus, requestAuthorization])

  // Set tab bar and header colors based on theme
  const isDark = colorScheme === 'dark'
  const tabBarBg = isDark
    ? '#181828'
    : Colors[colorScheme ?? 'light'].background
  const tabBarBorder = isDark ? '#23233a' : '#eee'
  const headerBg = isDark
    ? '#181828'
    : Colors[colorScheme ?? 'light'].background

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          borderTopWidth: 0.5,
          borderTopColor: tabBarBorder,
          backgroundColor: tabBarBg,
          elevation: 10,
          paddingBottom: insets.bottom,
        },
        headerStyle: {
          backgroundColor: headerBg,
          minHeight: 110,
        },
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          headerTitle: '',
          headerRight: () => (
            <Avatar.Image
              size={36}
              source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
              style={{ margin: 16, backgroundColor: 'transparent' }}
            />
          ),

          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='house.fill' color={color} />
          ),
          animation: 'fade',
        }}
      />
      <Tabs.Screen
        name='chat'
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name='bubble.left.and.bubble.right.fill'
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='analytics'
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name='chart.bar.fill' color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

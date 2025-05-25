import { Tabs } from 'expo-router'
import React from 'react'
import { Avatar } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        // tabBarBackground: BlurTabBarBackground,
        // tabBarStyle: {
        //   position: 'absolute',
        //   left: 0,
        //   right: 0,
        //   bottom: 0, // Always stick to the bottom of the screen
        //   borderTopWidth: 0.5,
        //   borderTopColor: '#eee',
        //   backgroundColor: Colors[colorScheme ?? 'light'].background,
        //   elevation: 10,
        //   paddingBottom: insets.bottom, // Add safe area padding if needed
        // },
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
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

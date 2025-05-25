import 'react-native-reanimated'
import 'react-native-url-polyfill/auto'

import { AuthProvider, useAuth } from '@/context/AuthProvider'
import { Redirect, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

export const unstable_settings = {
  // Ensure that the root layout is always mounted
  initialRouteName: '(tabs)',
  // Prevents the root layout from being unmounted when navigating between tabs
  initialRouteKey: '(tabs)',
}

export default function RootLayout() {
  const { user, isReady } = useAuth()

  // Wait until the auth state is ready before rendering
  if (!isReady) {
    // This can be a loading spinner or placeholder
    return null
  }

  // console.log('RootLayout user:', user)

  // If the user is not authenticated, redirect to the login screen
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href='/login' />
  }

  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' />
      </Stack>
      <StatusBar style='auto' />
    </AuthProvider>
  )
}

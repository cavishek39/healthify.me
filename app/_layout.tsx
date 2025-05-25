import { AuthProvider } from '@/context/AuthProvider'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { DefaultTheme, PaperProvider } from 'react-native-paper'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  if (!loaded) {
    // Async font loading only occurs in development.
    return null
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4CAF50', // A calming green color commonly used in health/medical apps
      secondary: '#2196F3', // A trustworthy blue that complements the primary green
    },
  }

  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name='(protected)' />
          <Stack.Screen name='+not-found' />
        </Stack>
        <StatusBar
          networkActivityIndicatorVisible
          animated={true}
          translucent={true}
        />
      </PaperProvider>
    </AuthProvider>
  )
}

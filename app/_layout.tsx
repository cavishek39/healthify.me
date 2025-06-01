import { AuthProvider } from '@/context/AuthProvider'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  MD3DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  PaperProvider,
} from 'react-native-paper'

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  if (!loaded) {
    return null
  }

  const lightTheme = {
    ...PaperDefaultTheme,
    colors: {
      ...PaperDefaultTheme.colors,
      primary: '#4CAF50',
      secondary: '#2196F3',
      background: '#f7f7ff',
      surface: '#fff',
      text: '#222',
    },
  }

  const darkTheme = {
    ...PaperDarkTheme,
    colors: {
      ...PaperDarkTheme.colors,
      primary: '#6c63ff',
      secondary: '#2196F3',
      background: '#181828',
      surface: '#23233a',
      text: '#fff',
    },
  }

  const theme = colorScheme === 'dark' ? darkTheme : lightTheme

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

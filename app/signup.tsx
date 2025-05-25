import { supabase } from '@/utils/supabase'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Alert, ImageBackground, StyleSheet, View } from 'react-native'
import { Button, Text, TextInput, Title, useTheme } from 'react-native-paper'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const bgImage = {
  uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
}

function WelcomeAnimation() {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(40)

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    })
    translateY.value = withTiming(0, {
      duration: 900,
      easing: Easing.out(Easing.exp),
    })
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View
      style={[{ alignItems: 'center', marginBottom: 32 }, animatedStyle]}>
      <Text
        variant='displayMedium'
        style={{ fontWeight: 'bold', color: '#fff', letterSpacing: 1 }}>
        Welcome!
      </Text>
    </Animated.View>
  )
}

export default function Signup() {
  const { control, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' },
  })
  const router = useRouter()
  const theme = useTheme()

  const onSubmit = async (data: any) => {
    try {
      console.log('Signup data:', data)
      // 1. Sign up user with Supabase Auth
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        Alert.alert('Signup Error', error.message)
        throw new Error(error.message)
      }

      // 2. Insert user row in users table with the correct id from auth
      const userId = signUpData?.user?.id
      if (userId) {
        const { error: errorFromDB } = await supabase.from('users').insert([
          {
            id: userId, // must provide id!
            email: data.email,
            created_at: new Date().toISOString(),
          },
        ])
        if (errorFromDB) {
          console.error('DB insert error:', errorFromDB)
          Alert.alert('Signup Error', errorFromDB.message)
          throw new Error(errorFromDB.message)
        }
      }

      Alert.alert('Success', 'Check your email to confirm your account!')
      router.replace('/(protected)/(tabs)')
    } catch (error) {
      console.error('Error during signup:', error)
      Alert.alert(
        'Signup Error',
        'An unexpected error occurred. Please try again.'
      )
    }
  }

  return (
    <ImageBackground
      source={bgImage}
      style={styles.bg}
      resizeMode='cover'
      imageStyle={{ opacity: 0.85 }}>
      <View style={styles.container}>
        <WelcomeAnimation />
        <Title style={styles.title}>Sign Up</Title>

        <Controller
          control={control}
          name='email'
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label='Email'
              value={value}
              onChangeText={onChange}
              keyboardType='email-address'
              autoCapitalize='none'
              style={styles.input}
              mode='outlined'
              left={<TextInput.Icon icon='email' />}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          )}
        />

        <Controller
          control={control}
          name='password'
          rules={{ required: true, minLength: 6 }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              label='Password'
              value={value}
              onChangeText={onChange}
              secureTextEntry
              style={styles.input}
              mode='outlined'
              left={<TextInput.Icon icon='lock' />}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
          )}
        />

        <Button
          mode='contained'
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
          labelStyle={{ fontWeight: 'bold', letterSpacing: 1 }}>
          Create Account
        </Button>

        <Text onPress={() => router.push('/login')} style={styles.link}>
          {'Already have an account? '}
          <Text
            variant='bodyLarge'
            style={{
              fontWeight: '600',
              paddingLeft: 4,
              color: theme.colors.primary,
            }}>
            Login
          </Text>
        </Text>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
  },
  link: {
    marginTop: 24,
    textAlign: 'center',
    color: '#fff',
    // textDecorationLine: 'underline',
    fontWeight: '500',
    letterSpacing: 0.5,
    fontSize: 15,
  },
})

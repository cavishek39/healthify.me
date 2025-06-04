import { Colors } from '@/constants/Colors'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'expo-router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  Alert,
  ImageBackground,
  Platform,
  StyleSheet,
  View,
} from 'react-native'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'

const bgImage = {
  uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
}

export default function Login() {
  const { colors } = useTheme()
  const { control, handleSubmit } = useForm({
    defaultValues: { email: '', password: '' },
  })
  const router = useRouter()

  const onSubmit = async (data: any) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) return Alert.alert('Login Error', error.message)
    router.replace('/')
  }

  return (
    <ImageBackground
      source={bgImage}
      style={styles.bg}
      resizeMode='cover'
      imageStyle={{ opacity: 0.9 }}>
      <View style={styles.centered}>
        <View style={styles.glass}>
          <Text variant='headlineMedium' style={styles.title}>
            Welcome to <Text style={styles.brand}>HealthifyMe</Text>
          </Text>

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
                theme={{ colors: { primary: colors.primary } }} // use theme primary
                left={<TextInput.Icon icon='email-outline' />}
              />
            )}
          />

          <Controller
            control={control}
            name='password'
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label='Password'
                value={value}
                onChangeText={onChange}
                secureTextEntry
                style={styles.input}
                mode='outlined'
                theme={{ colors: { primary: colors.primary } }} // use theme primary
                left={<TextInput.Icon icon='lock-outline' />}
              />
            )}
          />

          <Button
            mode='contained'
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            buttonColor={colors.primary} // use theme primary
            textColor='#fff'
            contentStyle={{ paddingVertical: 6, borderRadius: 12 }}>
            Login
          </Button>

          <Text variant='bodySmall' style={styles.link}>
            {"Don't have an account? "}
            <Text
              variant='titleMedium'
              style={{
                fontWeight: '600',
                paddingLeft: 4,
                color: colors.primary,
              }}
              onPress={() => router.push('/signup')}
              accessibilityRole='link'
              accessibilityLabel='Sign up for a new account'>
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glass: {
    width: '100%',
    maxWidth: 380,
    padding: 28,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.55)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        backdropFilter: 'blur(16px)',
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#222',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Bold' : 'Roboto',
  },
  brand: {
    color: '#4CAF50', // A calming green color commonly used in health/medical apps
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  input: {
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 12,
    color: '#000',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#43a047',
    shadowOpacity: 0.2,
    fontSize: 16,
    shadowRadius: 8,
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

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import 'react-native-url-polyfill/auto'

const supabaseUrl =
  Constants.expoConfig?.extra?.supabaseUrl ||
  'https://nrtdxqylcjhjoclzpojv.supabase.co'
const supabaseAnonKey =
  Constants.expoConfig?.extra?.supabaseAnonKey ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydGR4cXlsY2poam9jbHpwb2p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwODQ5NTEsImV4cCI6MjA2MzY2MDk1MX0.1UnxvwoGYms_YAYxuw7998EncR8x35W_UqnIfkyXjJY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: Platform.OS !== "web",
    detectSessionInUrl: false,
  },
})

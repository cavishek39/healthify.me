import { supabase } from '@/utils/supabase'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  user: User | null
  isReady?: boolean
  logOut: () => Promise<void>
  setAuthStorage?: (value: User) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isReady: false,
  logOut: async () => {},
  setAuthStorage: async () => {},
})

const authStorageKey = 'auth-key'

export const setAuthStorage = async (value: User) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(authStorageKey, jsonValue)
  } catch (error) {
    console.error('Error setting auth storage:', error)
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const getSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (!isMounted) return
        setUser(data?.session?.user ?? null)
        if (data?.session?.user) {
          await setAuthStorage(data.session.user)
        } else {
          await AsyncStorage.removeItem(authStorageKey)
        }
      } catch (error) {
        console.error('Error fetching session:', error)
      } finally {
        if (isMounted) setIsReady(true)
      }
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return
        setUser(session?.user ?? null)
        if (session?.user) {
          await setAuthStorage(session.user)
        } else {
          await AsyncStorage.removeItem(authStorageKey)
        }
      }
    )

    return () => {
      isMounted = false
      listener?.subscription.unsubscribe()
    }
  }, [])

  const logOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      await AsyncStorage.removeItem(authStorageKey)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isReady, logOut, setAuthStorage }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

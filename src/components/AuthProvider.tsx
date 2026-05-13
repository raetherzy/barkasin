"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

interface AuthState {
  supabase: SupabaseClient
  user: { id: string } | null
  profile: { id: string; full_name: string; role: string } | null
  loading: boolean
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

let cachedClient: SupabaseClient | null = null
function getSupabaseClient() {
  if (!cachedClient) {
    cachedClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return cachedClient
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseClient()
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [profile, setProfile] = useState<AuthState["profile"]>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("id", userId)
        .single()
      if (data) setProfile(data)
    } catch {
      // profile may not exist yet
    }
  }

  const refresh = async () => {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      setUser({ id: data.user.id })
      await fetchProfile(data.user.id)
    } else {
      setUser(null)
      setProfile(null)
    }
  }

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data.user) {
          setUser({ id: data.user.id })
          await fetchProfile(data.user.id)
        }
      } catch {
        // session not ready
      } finally {
        setLoading(false)
      }
    }
    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id })
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ supabase, user, profile, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

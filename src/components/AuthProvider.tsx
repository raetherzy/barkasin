"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"

type Profile = { id: string; full_name: string; role: string }

interface AuthState {
  user: { id: string } | null
  profile: Profile | null
  loading: boolean
  refresh: () => Promise<{ id: string } | null>
}


const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string } | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    const res = await fetch("/api/auth/session", { method: "GET" })
    if (!res.ok) {
      throw new Error("Failed to fetch session")
    }

    const json = (await res.json()) as {
      user: { id: string } | null
      profile: Profile | null
    }

    setUser(json.user)
    setProfile(json.profile)

    return json.user
  }

  useEffect(() => {
    let mounted = true

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    const init = async () => {
      // Retry hanya untuk race condition cookie setelah login (network error).
      // Jika /api/auth/session berhasil return, jawabannya sudah pasti.
      for (let i = 0; i < 5; i++) {
        const attemptDelay = [0, 150, 350, 650, 1050][i] ?? 0
        if (attemptDelay) await sleep(attemptDelay)

        try {
          await refresh()
          break
        } catch {
          // Gagal fetch, mungkin cookie belum siap — retry
          if (i === 4 && mounted) setLoading(false)
        }
      }

      if (mounted) setLoading(false)
    }

    init()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, loading, refresh }}>
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


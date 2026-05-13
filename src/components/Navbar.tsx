"use client"

import { useAuth } from "@/components/AuthProvider"
import { signOut } from "@/app/auth/actions"
import Link from "next/link"
import { useState } from "react"

const roleLabel: Record<string, string> = {
  seller: "Seller",
  buyer: "Buyer",
  admin: "Admin",
}

export default function Navbar() {
  const { profile, loading } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const canPost = profile?.role === "seller" || profile?.role === "admin"

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 hover:text-blue-700"
        >
          Barkasin
        </Link>

        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Beranda
          </Link>

          {!loading && canPost && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Pasang Iklan
            </Link>
          )}

          {!loading && profile ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-500">
                {profile.full_name} ({roleLabel[profile.role] || profile.role})
              </span>
              <form action={signOut}>
                <button className="text-sm text-red-500 hover:text-red-600 transition-colors">
                  Keluar
                </button>
              </form>
            </div>
          ) : !loading ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Daftar
              </Link>
            </div>
          ) : null}
        </div>

        <button
          className="sm:hidden p-2 text-zinc-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3">
          <Link href="/" className="block text-sm text-zinc-600" onClick={() => setMenuOpen(false)}>
            Beranda
          </Link>
          {!loading && canPost && (
            <Link href="/dashboard" className="block text-sm text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
              Pasang Iklan
            </Link>
          )}
          {!loading && profile ? (
            <>
              <div className="text-sm text-zinc-500">
                {profile.full_name} ({roleLabel[profile.role] || profile.role})
              </div>
              <form action={signOut}>
                <button className="text-sm text-red-500">Keluar</button>
              </form>
            </>
          ) : !loading ? (
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-sm text-zinc-600" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link href="/register" className="text-sm text-blue-600 font-medium" onClick={() => setMenuOpen(false)}>
                Daftar
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  )
}

"use client"

import { signUp } from "@/app/auth/actions"
import { useAuth } from "@/components/AuthProvider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RegisterPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/")
    }
  }, [authLoading, user, router])

  async function handleSubmit(formData: FormData) {
    if (!agreed) {
      setError("Anda harus menyetujui Syarat & Ketentuan.")
      return
    }

    setLoading(true)
    setError("")

    const result = await signUp(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-sm text-zinc-400">Memuat...</p>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-zinc-500 mb-2">Anda sudah login.</p>
          <p className="text-sm text-zinc-400">Mengalihkan ke beranda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Daftar di Barkasin</h1>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Nama Lengkap
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Nomor Telepon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Alamat Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="contoh@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 mb-1"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Minimal 8 karakter"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M6.343 6.343L4 4m16 16l-2.343-2.343M4 4l16 16" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-zinc-700 mb-2">
              Saya ingin:
            </legend>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-3 flex-1 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  required
                  className="accent-blue-600"
                />
                <span className="text-sm font-medium">Menjual</span>
              </label>
              <label className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-3 flex-1 cursor-pointer has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  required
                  className="accent-blue-600"
                />
                <span className="text-sm font-medium">Membeli</span>
              </label>
            </div>
          </fieldset>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-blue-600 rounded"
              />
              <span className="text-sm text-zinc-600 leading-relaxed">
                Saya telah membaca dan menyetujui{" "}
                <Link
                  href="/snk"
                  target="_blank"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  Syarat & Ketentuan Barkasin
                </Link>
                . Saya memahami bahwa Barkasin tidak bertanggung jawab atas
                segala bentuk penipuan atau kerugian yang timbul dari transaksi
                antara penjual dan pembeli.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !agreed}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  )
}

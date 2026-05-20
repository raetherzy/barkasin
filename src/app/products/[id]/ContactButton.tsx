"use client"

import { useAuth } from "@/components/AuthProvider"
import Link from "next/link"
import { useState } from "react"

export default function ContactButton({
  productId,
  sellerId,
}: {
  productId: number
  sellerId: string
}) {
  const { user, profile, loading } = useAuth()
  const [fetching, setFetching] = useState(false)
  const [contact, setContact] = useState<{
    contact_phone: string | null
    contact_email: string | null
  } | null>(null)
  const [error, setError] = useState("")

  async function handleReveal() {
    setFetching(true)
    setError("")

    try {
      const res = await fetch(`/api/products/${productId}/contact`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Gagal memuat kontak.")
        setFetching(false)
        return
      }

      setContact(data)
    } catch {
      setError("Gagal menghubungi server.")
    }

    setFetching(false)
  }

  if (loading) {
    return <div className="h-10 w-32 bg-zinc-100 rounded-lg animate-pulse" />
  }

  if (!user) {
    return (
      <Link
        href={`/login?redirect=/products/${productId}`}
        className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors text-center"
      >
        Login untuk melihat kontak
      </Link>
    )
  }

  // Seller seeing own product
  if (user.id === sellerId || profile?.role === "admin") {
    return (
      <Link
        href="/dashboard"
        className="inline-block rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors text-center"
      >
        Kelola di Dashboard
      </Link>
    )
  }

  // Buyer
  if (contact) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-2">
        <p className="text-sm font-medium text-green-800">Kontak Penjual</p>
        {contact.contact_phone && (
          <p className="text-sm text-green-700">
            <span className="font-medium">Telp:</span>{" "}
            <a href={`tel:${contact.contact_phone}`} className="hover:underline">
              {contact.contact_phone}
            </a>
          </p>
        )}
        {contact.contact_email && (
          <p className="text-sm text-green-700">
            <span className="font-medium">Email:</span>{" "}
            <a href={`mailto:${contact.contact_email}`} className="hover:underline">
              {contact.contact_email}
            </a>
          </p>
        )}
        {!contact.contact_phone && !contact.contact_email && (
          <p className="text-sm text-green-700">Penjual belum mencantumkan kontak.</p>
        )}
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={handleReveal}
        disabled={fetching}
        className="rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        {fetching ? "Memuat..." : "Lihat Kontak Penjual"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

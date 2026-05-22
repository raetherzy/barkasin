"use client"

import { deleteProduct } from "@/app/dashboard/actions"
import { useState } from "react"

type Image = {
  id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

export type Product = {
  id: number
  title: string
  price: number
  condition: string
  location: string | null
  contact_phone: string
  contact_email: string | null
  category_id: number
  description: string
  created_at: string
  images: Image[]
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProductList({
  products,
  onEdit,
  onDeleted,
}: {
  products: Product[]
  onEdit: (product: Product) => void
  onDeleted: () => void
}) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [error, setError] = useState("")

  async function handleDelete(productId: number) {
    setDeletingId(productId)
    setError("")

    const formData = new FormData()
    formData.set("product_id", String(productId))

    const result = await deleteProduct(formData)

    if (result?.error) {
      setError(result.error)
      setDeletingId(null)
      setConfirmId(null)
      return
    }

    setDeletingId(null)
    setConfirmId(null)
    onDeleted()
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-zinc-500 mt-6">
        Belum ada produk. Klik &quot;Pasang Iklan Baru&quot; untuk memulai.
      </p>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-lg font-semibold">Produk Anda ({products.length})</h2>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-wrap sm:flex-nowrap items-start gap-3 sm:gap-4 rounded-xl border border-zinc-200 bg-white p-3 sm:p-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg bg-zinc-100 overflow-hidden">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.images[0].image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-zinc-900 truncate">
                {product.title}
              </h3>
              <p className="text-sm font-bold text-zinc-900 mt-0.5">
                {formatPrice(product.price)}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    product.condition === "Baru"
                      ? "bg-green-50 text-green-700"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {product.condition}
                </span>
                {product.location && <span className="truncate">{product.location}</span>}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto sm:shrink-0">
              <button
                onClick={() => onEdit(product)}
                disabled={deletingId !== null}
                className="flex-1 sm:flex-initial rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                Edit
              </button>

              {confirmId === product.id ? (
                <div className="flex items-center gap-1 flex-1 sm:flex-initial">
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deletingId === product.id ? "..." : "Ya"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    disabled={deletingId === product.id}
                    className="flex-1 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-100 transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(product.id)}
                  disabled={deletingId !== null}
                  className="flex-1 sm:flex-initial rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

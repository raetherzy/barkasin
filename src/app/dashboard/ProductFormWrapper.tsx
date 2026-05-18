"use client"

import { useState } from "react"
import ProductForm from "./ProductForm"

type Category = { id: string; name: string }

export default function ProductFormWrapper({
  categories,
  defaultPhone,
}: {
  categories: Category[]
  defaultPhone: string
}) {
  const [showForm, setShowForm] = useState(false)

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Pasang Iklan Baru
      </button>
    )
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(false)}
        className="mb-4 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        &larr; Kembali
      </button>
      <ProductForm categories={categories} defaultPhone={defaultPhone} />
    </div>
  )
}

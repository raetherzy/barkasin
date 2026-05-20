"use client"

import { useState } from "react"
import ProductForm from "./ProductForm"
import ProductList from "./ProductList"
import type { Product } from "./ProductList"

type Category = { id: string; name: string }

export default function ProductFormWrapper({
  categories,
  defaultPhone,
  products,
}: {
  categories: Category[]
  defaultPhone: string
  products: Product[]
}) {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setShowForm(true)
  }

  function handleCancelEdit() {
    setEditingProduct(null)
    setShowForm(false)
  }

  function handleSaved() {
    setEditingProduct(null)
    setShowForm(false)
    setRefreshKey((k) => k + 1)
  }

  function handleDeleted() {
    setRefreshKey((k) => k + 1)
  }

  if (!showForm) {
    return (
      <div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Pasang Iklan Baru
        </button>

        <ProductList
          key={refreshKey}
          products={products}
          onEdit={handleEdit}
          onDeleted={handleDeleted}
        />
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={handleCancelEdit}
        className="mb-4 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        &larr; Kembali
      </button>
      <ProductForm
        categories={categories}
        defaultPhone={defaultPhone}
        editProduct={editingProduct}
        onCancelEdit={handleCancelEdit}
        onSaved={handleSaved}
      />
    </div>
  )
}

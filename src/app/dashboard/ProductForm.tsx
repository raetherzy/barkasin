"use client"

import { createProduct, updateProduct } from "@/app/dashboard/actions"
import { useState, useRef } from "react"
import type { Product } from "./ProductList"

type Category = { id: string; name: string }

type Props = {
  categories: Category[]
  defaultPhone: string
  role: string
  editProduct?: Product | null
  onCancelEdit?: () => void
  onSaved?: () => void
}

export default function ProductForm({
  categories,
  defaultPhone,
  role,
  editProduct,
  onCancelEdit,
  onSaved,
}: Props) {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [priceDisplay, setPriceDisplay] = useState(
    editProduct ? editProduct.price.toLocaleString("id-ID") : ""
  )
  const [existingImages, setExistingImages] = useState(
    editProduct?.images ?? []
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditing = !!editProduct

  function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "")
    if (!raw) {
      setPriceDisplay("")
      return
    }
    setPriceDisplay(Number(raw).toLocaleString("id-ID"))
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return

    const urls: string[] = []
    const total = existingImages.length + files.length
    if (total > 5) {
      setError("Maksimal 5 foto. Hapus foto lama terlebih dahulu.")
      return
    }

    for (const file of files) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Setiap foto maksimal 2MB.")
        return
      }
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        setError("Hanya file JPG dan PNG yang diizinkan.")
        return
      }
      urls.push(URL.createObjectURL(file))
    }

    setError("")
    setPreviews(urls)
  }

  function removePreview(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function removeExistingImage(imageId: number) {
    const newImages = existingImages.filter((img) => img.id !== imageId)
    if (newImages.length + previews.length === 0) {
      setError("Minimal 1 foto wajib diunggah.")
      return
    }
    setError("")
    setExistingImages(newImages)
  }

  async function handleSubmit(formData: FormData) {
    setError("")
    setSuccess("")
    setLoading(true)

    const rawPrice = priceDisplay.replace(/\D/g, "")
    formData.set("price", rawPrice)

    const files = fileInputRef.current?.files
    if (files) {
      for (const file of files) {
        formData.append("images", file)
      }
    }

    if (isEditing) {
      formData.set("product_id", String(editProduct.id))
      formData.set("keep_images", existingImages.map((i) => i.id).join(","))
    }

    const action = isEditing ? updateProduct : createProduct
    const result = await action(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess(isEditing ? "Produk berhasil diperbarui!" : "Produk berhasil dipasang!")
    setPreviews([])
    setExistingImages([])
    setLoading(false)
    onSaved?.()
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">
        {isEditing ? "Edit Produk" : "Pasang Iklan Baru"}
      </h2>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-zinc-700 mb-1">
            Judul Produk
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={5}
            maxLength={200}
            defaultValue={editProduct?.title}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Contoh: iPhone 12 64GB Hitam"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-zinc-700 mb-1">
              Kategori
            </label>
            <select
              id="category_id"
              name="category_id"
              required
              defaultValue={editProduct?.category_id}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-zinc-700 mb-1">
              Kondisi
            </label>
            <select
              id="condition"
              name="condition"
              required
              defaultValue={editProduct?.condition}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Pilih kondisi</option>
              <option value="Baru">Baru</option>
              <option value="Bekas">Bekas</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-zinc-700 mb-1">
            Harga (Rp)
          </label>
          <input
            id="price"
            name="price"
            type="text"
            inputMode="numeric"
            required
            value={priceDisplay}
            onChange={handlePriceChange}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="1.000.000"
          />
        </div>

        <div>
          <label htmlFor="contact_phone" className="block text-sm font-medium text-zinc-700 mb-1">
            Nomor Telepon
            <span className="text-zinc-400 font-normal ml-1">(wajib)</span>
          </label>
          <input
            id="contact_phone"
            name="contact_phone"
            type="text"
            required
            defaultValue={editProduct?.contact_phone ?? defaultPhone}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Contoh: 081234567890"
          />
        </div>

        {role === "admin" && (
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-zinc-700 mb-1">
              Email Penjual
              <span className="text-zinc-400 font-normal ml-1">(wajib untuk admin)</span>
            </label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              required
              defaultValue={editProduct ? editProduct.contact_email ?? "" : ""}
              className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Contoh: seller@email.com"
            />
          </div>
        )}

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-zinc-700 mb-1">
            Lokasi
            <span className="text-zinc-400 font-normal ml-1">(opsional)</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            maxLength={200}
            defaultValue={editProduct?.location ?? ""}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Contoh: Jakarta Selatan"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            required
            minLength={20}
            rows={4}
            defaultValue={editProduct?.description}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            placeholder="Deskripsikan kondisi, spesifikasi, dan informasi penting lainnya..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Foto Produk
            <span className="text-zinc-400 font-normal ml-1">(1-5 foto, JPG/PNG, max 2MB)</span>
          </label>

          {existingImages.length > 0 && (
            <div className="flex gap-3 mb-3 flex-wrap">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.image_url}
                    alt="Existing"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-zinc-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
          />

          {previews.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {previews.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePreview(i)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Pasang Iklan"}
          </button>

          {isEditing && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={loading}
              className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

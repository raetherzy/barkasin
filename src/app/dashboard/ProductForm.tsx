"use client"

import { createProduct } from "@/app/dashboard/actions"
import { useState, useRef } from "react"

type Category = { id: string; name: string }

type Props = {
  categories: Category[]
  defaultPhone: string
}

export default function ProductForm({ categories, defaultPhone }: Props) {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [priceDisplay, setPriceDisplay] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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

    const result = await createProduct(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess("Produk berhasil dipasang!")
    setPreviews([])
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Pasang Iklan Baru</h2>

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
            defaultValue={defaultPhone}
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Contoh: 081234567890"
          />
        </div>

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
            className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
            placeholder="Deskripsikan kondisi, spesifikasi, dan informasi penting lainnya..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Foto Produk
            <span className="text-zinc-400 font-normal ml-1">(1-5 foto, JPG/PNG, max 2MB)</span>
          </label>
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

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Menyimpan..." : "Pasang Iklan"}
        </button>
      </form>
    </div>
  )
}

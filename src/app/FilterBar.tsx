"use client"

import { useRouter, useSearchParams } from "next/navigation"

type Category = { id: number; name: string }

export default function FilterBar({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const q = searchParams.get("q") || ""
  const category = searchParams.get("category") || ""
  const condition = searchParams.get("condition") || ""
  const location = searchParams.get("location") || ""
  const minPrice = searchParams.get("min_price") || ""
  const maxPrice = searchParams.get("max_price") || ""

  function applyFilter(formData: FormData) {
    const params = new URLSearchParams()
    const sq = (formData.get("q") as string)?.trim()
    const fcat = (formData.get("category") as string)?.trim()
    const fcond = (formData.get("condition") as string)?.trim()
    const floc = (formData.get("location") as string)?.trim()
    const fmin = (formData.get("min_price") as string)?.trim()
    const fmax = (formData.get("max_price") as string)?.trim()

    if (sq) params.set("q", sq)
    if (fcat) params.set("category", fcat)
    if (fcond) params.set("condition", fcond)
    if (floc) params.set("location", floc)
    if (fmin) params.set("min_price", fmin)
    if (fmax) params.set("max_price", fmax)

    router.replace(`/?${params.toString()}`, { scroll: false })
  }

  function clearFilters() {
    router.replace("/", { scroll: false })
  }

  const hasFilters = category || condition || location || minPrice || maxPrice

  return (
    <form action={applyFilter} className="space-y-4 mb-6">
      <div>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cari produk..."
          className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="category" className="block text-xs text-zinc-500 mb-1">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            defaultValue={category}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="condition" className="block text-xs text-zinc-500 mb-1">
            Kondisi
          </label>
          <select
            id="condition"
            name="condition"
            defaultValue={condition}
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua</option>
            <option value="Baru">Baru</option>
            <option value="Bekas">Bekas</option>
          </select>
        </div>

        <div>
          <label htmlFor="min_price" className="block text-xs text-zinc-500 mb-1">
            Harga Min
          </label>
          <input
            id="min_price"
            name="min_price"
            type="text"
            inputMode="numeric"
            defaultValue={minPrice}
            placeholder="0"
            className="w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="max_price" className="block text-xs text-zinc-500 mb-1">
            Harga Max
          </label>
          <input
            id="max_price"
            name="max_price"
            type="text"
            inputMode="numeric"
            defaultValue={maxPrice}
            placeholder="∞"
            className="w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-xs text-zinc-500 mb-1">
            Lokasi
          </label>
          <input
            id="location"
            name="location"
            type="text"
            defaultValue={location}
            placeholder="Semarang"
            className="w-36 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900 transition-colors"
        >
          Cari
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            Hapus filter
          </button>
        )}
      </div>
    </form>
  )
}

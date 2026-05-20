import { createClient } from "@/utils/supabase/server"
import { Suspense } from "react"
import FilterBar from "./FilterBar"
import ProductGrid from "./ProductGrid"

type ProductImage = { id: number; image_url: string; is_primary: boolean; sort_order: number }
type Product = { id: number; title: string; price: number; location: string | null; created_at: string; images: ProductImage[] }
type Category = { id: number; name: string }

const PAGE_SIZE = 12

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string; q?: string; category?: string; condition?: string; location?: string; min_price?: string; max_price?: string; page?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  let query = supabase
    .from("products")
    .select("*, images:product_images(*)", { count: "exact" })
    .order("created_at", { ascending: false })

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%`)
  }

  if (params.category) {
    query = query.eq("category_id", params.category)
  }

  if (params.condition) {
    query = query.eq("condition", params.condition)
  }

  if (params.location) {
    query = query.ilike("location", `%${params.location}%`)
  }

  if (params.min_price) {
    query = query.gte("price", Number(params.min_price))
  }

  if (params.max_price) {
    query = query.lte("price", Number(params.max_price))
  }

  const page = Number(params.page) || 1
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: products, count } = await query.range(from, to)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const showLoadMore = page < totalPages

  const loadMoreParams = new URLSearchParams()
  if (params.q) loadMoreParams.set("q", params.q)
  if (params.category) loadMoreParams.set("category", params.category)
  if (params.condition) loadMoreParams.set("condition", params.condition)
  if (params.location) loadMoreParams.set("location", params.location)
  if (params.min_price) loadMoreParams.set("min_price", params.min_price)
  if (params.max_price) loadMoreParams.set("max_price", params.max_price)
  loadMoreParams.set("page", String(page + 1))

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Barkasin</h1>

      {params.welcome === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          Pendaftaran berhasil! Selamat datang di Barkasin. Jelajahi produk yang
          tersedia atau cari barang bekas yang Anda inginkan.
        </div>
      )}

      <Suspense fallback={<div className="text-sm text-zinc-400">Memuat filter...</div>}>
        <FilterBar categories={(categories ?? []) as Category[]} />
      </Suspense>

      <ProductGrid products={(products ?? []) as Product[]} />

      {showLoadMore && (
        <div className="text-center mt-8">
          <a
            href={`/?${loadMoreParams.toString()}`}
            className="inline-block rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Muat Lebih Banyak
          </a>
        </div>
      )}
    </main>
  )
}

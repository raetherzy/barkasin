import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import ProductFormWrapper from "./ProductFormWrapper"
import type { Product } from "./ProductList"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/dashboard")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, phone")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "seller" && profile?.role !== "admin") {
    redirect("/")
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("name")

  const { data: products } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  const params = await searchParams

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">
        {profile?.role === "admin" ? "Dashboard Admin" : "Dashboard Seller"}
      </h1>

      {params.welcome === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          Pendaftaran berhasil! Selamat datang di Barkasin. Kelola produk Anda
          di halaman ini.
        </div>
      )}

      <ProductFormWrapper
        categories={categories ?? []}
        defaultPhone={profile?.phone ?? ""}
        role={profile?.role ?? "seller"}
        products={(products as Product[]) ?? []}
      />
    </main>
  )
}

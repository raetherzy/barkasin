import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

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
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "seller" && profile?.role !== "admin") {
    redirect("/")
  }

  const params = await searchParams

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard Seller</h1>

      {params.welcome === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          Pendaftaran berhasil! Selamat datang di Barkasin. Kelola produk Anda
          di halaman ini.
        </div>
      )}

      <p className="text-zinc-600">Selamat datang! Kelola produk Anda di sini.</p>
    </main>
  )
}

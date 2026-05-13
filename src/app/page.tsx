export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const params = await searchParams

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Barkasin</h1>

      {params.welcome === "1" && (
        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          Pendaftaran berhasil! Selamat datang di Barkasin. Jelajahi produk yang
          tersedia atau cari barang bekas yang Anda inginkan.
        </div>
      )}

      <p className="text-zinc-600">Platform Jual Beli Barang Bekas</p>
    </main>
  )
}

import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import ImageGallery from "./ImageGallery"
import ContactButton from "./ContactButton"
import Link from "next/link"

type ProductImage = {
  id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { id } = await params

  const { data: product } = await supabase
    .from("products")
    .select("*, images:product_images(*), category:categories(name)")
    .eq("id", id)
    .single()

  if (!product) {
    notFound()
  }

  const images = (product.images as ProductImage[]) ?? []

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-700 transition-colors mb-4 inline-block"
      >
        &larr; Kembali ke Beranda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ImageGallery images={images} />

        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 mb-1">
              {product.title}
            </h1>
            {product.category && (
              <span className="text-xs text-blue-600 bg-blue-50 rounded-full px-2.5 py-0.5 font-medium">
                {(product.category as { name: string }).name}
              </span>
            )}
          </div>

          <p className="text-2xl font-bold text-zinc-900">
            {formatPrice(product.price)}
          </p>

          <div className="flex items-center gap-3 text-sm">
            <span
              className={`rounded-full px-3 py-1 font-medium text-xs ${
                product.condition === "Baru"
                  ? "bg-green-50 text-green-700"
                  : "bg-zinc-100 text-zinc-600"
              }`}
            >
              {product.condition}
            </span>
            {product.location && (
              <span className="text-zinc-500">{product.location}</span>
            )}
          </div>

          <div>
            <h2 className="text-sm font-medium text-zinc-700 mb-2">Deskripsi</h2>
            <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <ContactButton
            productId={product.id}
            sellerId={product.seller_id}
          />

          <p className="text-xs text-zinc-400">
            Diposting{" "}
            {new Date(product.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </main>
  )
}

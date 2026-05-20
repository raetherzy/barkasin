"use client"

import ProductCard from "@/components/ProductCard"

type ProductImage = {
  id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

type Product = {
  id: number
  title: string
  price: number
  location: string | null
  created_at: string
  images: ProductImage[]
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-zinc-400 text-sm">Tidak ada produk ditemukan.</p>
      </div>
    )
  }

  const getPrimaryImage = (images: ProductImage[]) => {
    const primary = images.find((img) => img.is_primary)
    return primary?.image_url ?? images[0]?.image_url ?? null
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          price={product.price}
          location={product.location}
          imageUrl={getPrimaryImage(product.images)}
          createdAt={product.created_at}
        />
      ))}
    </div>
  )
}

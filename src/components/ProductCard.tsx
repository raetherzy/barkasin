"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

type ProductCardProps = {
  id: string
  title: string
  price: number
  location?: string | null
  imageUrl?: string | null
  createdAt: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function relativeTime(dateString: string) {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diffMs = now - then

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)

  if (seconds < 60) return "Baru saja"
  if (minutes < 60) return `${minutes} menit yang lalu`
  if (hours < 24) return `${hours} jam yang lalu`
  if (days < 7) return `${days} hari yang lalu`
  if (weeks < 4) return `${weeks} minggu yang lalu`

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(then)
}

export default function ProductCard({
  id,
  title,
  price,
  location,
  imageUrl,
  createdAt,
}: ProductCardProps) {
  const [timeLabel, setTimeLabel] = useState(() => relativeTime(createdAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLabel(relativeTime(createdAt))
    }, 60_000)

    return () => clearInterval(interval)
  }, [createdAt])

  return (
    <Link
      href={`/products/${id}`}
      className="group block rounded-xl border border-zinc-200 bg-white overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="aspect-[4/3] bg-zinc-100 relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-3 space-y-1.5">
        <h3 className="text-sm font-medium text-zinc-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <p className="text-sm font-bold text-zinc-900">
          {formatPrice(price)}
        </p>

        <div className="flex items-center justify-between gap-2 text-xs text-zinc-400">
          {location ? (
            <span className="truncate">{location}</span>
          ) : (
            <span />
          )}
          <span className="shrink-0">{timeLabel}</span>
        </div>
      </div>
    </Link>
  )
}

"use client"

import { useState } from "react"

type Image = {
  id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

export default function ImageGallery({ images }: { images: Image[] }) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
  const [selected, setSelected] = useState(0)

  if (sorted.length === 0) {
    return (
      <div className="aspect-[4/3] bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-300">
        <svg className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] bg-zinc-100 rounded-xl overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sorted[selected].image_url}
          alt={`Gambar ${selected + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                i === selected ? "border-blue-500" : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.image_url}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

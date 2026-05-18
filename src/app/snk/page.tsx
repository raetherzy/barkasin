import { readFileSync } from "fs"
import { join } from "path"
import type { ReactNode } from "react"

function formatContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

function parseSnk(md: string): ReactNode[] {
  const lines = md.split("\n")
  const nodes: ReactNode[] = []

  let listItems: string[] = []
  let key = 0

  function flushList() {
    if (listItems.length > 0) {
      nodes.push(
        <ul
          key={key++}
          className="list-disc list-inside space-y-1 text-sm leading-relaxed text-zinc-700 ml-2 mb-3"
        >
          {listItems.map((item, i) => (
            <li key={i} className="ml-4 pl-1">
              {formatContent(item)}
            </li>
          ))}
        </ul>
      )
      listItems = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushList()
      nodes.push(<div key={key++} className="h-2" />)
      continue
    }

    if (trimmed === "BARKASIN") {
      nodes.push(
        <h1 key={key++} className="text-2xl font-bold text-center text-blue-600">
          {trimmed}
        </h1>
      )
      continue
    }

    if (trimmed === "Platform Jual Beli Barang Bekas") {
      nodes.push(
        <p key={key++} className="text-center text-zinc-500 mb-8">
          {trimmed}
        </p>
      )
      continue
    }

    if (trimmed.startsWith("SYARAT DAN KETENTUAN")) {
      nodes.push(
        <h2 key={key++} className="text-lg font-bold text-center mt-8 mb-1">
          {trimmed}
        </h2>
      )
      continue
    }

    if (trimmed === "Terms and Conditions of Use") {
      nodes.push(
        <p key={key++} className="text-center text-zinc-500 mb-6 italic">
          {trimmed}
        </p>
      )
      continue
    }

    if (
      trimmed.startsWith("Versi") ||
      trimmed.startsWith("Tanggal") ||
      trimmed.startsWith("Berlaku") ||
      trimmed.startsWith("Status")
    ) {
      nodes.push(
        <p key={key++} className="text-sm text-zinc-500 text-center">
          {trimmed}
        </p>
      )
      continue
    }

    if (/^Pasal \d+/.test(trimmed) || trimmed.startsWith("Pernyataan")) {
      flushList()
      nodes.push(
        <h2 key={key++} className="text-base font-bold mt-10 mb-3 text-zinc-900">
          {trimmed}
        </h2>
      )
      continue
    }

    if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      const text = trimmed.replace(/^[•\-]\s*/, "")
      listItems.push(text)
      continue
    }

    // Regular paragraph
    nodes.push(
      <p key={key++} className="text-sm leading-relaxed text-zinc-700 mb-3">
        {formatContent(trimmed)}
      </p>
    )
  }

  flushList()

  // Footer
  nodes.push(
    <p key={key++} className="text-xs text-zinc-400 mt-10 pt-6 border-t border-zinc-200 text-center">
      Barkasin &copy; 2026 &mdash; Dokumen ini berlaku efektif sejak 12 Mei 2026
    </p>
  )

  return nodes
}

export default function SnkPage() {
  const md = readFileSync(join(process.cwd(), "snk_barkasin.md"), "utf-8")
  const content = parseSnk(md)

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
      {content}
    </main>
  )
}

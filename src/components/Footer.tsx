import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Barkasin. Semua Hak Dilindungi.
        </p>
        <Link
          href="/snk"
          className="text-sm text-blue-600 hover:underline"
        >
          Syarat & Ketentuan
        </Link>
      </div>
    </footer>
  )
}

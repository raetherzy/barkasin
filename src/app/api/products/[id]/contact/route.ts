import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Login diperlukan." }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || (profile.role !== "buyer" && profile.role !== "seller" && profile.role !== "admin")) {
    return NextResponse.json({ error: "Akses ditolak." }, { status: 403 })
  }

  const { id } = await params

  const { data: product } = await supabase
    .from("products")
    .select("contact_phone, contact_email, seller_id")
    .eq("id", id)
    .single()

  if (!product) {
    return NextResponse.json({ error: "Produk tidak ditemukan." }, { status: 404 })
  }

  return NextResponse.json({
    contact_phone: product.contact_phone || null,
    contact_email: product.contact_email || null,
  })
}

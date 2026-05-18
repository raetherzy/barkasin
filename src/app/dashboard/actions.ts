"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

const ALLOWED_TYPES = ["image/jpeg", "image/png"]
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_FILES = 5

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Anda harus login terlebih dahulu." }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "seller" && profile?.role !== "admin") {
    return { error: "Hanya seller yang dapat memasang iklan." }
  }

  const title = (formData.get("title") as string)?.trim()
  const categoryId = (formData.get("category_id") as string)?.trim()
  const priceStr = (formData.get("price") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()
  const condition = (formData.get("condition") as string)?.trim()
  const location = (formData.get("location") as string)?.trim() || null
  const contactPhone = (formData.get("contact_phone") as string)?.trim()
  const imageFiles = formData.getAll("images") as File[]

  // Validation
  if (!title || title.length < 5 || title.length > 200) {
    return { error: "Judul harus antara 5-200 karakter." }
  }

  if (!categoryId) {
    return { error: "Kategori wajib dipilih." }
  }

  const price = Number(priceStr)
  if (!priceStr || isNaN(price) || price <= 0) {
    return { error: "Harga harus berupa angka lebih dari 0." }
  }

  if (!description || description.length < 20) {
    return { error: "Deskripsi minimal 20 karakter." }
  }

  if (condition !== "Baru" && condition !== "Bekas") {
    return { error: "Kondisi tidak valid." }
  }

  if (!contactPhone || contactPhone.length < 8) {
    return { error: "Nomor telepon wajib diisi (minimal 8 digit)." }
  }

  if (imageFiles.length === 0 || imageFiles.length > MAX_FILES) {
    return { error: `Upload 1-${MAX_FILES} foto produk.` }
  }

  for (const file of imageFiles) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: "Hanya file JPG dan PNG yang diizinkan." }
    }
    if (file.size > MAX_FILE_SIZE) {
      return { error: "Setiap foto maksimal 2MB." }
    }
  }

  // Upload images
  const imageUrls: Array<{ url: string; isPrimary: boolean }> = []

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i]
    const ext = file.type === "image/png" ? "png" : "jpg"
    const filePath = `${user.id}/${Date.now()}-${i}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      return { error: `Gagal upload gambar: ${uploadError.message}` }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("product-images").getPublicUrl(filePath)

    imageUrls.push({ url: publicUrl, isPrimary: i === 0 })
  }

  // Insert product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      seller_id: user.id,
      title,
      category_id: categoryId,
      price,
      description,
      condition,
      location,
      contact_phone: contactPhone,
    })
    .select("id")
    .single()

  if (productError) {
    return { error: `Gagal menyimpan produk: ${productError.message}` }
  }

  // Insert product images
  const { error: imageError } = await supabase
    .from("product_images")
    .insert(
      imageUrls.map((img, idx) => ({
        product_id: product.id,
        image_url: img.url,
        is_primary: img.isPrimary,
        sort_order: idx,
      }))
    )

  if (imageError) {
    return { error: `Gagal menyimpan gambar: ${imageError.message}` }
  }

  revalidatePath("/dashboard", "layout")
  revalidatePath("/", "layout")

  return { success: true }
}

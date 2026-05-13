"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string
  const phone = formData.get("phone") as string
  const role = formData.get("role") as string

  if (!email || !password || !fullName || !phone || !role) {
    return { error: "Semua kolom wajib diisi." }
  }

  if (password.length < 8) {
    return { error: "Kata sandi minimal 8 karakter." }
  }

  if (!["seller", "buyer"].includes(role)) {
    return { error: "Peran tidak valid." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        role,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")

  const { data: session } = await supabase.auth.getSession()

  if (session?.session) {
    if (role === "seller") {
      redirect("/dashboard?welcome=1")
    } else {
      redirect("/?welcome=1")
    }
  }

  redirect("/login?message=check_email")
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirect_to") as string) || ""

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")

  if (redirectTo && redirectTo.startsWith("/")) {
    redirect(redirectTo)
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .single()

  if (profile?.role === "seller" || profile?.role === "admin") {
    redirect("/dashboard")
  } else {
    redirect("/")
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

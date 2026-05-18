Rencana Pengembangan Barkasin — 15 Fase

Fase 1: Setup Proyek & Infrastruktur
1. Inisialisasi Next.js (App Router) + TypeScript + Tailwind CSS v4
2. Buat project Supabase, dapatkan NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
3. Install dependencies: @supabase/supabase-js, @supabase/ssr, @supabase/supabase-js
4. Setup Supabase client di utils/supabase/client.ts (client-side) & utils/supabase/server.ts (server-side)
5. Create .env.local dengan environment variables Supabase

Fase 2: Desain Database di Supabase
1. Tabel categories — id, name, slug — seed data: Elektronik, Fashion, Hobi, Rumah Tangga, Otomotif, dll.
2. Tabel products — id, seller_id (FK → auth.users), title, category_id (FK), price, description, condition (enum: new/used), location, contact_phone, contact_email, is_admin_post, created_at, updated_at
3. Tabel product_images — id, product_id (FK), image_url, is_primary, order
4. Supabase Storage Bucket product-images — max upload 5 images, 2MB each, JPG/PNG
5. RLS Policies — seller hanya bisa CRUD produk sendiri, buyer hanya baca, semua orang bisa baca categories, kontak hanya bisa diakses buyer login
6. Database Trigger — auto-create profile row saat user baru mendaftar

Fase 3: Sistem Autentikasi (Custom Form)
1. Buat halaman Register (/register) dengan field: nama lengkap, email, password (min 8 char), role (Seller/Buyer), checkbox SnK
2. Buat halaman Login (/login) dengan email + password
3. Implementasi Supabase Auth (signUp + signInWithPassword) dengan menyimpan role di user_metadata
4. Buat Auth Context/Provider untuk manage session global
5. Middleware — proteksi route: /dashboard/* hanya seller, buyer tidak bisa akses dashboard
6. Flow post-register: seller → /dashboard, buyer → /

Fase 4: Layout Global & Komponen Shared
1. Navbar — logo "Barkasin", menu Beranda, tombol "Pasang Iklan" (hanya untuk seller), Profil/Keluar
2. Footer — tautan ke halaman SnK, copyright
3. Layout responsif — sidebar/mobile nav, container max-width
4. Komponen ProductCard — reusable card untuk grid produk






Fase 5: Halaman SnK
1. Buat halaman /snk yang merender isi lengkap dari snk_barkasin.md (Pasal 1-14 + pernyataan persetujuan)
2. Aksesibel dari footer dan dari teks SnK di form registrasi

Fase 6: Dashboard Seller — Form Pemasangan Produk
1. Halaman /dashboard — tombol "Pasang Iklan Baru"
2. Form produk: judul, dropdown kategori (dari Supabase), harga, deskripsi, kondisi (Baru/Bekas), lokasi (opsional), upload foto (max 5, JPG/PNG, 2MB)
3. Upload gambar ke Supabase Storage bucket product-images
4. Simpan data produk ke tabel products + product_images
5. Validasi client-side & server-side

Fase 7: Dashboard Seller — Manajemen Produk
1. Tampilkan daftar produk milik seller (dari Supabase, filter by seller_id)
2. Tombol Edit — buka form pre-filled, bisa ganti data + gambar
3. Tombol Hapus — konfirmasi + hapus dari DB dan Storage
4. Produk yang diedit/dihapus langsung tercermin di halaman utama

Fase 8: Halaman Utama — Grid & Pencarian
1. Halaman / — grid produk dengan server-side rendering dari Supabase
2. Setiap kartu: foto utama, judul, harga, lokasi, tanggal posting
3. Search bar — cari berdasarkan kata kunci (judul + deskripsi) via Supabase ilike/textSearch
4. Filter panel — kategori, rentang harga, kondisi, lokasi
5. Infinite scroll atau pagination (load more)

Fase 9: Halaman Detail Produk
1. Halaman /products/[id] — server-side render full info produk
2. Galeri foto produk (bisa multiple images)
3. Conditional button:
   - Belum login: "Daftar/Login untuk melihat kontak penjual" → redirect ke /login
   - Buyer login: "Lihat Kontak Penjual" → klik → tampilkan nomor telepon/email penjual (via client-side fetch, tidak expose di SSR)
   - Seller sendiri: tampilkan tombol Edit/Hapus, tidak perlu tombol kontak
4. Sembunyikan kontak penjual dari SSR — hanya fetch via API route setelah klik











Fase 10: Akun Admin Khusus (Owner)
1. Seed 1 akun admin/owner via Supabase Dashboard atau script seed (email + password Anda)
2. Di form pemasangan produk admin: tambahkan field "Nomor Telepon Penjual" dan "Email Penjual" (wajib diisi)
3. Di halaman detail produk: buyer yang klik "Lihat Kontak" akan melihat kontak spesifik per produk (bukan kontak akun admin)
4. Admin bisa posting banyak produk dengan contact person berbeda-beda

Fase 11: Keamanan & RLS
1. RLS di tabel products: seller hanya bisa INSERT/UPDATE/DELETE produk miliknya sendiri
2. RLS di product_images: terikat ke produk seller
3. API route /api/products/[id]/contact — hanya mengembalikan kontak jika user login sebagai buyer (cek server-side)
4. Password hashing via bcrypt (bawaan Supabase Auth)
5. Validasi ukuran & tipe file upload di server-side

Fase 12: Responsivitas & UI Polish
1. Uji semua halaman di mobile (375px), tablet (768px), desktop (1280px)
2. Grid produk: 2 kolom mobile, 3 tablet, 4 desktop
3. Pastikan tombol "Lihat Kontak" warna kontras (hijau/biru)
4. Pastikan SnK checkbox di form register jelas terlihat, tidak tersembunyi

Fase 13: Testing
1. Uji flow registrasi Seller + pasang produk + produk muncul di halaman utama
2. Uji flow registrasi Buyer + cari produk + lihat kontak
3. Uji: user belum login tidak bisa akses kontak penjual (via API maupun UI)
4. Uji: SnK wajib dicentang sebelum daftar
5. Uji: upload gambar >5 file atau >2MB ditolak
6. Uji: seller tidak bisa edit/hapus produk seller lain

Fase 14: Deployment
1. Push kode ke GitHub repository
2. Hubungkan ke Vercel dan deploy (auto-deploy dari main branch)
3. Set environment variables di Vercel Dashboard
4. Setup Supabase production environment variables
5. Test semua flow di production
Fase 15: Pasca-Deploy
1. Admin login dan posting banyak produk awal (seed content)
2. Monitoring error via Vercel Analytics / Supabase logs
3. Siapkan mekanisme backup database Supabase
---
Total estimasi pengerjaan: ± 3 minggu (sesuai timeline PRD).

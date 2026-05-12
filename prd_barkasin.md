
BARKASIN
Platform Jual Beli Barang Bekas


PRODUCT REQUIREMENTS DOCUMENT
Versi 1.0

Nama Proyek	Barkasin
Versi Dokumen	1.0
Tanggal	12 Mei 2026
Status	Draft
Penulis	[Barkasin Production Team]


Dokumen ini bersifat rahasia dan hanya untuk keperluan internal pengembangan produk.
 
1.  Ringkasan Proyek

Barkasin adalah platform web yang berfungsi sebagai jembatan antara penjual (seller) dan pembeli (buyer) barang bekas. Platform tidak memproses pembayaran atau menyediakan payment gateway; seluruh transaksi dan komunikasi lebih lanjut berlangsung di luar sistem.

Barkasin menyediakan wadah bagi penjual untuk memasang iklan produk dan bagi pembeli untuk menemukan serta menghubungi penjual setelah menyelesaikan proses pendaftaran.

2.  Tujuan Produk

•	Menyediakan platform gratis dan sederhana untuk jual beli barang bekas.
•	Mempertemukan penjual dan pembeli tanpa keterlibatan platform dalam proses pembayaran maupun pengiriman.
•	Memberikan pengalaman pengguna yang aman melalui klausul Syarat dan Ketentuan (SnK) yang jelas mengenai batas tanggung jawab platform.

3.  Target Pengguna

Peran	Deskripsi
Penjual (Seller)	Individu yang ingin menjual barang bekas pribadi melalui platform.
Pembeli (Buyer)	Individu yang mencari dan berniat membeli barang bekas dari penjual terdaftar.

4.  Alur Utama (User Flow)

4.1  Alur Penjual
1.	Mendaftar akun dengan memilih peran “Seller”.
2.	Login ke platform.
3.	Mengisi dan mengirimkan formulir pemasangan produk.
4.	Produk tampil secara langsung di halaman utama.

4.2  Alur Pembeli
5.	Mendaftar akun dengan memilih peran “Buyer”.
6.	Login ke platform.
7.	Menjelajahi atau mencari produk di halaman utama.
8.	Membuka halaman detail produk.
9.	Mengklik tombol “Lihat Kontak Penjual” untuk mendapatkan informasi kontak.

Catatan: Tidak ada transaksi yang diproses di dalam platform. Komunikasi antara penjual dan pembeli dilanjutkan secara pribadi melalui saluran di luar sistem (telepon, pesan singkat, dan sebagainya).

5.  Fitur & Kebutuhan Fungsional

5.1  Registrasi & Autentikasi
Seluruh pengguna (seller maupun buyer) wajib mendaftarkan akun sebelum dapat melakukan aktivitas inti di platform. Formulir pendaftaran memuat kolom-kolom berikut:

•	Nama lengkap
•	Alamat surel (digunakan sebagai username)
•	Kata sandi (minimal 8 karakter)
•	Pilihan peran: “Saya ingin menjual” atau “Saya ingin membeli”
•	Kotak centang persetujuan Syarat & Ketentuan

“Saya telah membaca dan menyetujui Syarat & Ketentuan Barkasin. Saya memahami bahwa Barkasin tidak bertanggung jawab atas segala bentuk penipuan atau kerugian yang timbul dari transaksi antara penjual dan pembeli.”

Ketentuan tambahan:
•	Kotak centang SnK wajib dicentang; tombol “Daftar” tidak dapat diklik sebelum pengguna mencentang kotak tersebut.
•	Setelah pendaftaran berhasil, pengguna dialihkan ke halaman beranda sesuai peran yang dipilih.

5.2  Dashboard Seller
Setelah login, seller akan melihat antarmuka pengelolaan produk dengan fitur-fitur sebagai berikut:

•	Tombol utama “Pasang Iklan Baru”.
•	Formulir pemasangan produk yang memuat:
◦	Judul produk
◦	Kategori (dropdown: Elektronik, Fashion, Hobi, Rumah Tangga, dll.)
◦	Harga (numerik)
◦	Deskripsi singkat
◦	Kondisi barang (Baru / Bekas)
◦	Unggah foto: maksimal 5 gambar, format JPG/PNG, ukuran maksimal 2 MB per gambar
◦	Lokasi penjual (opsional, teks bebas)
•	Setelah formulir dikirimkan, produk langsung tampil di halaman utama tanpa proses moderasi (asumsi MVP).
•	Seller dapat melihat daftar produk miliknya serta melakukan pengeditan atau penghapusan.

5.3  Halaman Utama / Daftar Produk
Halaman utama dapat diakses oleh seluruh pengunjung dan menampilkan grid produk terbaru. Setiap kartu produk memuat informasi berikut:

•	Foto utama produk
•	Judul produk
•	Harga
•	Lokasi penjual
•	Tanggal posting

Fitur pencarian dan filter yang tersedia:
•	Pencarian berdasarkan kata kunci (judul dan/atau deskripsi)
•	Filter berdasarkan kategori, rentang harga, kondisi barang, dan lokasi

Setiap produk dapat diklik untuk membuka halaman detail produk.

5.4  Halaman Detail Produk
Halaman ini menampilkan seluruh informasi produk: judul, foto, deskripsi, harga, kondisi, lokasi, dan nama penjual. Akses terhadap kontak penjual dibedakan berdasarkan status login:

Status Pengunjung	Tampilan / Aksi yang Tersedia
Belum login / belum terdaftar	Tampil tombol “Daftar/Login untuk melihat kontak penjual”.
Buyer yang sudah login	Tampil tombol “Lihat Kontak Penjual”. Setelah diklik, nomor telepon/surel penjual ditampilkan.

Platform tidak menyimpan riwayat interaksi antara pembeli dan penjual. Fitur Simpan (wishlist) bersifat opsional untuk V1.

5.5  Halaman Syarat & Ketentuan (SnK)
Halaman SnK memuat penjelasan lengkap mengenai batas tanggung jawab platform, termasuk klausul utama berikut:

“Barkasin hanya menyediakan platform untuk mempertemukan penjual dan pembeli. Barkasin tidak terlibat dalam transaksi, pembayaran, pengiriman, dan tidak bertanggung jawab atas penipuan, barang tidak sesuai, atau wanprestasi yang terjadi di antara pengguna.”

Ketentuan tampilan SnK:
•	Teks kotak centang persetujuan SnK ditampilkan secara jelas pada formulir pendaftaran dan tidak disembunyikan di balik guliran yang jauh.
•	Tautan menuju halaman SnK tersedia di bagian footer dan dapat diakses kapan saja.

6.  Kebutuhan Non-Fungsional

Aspek	Kebutuhan
Keamanan	Kata sandi disimpan dalam bentuk hash menggunakan bcrypt. Data kontak pribadi hanya dapat diakses oleh buyer terdaftar yang sudah login.
Responsivitas	Antarmuka harus mobile-friendly (desain responsif) dan dapat diakses dengan baik dari perangkat desktop maupun ponsel.
Performa	Halaman produk dimuat dalam waktu kurang dari 3 detik pada koneksi standar.
Skalabilitas	Sistem mampu menangani minimal 500 produk dan 1.000 pengguna terdaftar pada tahap awal.
Privasi	Nomor kontak penjual hanya ditampilkan setelah tombol “Lihat Kontak” diklik oleh buyer yang sudah login.

7.  Panduan Desain UI/UX

•	Navbar: Logo “Barkasin”, menu Beranda, tombol Pasang Iklan (hanya muncul jika seller login), dan menu Profil/Keluar.
•	Halaman utama bersih dengan fokus pada grid produk; minim elemen dekoratif yang mengganggu.
•	Formulir pendaftaran sederhana; kotak centang SnK ditempatkan di bawah kolom isian, di atas tombol daftar.
•	Tombol “Lihat Kontak” menggunakan warna kontras (hijau atau biru) agar mudah dikenali.

8.  Asumsi & Batasan

•	MVP tidak mencakup sistem pembayaran, pengiriman, rating pengguna, fitur chat internal, maupun verifikasi identitas.
•	Setiap pengguna memilih satu peran (seller atau buyer) saat pendaftaran. Pada V1, satu akun terikat pada satu peran; dukungan multi-peran dapat dikembangkan pada versi berikutnya.
•	Semua produk bersifat publik dan tidak melalui proses moderasi otomatis. Fitur pelaporan konten dapat dipertimbangkan untuk versi mendatang.

9.  Timeline Pengembangan

Fase Pengembangan	Estimasi Durasi
Desain UI & Wireframe	1 minggu
Setup database & backend	1 minggu
Fitur registrasi & SnK	3 hari
Fitur CRUD produk	4 hari
Halaman utama & detail produk	3 hari
Testing & perbaikan bug	3 hari
TOTAL	± 3 Minggu

10.  Kriteria Rilis (Definition of Done)

Produk dinyatakan siap rilis apabila seluruh kriteria berikut telah terpenuhi:

10.	Penjual dapat mendaftar, login, memposting produk, dan produk muncul di halaman utama.
11.	Pembeli dapat mendaftar, login, mencari produk, dan mengakses kontak penjual.
12.	Kotak centang persetujuan SnK tampil pada formulir pendaftaran dan wajib dicentang sebelum akun dapat dibuat.
13.	Tidak terdapat celah keamanan yang memungkinkan pengguna yang belum login mengakses informasi kontak penjual.


Dokumen ini dapat langsung digunakan sebagai acuan pengembangan tim.
Barkasin © 2026  –  Semua Hak Dilindungi

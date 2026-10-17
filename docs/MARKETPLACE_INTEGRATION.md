# Integrasi Marketplace — Mandiri Startup Academy

## Tujuan
Mendukung praktik bisnis sungguhan melalui model gabungan:
1. Tahap awal memakai toko resmi sekolah dengan pengawasan guru.
2. Tiap kelompok mengelola brand, produk/SKU, stok, konten, dan laporan masing-masing.
3. Kelompok yang memenuhi ketentuan platform dapat mengotorisasi toko mereka sendiri.
4. Sinkronisasi API baru dianggap aktif setelah kredensial, persetujuan scope, otorisasi toko, dan pengujian berhasil.

## Status saat ini
- Halaman Hub Marketplace dibuat sebagai panduan dan pintu masuk ke Seller Centre.
- Belum ada koneksi API Shopee atau TikTok Shop yang aktif.
- Belum ada token marketplace, app secret, webhook, atau OAuth callback yang dikonfigurasi.
- Belum ada pengujian pesanan langsung.
- Listing dan pesanan tahap awal dikelola manual di Seller Centre; catatan latihan dapat dicatat di aplikasi sekolah.
- Jangan menyimpan app secret/token di frontend, repository GitHub, atau dokumen Firestore yang dapat diakses browser.

## Arsitektur target
- Frontend GitHub Pages: marketplace-hub.html untuk panduan/status; dashboard/student.html untuk brand, produk, stok, dan laporan latihan.
- Backend HTTPS: Firebase Cloud Functions atau layanan server yang dikelola sekolah untuk OAuth callback, API request signing, token refresh, webhook, retry, audit, dan sinkronisasi.
- Secret storage: Firebase Secret Manager atau Secret Manager yang setara. Rahasia tidak boleh dikirim ke browser.
- Firestore: simpan metadata non-rahasia seperti platform, pemilik koneksi (school/group), status, shop identifier yang diizinkan, waktu sinkronisasi terakhir, dan pesan error yang sudah disanitasi. Token hanya di server-side storage.
- Marketplace: gunakan API resmi sesuai akses yang benar-benar disetujui aplikasi partner.

## Rencana pelaksanaan
### Tahap 0 — Tata kelola dan toko sekolah
- Tetapkan penanggung jawab toko sekolah, email/nomor pemulihan, rekening/penyelesaian pembayaran, alamat pengiriman/retur, aturan produk yang boleh dijual, dan SOP penanganan komplain.
- Pastikan produk sungguhan, persediaan, izin produk, dan persetujuan sekolah tersedia.
- Buat akun toko melalui situs Seller Centre resmi dan ikuti verifikasi platform.
- Batasi akses akun utama kepada pengelola yang ditunjuk. Gunakan akses staf/anggota resmi bila tersedia.

### Tahap 1 — Praktik manual yang nyata
- Guru menyetujui listing sebelum diterbitkan.
- Kelompok membuat brand dan SKU unik; catat harga pokok, stok, harga jual, foto, variasi, dan deskripsi.
- Unggah produk melalui Seller Centre dan buat video promosi sesuai aturan platform.
- Proses pesanan hanya melalui alur resmi marketplace; catat status, pengemasan, pengiriman, komplain, retur, dan rekonsiliasi.
- Pisahkan laporan tiap kelompok agar pendapatan, biaya, dan stok tidak tercampur.

### Tahap 2 — Pendaftaran aplikasi API
- Shopee: daftar/masuk ke Shopee Open Platform, buat aplikasi sesuai jenis integrasi, periksa dokumentasi API dan izin yang tersedia untuk akun/market yang digunakan, konfigurasi callback, lalu uji di lingkungan yang didukung.
- TikTok Shop: daftar/masuk ke Partner Center, buat aplikasi sesuai market dan seller type, aktifkan API, pilih scope minimum, set redirect URL/webhook URL, dan ikuti proses review/approval yang diminta.
- Catat hasil persetujuan dan batas akses. Pembuatan aplikasi developer saja tidak berarti akses API produksi telah disetujui.

### Tahap 3 — Backend dan otorisasi toko
- Buat endpoint HTTPS untuk memulai otorisasi, callback, menyimpan metadata koneksi, memproses webhook, dan sinkronisasi.
- Validasi state/nonce dan callback; cegah replay; jangan menerima access token dari frontend sebagai sumber yang dipercaya.
- Simpan dan perbarui token di server-side secret storage/database privat dengan akses minimum.
- Verifikasi signature webhook/request sesuai dokumentasi platform. Redaksi token, secret, alamat, nomor telepon, dan data pelanggan dari log.
- Setiap koneksi dimiliki oleh school atau groupId; admin mengotorisasi/mencabut koneksi. Kelompok hanya boleh melihat metadata koneksi kelompoknya sendiri.

### Tahap 4 — Sinkronisasi bertahap
1. Read-only: verifikasi toko yang diotorisasi dan baca produk/pesanan yang scope-nya disetujui.
2. Produk: sinkronkan satu SKU uji, harga, stok, dan status; cegah duplikasi dengan mapping ID internal ↔ ID marketplace.
3. Pesanan: ingest webhook secara idempotent; simpan event ID dan status, dukung retry dan dead-letter/error queue.
4. Pengiriman/retur/keuangan: tambahkan hanya setelah endpoint, scope, dan alur bisnis tersedia untuk aplikasi yang disetujui.
5. Multi-tenant: uji toko sekolah dan toko kelompok secara terpisah; tidak boleh ada data lintas kelompok.

## Model data yang disarankan (metadata saja)
Collection MarketplaceConnections, satu dokumen per koneksi:
- platform: shopee atau tiktok_shop
- ownerType: school atau group
- groupId: string atau null
- shopId: identifier dari platform, jika diperbolehkan
- status: pending, authorized, needs_reauth, revoked, error
- scopes: daftar scope yang diberikan
- connectedAt, lastSyncAt, lastErrorCode
- createdBy, updatedAt

Jangan simpan appSecret, accessToken, refreshToken, authorization code, atau secret webhook pada dokumen yang bisa dibaca client. Data pesanan pelanggan juga harus dibatasi dan diminimalkan.

## Kriteria penerimaan sebelum menyebut “terintegrasi”
- Aplikasi partner disetujui/diaktifkan dan scope yang diperlukan terlihat.
- Toko mengotorisasi aplikasi dan callback berhasil.
- Token hanya tersimpan server-side dan refresh/revoke diuji.
- Panggilan API uji berhasil untuk toko yang tepat.
- Produk uji dapat dipetakan tanpa duplikasi.
- Event pesanan uji dapat diproses sekali, meskipun webhook dikirim ulang.
- Uji akses membuktikan siswa grup A tidak dapat melihat toko/pesanan grup B.
- Error, pencabutan izin, token kedaluwarsa, dan gangguan API ditangani.
- Tidak ada secret atau data pelanggan sensitif dalam repository/log publik.

## Referensi resmi
- Shopee Open Platform: https://open.shopee.com/
- Shopee Seller Centre Indonesia: https://seller.shopee.co.id/
- TikTok Shop Partner Center: https://partner.tiktokshop.com/
- TikTok Shop Seller Center Indonesia: https://seller-id.tiktok.com/

## Catatan
Endpoint, signature, scope, webhook event, market availability, dan persyaratan review harus diimplementasikan berdasarkan dokumentasi resmi yang berlaku untuk aplikasi yang didaftarkan. Jangan menebak endpoint atau menganggap semua API tersedia untuk akun Indonesia.

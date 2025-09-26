# PANDUAN PENGGUNA LEADS ALADDIN

Sistem Manajemen Leads untuk Industri Karpet

---

## DAFTAR ISI

1. [Pengenalan Sistem](#pengenalan-sistem)
2. [Matriks Role dan Permissions](#matriks-role-dan-permissions)
3. [Login dan Dashboard](#login-dan-dashboard)
4. [Panduan Super User](#panduan-super-user)
5. [Panduan Supervisor](#panduan-supervisor)
6. [Panduan Marketing](#panduan-marketing)
7. [Workflow dan Proses Bisnis](#workflow-dan-proses-bisnis)
8. [Spesifikasi Teknis](#spesifikasi-teknis)
9. [FAQ dan Tips](#faq-dan-tips)

---

## PENGENALAN SISTEM

### Tentang Leads Aladdin

Leads Aladdin adalah sistem manajemen lead penjualan yang dirancang khusus untuk industri karpet. Sistem ini membantu tim penjualan mengelola prospek dari kontak awal hingga menjadi pelanggan.

### Status Leads

- **WARM**: Calon customer yang menghubungi untuk pertama kali
- **HOT**: Sudah minta desain atau survey lokasi
- **CUSTOMER**: Memutuskan untuk membeli
- **EXIT**: Memutuskan untuk tidak membeli
- **COLD**: Tidak ada kejelasan setelah follow up 3 kali
- **CROSS_SELLING**: Testimoni dan penawaran produk lain

### Tahapan Follow Up

1. **Greeting** - Penyambutan awal
2. **Impresi** - Membuat kesan pertama
3. **Small Talk** - Percakapan ringan
4. **Rekomendasi** - Memberikan saran produk
5. **Pengajuan Survei** - Menawarkan survey lokasi
6. **Presentasi** - Menampilkan proposal/desain
7. **Form Pemesanan** - Mengisi formulir pesanan
8. **Up/Cross Selling** - Penawaran produk tambahan
9. **Invoice** - Pembayaran
10. **Konfirmasi Pemasangan** - Konfirmasi jadwal pemasangan

---

## MATRIKS ROLE DAN PERMISSIONS

### Tabel Role dan Hak Akses

| **Fitur/Menu** | **Super User** | **Supervisor** | **Marketing** | **Keterangan** |
|----------------|----------------|----------------|---------------|----------------|
| **DASHBOARD** | ✅ | ✅ | ✅ | Dashboard disesuaikan berdasarkan role |
| **Leads Management** | | | | |
| ├─ Lihat Semua Leads | ✅ | ✅ (Multi-cabang) | ✅ (1 cabang) | Marketing hanya melihat leads cabang sendiri |
| ├─ Tambah Leads | ✅ | ❌ | ✅ | Supervisor tidak bisa menambah leads |
| ├─ Edit Leads | ✅ | ❌ | ✅ | Supervisor hanya monitoring |
| ├─ Hapus Leads | ✅ | ❌ | ❌ | Hanya Super User yang bisa hapus |
| ├─ Export Leads | ✅ | ✅ | ❌ | Marketing tidak bisa export |
| **Follow Up Management** | | | | |
| ├─ Lihat Follow Ups | ✅ | ✅ | ✅ | Sesuai akses cabang masing-masing |
| ├─ Tambah Follow Up | ✅ | ❌ | ✅ | Supervisor hanya monitoring |
| ├─ Complete Follow Up | ✅ | ❌ | ✅ | Marketing yang eksekusi follow up |
| ├─ Reschedule Follow Up | ✅ | ❌ | ✅ | Marketing bisa reschedule |
| ├─ Excel View | ✅ | ✅ | ✅ | View khusus untuk analisis |
| **Document Management** | | | | |
| ├─ Upload Dokumen | ✅ | ❌ | ✅ | Marketing upload dokumen leads |
| ├─ Download Dokumen | ✅ | ✅ | ✅ | Semua bisa download |
| ├─ Hapus Dokumen | ✅ | ❌ | ✅ | Marketing bisa hapus dokumen sendiri |
| ├─ Lihat Semua Dokumen | ✅ | ✅ | ✅ | Sesuai akses cabang |
| **Kunjungan (Survey)** | | | | |
| ├─ Tambah Kunjungan | ✅ | ❌ | ✅ | Marketing yang melakukan kunjungan |
| ├─ Edit Kunjungan | ✅ | ❌ | ✅ | Marketing update hasil kunjungan |
| ├─ Lihat Kunjungan | ✅ | ✅ | ✅ | Sesuai akses cabang |
| ├─ Kelola Item Kunjungan | ✅ | ❌ | ✅ | Detail pengukuran dan estimasi |
| **User Management** | | | | |
| ├─ CRUD Users | ✅ | ❌ | ❌ | Hanya Super User |
| ├─ Assign User ke Cabang | ✅ | ❌ | ❌ | Hanya Super User |
| ├─ Reset Password User | ✅ | ❌ | ❌ | Hanya Super User |
| **Branch Management** | | | | |
| ├─ CRUD Cabang | ✅ | ❌ | ❌ | Hanya Super User |
| ├─ Assign Users ke Cabang | ✅ | ❌ | ❌ | Hanya Super User |
| ├─ Lihat Stats Cabang | ✅ | ✅ | ❌ | Supervisor sesuai cabang yang diawasi |
| **Master Data** | | | | |
| ├─ Sumber Leads | ✅ | ❌ | ❌ | Hanya Super User |
| ├─ Tipe Karpet | ✅ | ❌ | ❌ | Hanya Super User |
| ├─ Follow Up Stages | ✅ | ❌ | ❌ | Hanya Super User |
| ├─ Kunjungan Items | ✅ | ❌ | ❌ | Hanya Super User |
| **Reports & Analytics** | | | | |
| ├─ Dashboard Reports | ✅ | ✅ | ❌ | Supervisor akses multi-cabang |
| ├─ Export Reports | ✅ | ✅ | ❌ | Format Excel/PDF |
| ├─ Analytics Dashboard | ✅ | ✅ | ❌ | Conversion rate, trends, dll |
| ├─ Cross-Branch Reports | ✅ | ❌ | ❌ | Hanya Super User |

### Detail Akses Cabang

| **Role** | **Akses Cabang** | **Deskripsi** |
|----------|------------------|---------------|
| **Super User** | Semua cabang | Dapat beralih antar cabang dan melihat data global |
| **Supervisor** | Multi-cabang (assigned) | Dapat diassign ke 1 atau lebih cabang |
| **Marketing** | 1 cabang (assigned) | Hanya bisa akses 1 cabang yang ditugaskan |

### Level Otorisasi Data

| **Level** | **Super User** | **Supervisor** | **Marketing** |
|-----------|----------------|----------------|---------------|
| **System Configuration** | ✅ Full Control | ❌ | ❌ |
| **Multi-Branch Operations** | ✅ | ✅ (assigned branches) | ❌ |
| **Operational Tasks** | ✅ | Read Only | ✅ (own branch) |
| **Reports & Analytics** | ✅ All branches | ✅ Assigned branches | ❌ |
| **Data Export** | ✅ | ✅ | ❌ |

### Menu yang Tampil per Role

#### Super User - Menu Lengkap:
- Dashboard
- Leads
- Follow Ups  
- Dokumen
- Kunjungan
- Users ⭐
- Cabang ⭐
- Sumber Leads ⭐
- Tipe Karpet ⭐
- Follow Up Stages ⭐
- Kunjungan Items ⭐
- Reports ⭐

#### Supervisor - Menu Monitoring:
- Dashboard
- Leads (Read Only)
- Follow Ups (Read Only)
- Dokumen (Read Only)
- Kunjungan (Read Only)
- Reports ⭐

#### Marketing - Menu Operasional:
- Dashboard
- Leads
- Follow Ups
- Dokumen
- Kunjungan

**Keterangan:**
- ⭐ Menu khusus untuk role tertentu
- Semua akses disesuaikan dengan cabang yang di-assign
- Super User dapat switch antar cabang menggunakan dropdown selector

---

## LOGIN DAN DASHBOARD

### Cara Login
1. Buka aplikasi Leads Aladdin di browser
2. Masukkan email dan password yang diberikan admin
3. Klik tombol "Masuk"

### Dashboard Utama
Dashboard menampilkan informasi penting berdasarkan role Anda:
- **Ringkasan Leads** (jumlah leads berdasarkan status)
- **Follow Up Hari Ini** (jadwal follow up yang perlu dilakukan)
- **Statistik Kunjungan** (untuk supervisor dan super user)
- **Leads Terbaru** (aktivitas leads terkini)

### Navigasi Aplikasi
- **Menu Sidebar**: Daftar menu utama di sebelah kiri
- **Selector Cabang**: Dropdown untuk memilih cabang aktif (di bawah logo)
- **Profile Menu**: Menu pengaturan akun di pojok kanan atas

---

## PANDUAN SUPER USER

### Akses Super User
Super User memiliki akses penuh ke semua fitur sistem dan dapat mengelola seluruh organisasi.

### 1. MANAJEMEN PENGGUNA

#### Menambah User Baru
1. Pilih menu **"Users"** di sidebar
2. Klik tombol **"Tambah User"**
3. Isi formulir:
   - Nama lengkap
   - Email (akan digunakan untuk login)
   - Password
   - Role (Super User/Supervisor/Marketing)
   - Status aktif
4. Klik **"Simpan"**

#### Mengedit User
1. Di halaman Users, klik nama user yang ingin diedit
2. Klik tombol **"Edit"**
3. Ubah informasi yang diperlukan
4. Klik **"Update"**

#### Assign User ke Cabang
1. Pilih menu **"Cabang"**
2. Klik nama cabang
3. Di bagian **"Assign Users"**, pilih user yang akan ditugaskan
4. Klik **"Assign"**

### 2. MANAJEMEN CABANG

#### Menambah Cabang Baru
1. Pilih menu **"Cabang"** di sidebar
2. Klik tombol **"Tambah Cabang"**
3. Isi informasi cabang:
   - Nama cabang
   - Alamat lengkap
   - Nomor telepon
   - Koordinat lokasi (opsional)
4. Klik **"Simpan"**

#### Mengelola Cabang
- Melihat daftar user yang ditugaskan di cabang
- Mengaktifkan/menonaktifkan cabang
- Melihat statistik leads per cabang

### 3. MANAJEMEN DATA MASTER

#### Sumber Leads
1. Pilih menu **"Sumber Leads"**
2. Kelola daftar sumber leads (Facebook, Instagram, Referral, dll)
3. Tambah, edit, atau nonaktifkan sumber leads

#### Tipe Karpet
1. Pilih menu **"Tipe Karpet"**
2. Kelola jenis-jenis karpet yang dijual
3. Tambah deskripsi dan spesifikasi produk

#### Tahapan Follow Up
1. Pilih menu **"Follow Up Stages"**
2. Kelola urutan tahapan follow up
3. Atur tahapan selanjutnya untuk setiap stage
4. Drag & drop untuk mengubah urutan

### 4. LAPORAN MULTI-CABANG

#### Melihat Laporan Lengkap
1. Pilih menu **"Reports"**
2. Pilih rentang tanggal
3. Filter berdasarkan:
   - Cabang
   - User/Marketing
   - Status leads
   - Sumber leads
4. Klik **"Tampilkan Laporan"**

#### Export Laporan
1. Di halaman laporan, klik **"Export"**
2. Pilih format (Excel/PDF)
3. File akan diunduh otomatis

### 5. PENGATURAN SISTEM

#### Konfigurasi Follow Up
- Atur interval default follow up (default 3 hari)
- Atur maksimal percobaan per tahap (default 3x)
- Konfigurasi auto-scheduling follow up

---

## PANDUAN SUPERVISOR

### Akses Supervisor
Supervisor dapat mengakses laporan dan mengelola multiple cabang yang ditugaskan.

### 1. DASHBOARD SUPERVISOR

#### Informasi yang Ditampilkan
- Total leads di semua cabang yang diawasi
- Performance marketing di bawah supervisi
- Trend konversi leads ke customer
- Follow up yang tertunda

#### Memilih Cabang Aktif
1. Gunakan dropdown **"Pilih Cabang"** di bawah logo
2. Pilih cabang yang ingin dilihat datanya
3. Dashboard akan menampilkan data cabang terpilih

### 2. MONITORING LEADS

#### Melihat Daftar Leads
1. Pilih menu **"Leads"**
2. Filter berdasarkan:
   - Status leads
   - Marketing PIC
   - Tanggal leads
   - Sumber leads
3. Klik nama leads untuk melihat detail

#### Memantau Follow Up
1. Pilih menu **"Follow Ups"**
2. Lihat jadwal follow up hari ini
3. Monitor follow up yang terlambat
4. Lihat hasil follow up dari marketing

### 3. ANALISA LAPORAN

#### Dashboard Analytics
1. Pilih menu **"Reports"**
2. Lihat widget analisa:
   - Conversion Rate per Marketing
   - Top Performing Sources
   - Monthly Trends
   - Lead Distribution

#### Laporan Detail
1. Atur filter tanggal dan cabang
2. Analisa performa marketing:
   - Jumlah leads baru
   - Tingkat konversi
   - Follow up completion rate
   - Rata-rata deal value

#### Export untuk Presentasi
1. Export laporan dalam format PDF untuk presentasi
2. Excel untuk analisa lebih lanjut
3. Jadwalkan laporan berkala (jika tersedia)

### 4. TIPS SUPERVISI

#### Monitoring Harian
- Cek dashboard setiap pagi untuk follow up hari ini
- Review leads yang sudah lama tidak ada progress
- Monitor response rate marketing

#### Review Mingguan
- Analisa trend konversi
- Review leads yang berubah status
- Evaluasi performa individual marketing

#### Tindakan Korektif
- Follow up dengan marketing untuk leads yang tertunda
- Koordinasi dengan super user untuk kebutuhan training
- Identifikasi sumber leads yang paling efektif

---

## PANDUAN MARKETING

### Akses Marketing
Marketing fokus pada pengelolaan leads di satu cabang yang ditugaskan.

### 1. DASHBOARD MARKETING

#### Informasi Utama
- Leads hari ini yang perlu di-follow up
- Target dan pencapaian bulanan
- Status leads terbaru
- Reminder follow up

#### Quick Actions
- Tambah leads baru (tombol + di pojok kanan)
- Lihat follow up hari ini
- Upload dokumen leads

### 2. MENGELOLA LEADS

#### Menambah Leads Baru
1. Klik tombol **"Tambah Leads"** atau menu **"Leads"** � **"Tambah"**
2. Isi formulir leads:
   - **Tanggal Leads**: Tanggal kontak pertama
   - **Sapaan**: Bapak/Ibu
   - **Nama Pelanggan**: Nama lengkap
   - **No WhatsApp**: Format 62xxx (international)
   - **Nama Masjid/Instansi**: Lokasi pemasangan
   - **Alamat**: Alamat lengkap
   - **Sumber Leads**: Pilih dari dropdown
   - **Tipe Karpet**: Jenis karpet yang diminati
   - **Prioritas**: Fasttrack/Normal/Rendah
   - **Kebutuhan Karpet**: Misal "10x10 meter"
   - **Potensi Nilai**: Estimasi nilai transaksi
   - **Budget Range**: Budget minimum dan maksimum
   - **Catatan**: Informasi tambahan
   - **Status**: WARM (default untuk leads baru)
3. Klik **"Simpan"**

#### Mengedit Leads
1. Di daftar leads, klik nama leads
2. Klik tombol **"Edit"**
3. Update informasi yang diperlukan
4. **Penting**: Jika status berubah ke CUSTOMER, isi:
   - Alasan Closing
   - Tanggal Closing
   - Nominal Deal
5. Jika status EXIT, isi **Alasan Tidak Closing**

### 3. FOLLOW UP MANAGEMENT

#### Cara Membuat Follow Up
1. Di detail leads, klik **"Tambah Follow Up"**
2. Pilih tahapan follow up (Greeting, Impresi, dll)
3. Atur jadwal follow up
4. Tambahkan catatan planning
5. Klik **"Simpan"**

#### Melakukan Follow Up
1. Di menu **"Follow Ups"**, lihat jadwal hari ini
2. Klik follow up yang akan dilakukan
3. Lakukan follow up (telepon/WhatsApp/kunjungan)
4. Isi hasil follow up:
   - **Ada Respon**: Ya/Tidak
   - **Hasil Follow Up**: Pilih dari dropdown
   - **Catatan**: Detail percakapan
5. Klik **"Selesai"**

#### Sistem Auto-Scheduling
- Sistem akan otomatis jadwalkan follow up berikutnya (+3 hari)
- Setiap tahap maksimal 3x percobaan
- Jika 3x tidak ada respon, leads menjadi COLD
- Anda bisa ubah jadwal manual jika perlu

#### Tips Follow Up Efektif
- **Greeting**: Perkenalkan diri dan perusahaan
- **Impresi**: Tanyakan kebutuhan spesifik
- **Small Talk**: Bangun rapport dengan pelanggan
- **Rekomendasi**: Tawarkan solusi sesuai kebutuhan
- **Survey**: Jadwalkan kunjungan untuk ukur lokasi
- **Presentasi**: Tunjukkan desain dan harga
- **Pemesanan**: Bantu isi formulir pesanan
- **Invoice**: Proses pembayaran
- **Pemasangan**: Konfirmasi jadwal instalasi

### 4. MANAJEMEN DOKUMEN

#### Upload Dokumen Leads
1. Di detail leads, pilih tab **"Dokumen"**
2. Klik **"Upload Dokumen"**
3. Isi informasi:
   - **Judul**: Nama dokumen
   - **Kategori**: Penawaran/Sketsa Survey/Lainnya
   - **Deskripsi**: Keterangan dokumen
   - **File**: Upload file (PDF, gambar, Excel)
4. Klik **"Upload"**

#### Mengelola Dokumen
- Lihat semua dokumen leads di satu halaman
- Download dokumen untuk dikirim ke pelanggan
- Hapus dokumen yang tidak relevan
- Kategorikan dengan benar untuk mudah dicari

### 5. KUNJUNGAN (SURVEY)

#### Membuat Kunjungan
1. Pilih menu **"Kunjungan"**
2. Klik **"Tambah Kunjungan"**
3. Isi detail kunjungan:
   - Leads terkait
   - Tanggal dan waktu kunjungan
   - Alamat kunjungan
   - Tujuan kunjungan
4. Upload foto lokasi jika tersedia

#### Mengelola Item Kunjungan
- Catat hasil pengukuran
- Upload sketsa atau gambar
- Catat kebutuhan khusus pelanggan
- Hitung estimasi biaya

### 6. TIPS SUKSES MARKETING

#### Daily Routine
1. **Pagi**: Cek follow up hari ini di dashboard
2. **Follow up**: Lakukan sesuai jadwal
3. **Update**: Catat hasil setiap follow up
4. **Planning**: Jadwalkan follow up berikutnya

#### Weekly Review
- Review leads yang masih WARM > 1 minggu
- Follow up leads HOT yang belum ada progress
- Update status leads sesuai perkembangan terbaru

#### Best Practices
- **Respon Cepat**: Follow up leads baru dalam 24 jam
- **Konsisten**: Jangan skip jadwal follow up
- **Dokumentasi**: Catat semua percakapan penting
- **Follow Through**: Pastikan janji ditepati
- **Customer Service**: Tetap ramah meski prospek tidak jadi

#### Closing Techniques
- Pahami kebutuhan real pelanggan
- Tawarkan solusi yang sesuai budget
- Berikan value tambah (bonus, diskon, service)
- Follow up konsisten tanpa memaksa
- Build trust melalui testimoni dan referensi

---

## WORKFLOW DAN PROSES BISNIS

### Flow Chart Manajemen Leads

```
LEAD BARU (WARM)
       ↓
   FOLLOW UP
       ↓
┌─────────────────┐
│  GREETING       │ ← Maksimal 3x percobaan
│  (Hari 1,4,7)   │
└─────────┬───────┘
          ↓ (Ada respon)
┌─────────────────┐
│  IMPRESI        │ ← Maksimal 3x percobaan
│  (Hari 10,13,16)│
└─────────┬───────┘
          ↓ (Tertarik)
┌─────────────────┐
│  SMALL TALK     │ ← Build rapport
│  (Hari 19)      │
└─────────┬───────┘
          ↓
┌─────────────────┐
│  REKOMENDASI    │ ← Tawar produk
│  (Hari 22,25)   │
└─────────┬───────┘
          ↓ (Minat)
┌─────────────────┐
│  SURVEI         │ ← Status: HOT
│  (Hari 28)      │
└─────────┬───────┘
          ↓
┌─────────────────┐
│  PRESENTASI     │ ← Tunjukkan desain
│  (Hari 31)      │
└─────────┬───────┘
          ↓
┌─────────────────┐
│  FORM PESANAN   │ ← Isi formulir
│  (Hari 34,37)   │
└─────────┬───────┘
          ↓ (Deal)
┌─────────────────┐
│  INVOICE        │ ← Status: CUSTOMER
│  (Hari 40)      │
└─────────┬───────┘
          ↓
┌─────────────────┐
│  PEMASANGAN     │ ← Konfirmasi jadwal
│  (Hari 43)      │
└─────────────────┘
```

### Status Progression Flow

```
WARM ──→ HOT ──→ CUSTOMER
 │        │         ↓
 │        │    CROSS_SELLING
 │        │
 ↓        ↓
EXIT ←── COLD
```

### Decision Tree Follow Up

```
Follow Up Dilakukan?
├─ YA: Ada Respon?
│  ├─ YA: Lanjut ke Stage Berikutnya
│  └─ TIDAK: Coba lagi (maks 3x)
│     ├─ Belum 3x: Jadwalkan ulang (+3 hari)
│     └─ Sudah 3x: Status jadi COLD
└─ TIDAK: Follow up tertunda
   └─ Update jadwal follow up
```

### Workflow Kunjungan (Survey)

```
LEADS STATUS HOT
       ↓
  JADWAL SURVEY
       ↓
   KUNJUNGAN
  ┌─────────┐
  │ Ukur    │
  │ Foto    │
  │ Sketsa  │
  │ Hitung  │
  └─────────┘
       ↓
   INPUT DATA
  ┌─────────┐
  │ Dimensi │
  │ Foto    │
  │ Estimasi│
  │ Catatan │
  └─────────┘
       ↓
   PRESENTASI
```

### Workflow Dokumen

```
CREATE DOKUMEN
       ↓
   PILIH LEADS
       ↓
   ISI DETAIL
  ┌─────────┐
  │ Judul   │
  │ Kategori│
  │ Desk.   │
  │ File    │
  └─────────┘
       ↓
     UPLOAD
       ↓
   TERSIMPAN
```

### Process Marketing Daily

```
PAGI (08:00)
├─ Cek Dashboard
├─ Lihat Follow Up Hari Ini
└─ Prioritas Leads HOT

SIANG (13:00)
├─ Eksekusi Follow Up
├─ Update Status Leads
└─ Upload Dokumen

SORE (17:00)
├─ Input Hasil Follow Up
├─ Schedule Follow Up Berikutnya
└─ Update Kunjungan
```

---

## SPESIFIKASI TEKNIS

### Persyaratan Sistem

#### Server Requirements
- **Backend**: Laravel 12 + PHP 8.2+
- **Database**: SQLite (development), MySQL/PostgreSQL (production)
- **Cache**: Redis (optional)
- **Queue**: Database/Redis
- **Storage**: Local filesystem (public directory)

#### Browser Compatibility
- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Resolution**: Minimum 320px width (mobile first)

### File Upload Specifications

| **Type** | **Max Size** | **Format** | **Usage** |
|----------|--------------|------------|-----------|
| **Dokumen Leads** | 10MB | PDF, DOC, XLSX, JPG, PNG | Penawaran, sketsa, kontrak |
| **Foto Kunjungan** | 5MB | JPG, PNG, WEBP | Foto lokasi survey |
| **Avatar User** | 2MB | JPG, PNG | Profile picture |

### Database Schema Overview

#### Core Tables
- **users**: Data pengguna dan role
- **cabangs**: Master data cabang
- **user_cabangs**: Relasi user-cabang (many-to-many)
- **leads**: Data leads utama
- **follow_ups**: Riwayat follow up
- **follow_up_stages**: Master tahapan follow up
- **dokumens**: File dokumen leads
- **kunjungans**: Data kunjungan/survey
- **kunjungan_items**: Item detail kunjungan

#### Master Data Tables
- **sumber_leads**: Master sumber leads
- **tipe_karpets**: Master tipe karpet
- **kunjungan_item_categories**: Kategori item kunjungan

### API Endpoints Overview

#### Authentication
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /password/reset` - Reset password

#### Leads Management
- `GET /leads` - List leads (filtered by role/branch)
- `POST /leads` - Create new lead
- `GET /leads/{id}` - Show lead detail
- `PUT /leads/{id}` - Update lead
- `DELETE /leads/{id}` - Delete lead (super user only)

#### Follow Up Management
- `GET /follow-ups` - List follow ups
- `POST /leads/{id}/follow-ups` - Create follow up
- `PATCH /follow-ups/{id}/complete` - Complete follow up
- `PATCH /follow-ups/{id}/reschedule` - Reschedule follow up

### Configuration Files

#### config/leads.php
```php
'statuses' => [
    'WARM', 'HOT', 'CUSTOMER', 'EXIT', 'COLD', 'CROSS_SELLING'
]
'prioritas' => ['fasttrack', 'normal', 'rendah']
'sapaan' => ['Bapak', 'Ibu']
'alasan_closing' => [...] // 6 alasan
'alasan_tidak_closing' => [...] // 5 alasan
'follow_up' => [
    'max_attempts_per_stage' => 3,
    'default_interval_days' => 3
]
```

### Real-time Features
- **Auto-scheduling**: Follow up otomatis dijadwalkan
- **Status updates**: Real-time update status leads
- **Notifications**: Reminder follow up hari ini
- **Dashboard widgets**: Live statistics

### Security Features
- **Authentication**: Laravel Breeze
- **Authorization**: Role-based access control
- **CSRF Protection**: Laravel built-in
- **File Upload**: Validated mime types and size
- **SQL Injection**: Eloquent ORM protection
- **XSS Protection**: Blade templating

### Performance Optimizations
- **Caching**: Follow up stages cached
- **Pagination**: Large data sets paginated
- **Lazy Loading**: Images and documents
- **Database Indexing**: Key fields indexed
- **Asset Optimization**: Vite build optimization

### Backup and Recovery
- **Database**: Daily automated backups (production)
- **Files**: Synchronized to cloud storage
- **Export**: Manual export reports for backup
- **Recovery**: Point-in-time recovery available

---

## FAQ DAN TIPS

### Frequently Asked Questions

#### Q: Bagaimana jika lupa password?
A: Gunakan fitur "Lupa Password" di halaman login atau hubungi admin untuk reset.

#### Q: Leads sudah 3x follow up tapi masih mau dilanjutkan, bagaimana?
A: Buat follow up baru di tahap yang sama atau lanjut ke tahap berikutnya. Sistem akan reset counter percobaan.

#### Q: Bagaimana mengganti cabang aktif?
A: Gunakan dropdown "Pilih Cabang" yang ada di bawah logo di sidebar.

#### Q: Bisakah edit leads yang sudah jadi CUSTOMER?
A: Ya, tapi pastikan data closing (tanggal, nominal, alasan) sudah benar karena akan mempengaruhi laporan.

#### Q: Format nomor WhatsApp yang benar?
A: Gunakan format international dimulai dengan 62, contoh: 628123456789

#### Q: Bagaimana cara mengatasi leads yang tidak bisa dihubungi?
A: Ubah status menjadi COLD setelah 3x percobaan follow up. Bisa dicoba lagi nanti dengan kontak alternatif.

#### Q: Apakah bisa mengubah urutan tahapan follow up?
A: Ya, Super User dapat mengatur urutan di menu "Follow Up Stages". Tahapan bisa di-skip sesuai kondisi.

#### Q: Bagaimana cara backup data leads?
A: Export laporan secara berkala. Supervisor dan Super User dapat export dalam format Excel/PDF.

#### Q: Bisakah satu user akses multiple cabang?
A: Supervisor bisa diassign ke multiple cabang. Marketing hanya 1 cabang. Super User akses semua.

#### Q: Apa yang terjadi jika follow up terlambat?
A: Follow up tetap bisa dilakukan. Sistem akan menandai sebagai "terlambat" di dashboard supervisor.

#### Q: Bagaimana cara menghapus leads yang salah input?
A: Hanya Super User yang bisa hapus leads. Marketing bisa edit atau ubah status menjadi EXIT.

#### Q: Format file apa saja yang bisa diupload?
A: Dokumen: PDF, DOC, XLSX, JPG, PNG (max 10MB). Foto kunjungan: JPG, PNG, WEBP (max 5MB).

#### Q: Bisakah leads pindah cabang?
A: Ya, Super User dapat edit leads dan mengubah cabang assignment.

#### Q: Bagaimana sistem auto-scheduling bekerja?
A: Sistem otomatis jadwalkan follow up +3 hari setelah attempt terakhir. Bisa diubah manual.

### Advanced Features

#### Bulk Operations (Super User)
- **Bulk Import Leads**: Upload Excel dengan template khusus
- **Bulk Assign**: Assign multiple leads ke marketing tertentu
- **Bulk Status Update**: Ubah status multiple leads sekaligus
- **Bulk Export**: Export leads dengan filter advanced

#### Custom Reporting
- **Date Range Filters**: Filter laporan berdasarkan rentang tanggal
- **Multiple Dimensions**: Group by cabang, marketing, sumber leads
- **Conversion Funnel**: Analisa conversion rate per tahap
- **Performance Metrics**: Lead velocity, response time, closing rate

#### Integration Capabilities
- **WhatsApp Integration**: Link langsung ke WhatsApp dengan nomor leads
- **Google Maps**: Integrasi lokasi kunjungan dengan Google Maps
- **Calendar Sync**: Sinkronisasi jadwal follow up (future enhancement)
- **Email Notifications**: Notifikasi follow up via email (configurable)

#### Mobile Optimization
- **Responsive Design**: Optimal di semua device
- **Touch Friendly**: Button dan input sesuai mobile
- **Fast Loading**: Optimized untuk koneksi mobile
- **Offline Capability**: Basic functionality tanpa internet (future)

#### Data Analytics

##### Lead Sources Analysis
```
Facebook Ads    : 45% (Conversion rate: 12%)
Instagram       : 30% (Conversion rate: 18%)
Referral        : 15% (Conversion rate: 35%)
Website         : 10% (Conversion rate: 8%)
```

##### Follow Up Effectiveness
```
Stage dengan Conversion Tertinggi:
1. Survey          : 65% → Presentasi
2. Presentasi      : 45% → Form Pesanan  
3. Form Pesanan    : 80% → Invoice
4. Rekomendasi     : 35% → Survey
```

##### Marketing Performance Metrics
- **Lead Volume**: Jumlah leads baru per marketing
- **Conversion Rate**: Persentase WARM → CUSTOMER
- **Response Time**: Rata-rata waktu respon follow up
- **Deal Value**: Rata-rata nominal closing per marketing

### Tips Umum

#### Untuk Semua User
- **Backup Data**: Export laporan berkala sebagai backup
- **Mobile Friendly**: Aplikasi responsive, bisa digunakan di HP
- **Browser**: Gunakan Chrome/Firefox terbaru untuk performa optimal
- **Internet**: Pastikan koneksi stabil saat upload dokumen

#### Keamanan Data
- Logout setelah selesai bekerja
- Jangan share password dengan orang lain
- Update password secara berkala
- Laporkan jika ada akses yang mencurigakan

#### Troubleshooting

##### Problem: Website Lambat
**Symptoms**: Halaman loading lama, responsive lambat
**Solutions**:
1. Clear browser cache: Ctrl+Shift+Delete (Chrome/Firefox)
2. Disable extensions sementara
3. Coba browser different (Chrome recommended)
4. Check koneksi internet
5. Close tab lain yang tidak perlu
6. Restart browser

##### Problem: Error Upload File
**Symptoms**: "Upload failed", "File too large", "Invalid format"
**Solutions**:
1. Check ukuran file (max 10MB untuk dokumen, 5MB untuk foto)
2. Check format file (PDF, DOC, XLSX, JPG, PNG untuk dokumen)
3. Rename file jika ada karakter khusus
4. Compress file jika terlalu besar
5. Convert format jika tidak didukung
6. Try upload ulang setelah refresh

##### Problem: Login Gagal
**Symptoms**: "Invalid credentials", "Login failed"
**Solutions**:
1. Check caps lock status
2. Copy-paste password untuk avoid typo
3. Check email format (harus valid email)
4. Reset password jika perlu
5. Contact admin untuk reset account
6. Try different browser

##### Problem: Data Tidak Muncul
**Symptoms**: List kosong, dashboard blank, filter tidak work
**Solutions**:
1. Refresh halaman (F5 atau Ctrl+R)
2. Check filter yang aktif (reset filter)
3. Check cabang yang dipilih di dropdown
4. Logout dan login ulang
5. Check koneksi internet
6. Clear browser cache

##### Problem: Follow Up Tidak Terjadwal
**Symptoms**: Auto-schedule tidak work, follow up hilang
**Solutions**:
1. Check apakah follow up sudah di-complete
2. Manual schedule ulang jika perlu
3. Check maksimal attempts (3x per stage)
4. Refresh halaman follow up
5. Contact supervisor/admin

##### Problem: Dokumen Tidak Bisa Download
**Symptoms**: Error download, file corrupt
**Solutions**:
1. Check koneksi internet
2. Try download ulang
3. Try browser different
4. Check file masih exist (belum dihapus)
5. Contact admin jika masih error

##### Problem: Export Laporan Gagal
**Symptoms**: "Export failed", file kosong
**Solutions**:
1. Check date range filter (tidak terlalu luas)
2. Reduce data scope dengan filter
3. Try export format different (Excel vs PDF)
4. Refresh dan try again
5. Contact admin untuk large dataset

##### Problem: Notification Tidak Muncul
**Symptoms**: Reminder follow up tidak ada
**Solutions**:
1. Check browser notification settings
2. Allow notification untuk website
3. Check dashboard for manual check
4. Refresh dashboard
5. Contact admin untuk email notification setup

##### Problem: Mobile Display Issue
**Symptoms**: Layout rusak di mobile, button tidak bisa diklik
**Solutions**:
1. Use portrait orientation
2. Zoom level set ke 100%
3. Update browser mobile ke versi terbaru
4. Clear mobile browser cache
5. Use Chrome Mobile (recommended)
6. Avoid browser built-in (Samsung Internet, dll)

##### Problem: Session Expired Frequently
**Symptoms**: Sering logout otomatis, "Session expired"
**Solutions**:
1. Don't open multiple tabs dengan account sama
2. Avoid closing browser tab langsung
3. Use proper logout button
4. Check browser cookie settings
5. Contact admin untuk session timeout config

### Kontak Support

Jika mengalami kendala teknis atau butuh bantuan:
- **Admin Sistem**: Hubungi Super User perusahaan Anda
- **Pelatihan**: Minta sesi training tambahan jika perlu
- **Feedback**: Sampaikan saran perbaikan sistem ke admin

---

*Panduan ini dibuat untuk memastikan semua pengguna dapat menggunakan Leads Aladdin dengan optimal. Update panduan ini akan dilakukan berkala sesuai perkembangan fitur sistem.*

### Appendix

#### Shortcut Keyboard (Desktop)
- **Ctrl + /** : Buka search/filter
- **Ctrl + N** : Tambah leads baru (di halaman leads)
- **Ctrl + S** : Save form (saat edit)
- **Esc** : Close modal/dialog
- **Tab** : Navigate antar field
- **Enter** : Submit form

#### Status Icons Reference
- 🟢 **WARM**: Leads baru, belum follow up
- 🔥 **HOT**: Sudah ada minat, perlu presentasi
- ✅ **CUSTOMER**: Deal closed, sudah bayar
- ❌ **EXIT**: Tidak jadi, sudah konfirmasi
- 🧊 **COLD**: Tidak ada respon setelah 3x follow up
- 🔄 **CROSS_SELLING**: Existing customer, ada opportunity lain

#### Priority Indicators
- ⚡ **Fasttrack**: Urgent, high value
- 📝 **Normal**: Standard priority
- 📉 **Rendah**: Low priority, long term

#### Follow Up Stage Icons
- 👋 **Greeting**: Initial contact
- 💭 **Impresi**: First impression
- 💬 **Small Talk**: Building rapport  
- 💡 **Rekomendasi**: Product recommendation
- 📏 **Survei**: Site survey/measurement
- 📊 **Presentasi**: Proposal presentation
- 📋 **Form Pesanan**: Order form
- 🎯 **Up/Cross Selling**: Additional products
- 💰 **Invoice**: Payment processing
- 🏗️ **Pemasangan**: Installation confirmation

#### Color Coding
- **Hijau** (#2B5235): Primary brand color, success, active
- **Emas** (#DDBE75): Secondary color, warnings, pending
- **Merah**: Danger, errors, EXIT status
- **Biru**: Information, links, HOT status
- **Abu-abu**: Disabled, inactive, COLD status

#### Mobile Gestures
- **Swipe Left**: Quick actions (edit, delete)
- **Pull Down**: Refresh data
- **Long Press**: Context menu
- **Double Tap**: Quick view detail
- **Pinch**: Zoom (pada foto/dokumen)

#### Quick Reference Checklist

##### Daily Marketing Checklist
- [ ] Check dashboard untuk follow up hari ini
- [ ] Prioritas leads HOT dan Fasttrack
- [ ] Lakukan follow up sesuai jadwal  
- [ ] Update hasil follow up
- [ ] Schedule follow up berikutnya
- [ ] Upload dokumen jika ada
- [ ] Update status leads jika ada progress

##### Weekly Supervisor Checklist  
- [ ] Review performance marketing
- [ ] Analisa conversion rate per sumber leads
- [ ] Check follow up yang terlambat
- [ ] Export laporan mingguan
- [ ] Review leads yang stuck di satu stage
- [ ] Koordinasi dengan marketing untuk improvement

##### Monthly Super User Checklist
- [ ] Review dan update master data
- [ ] Analisa performance antar cabang
- [ ] Update konfigurasi follow up jika perlu
- [ ] Review user access dan permissions
- [ ] Backup data sistem
- [ ] Training untuk user baru
- [ ] System optimization dan maintenance

---

**📚 PANDUAN PENGGUNA LEADS ALADDIN**  
**Sistem Manajemen Leads untuk Industri Karpet**

**Versi: 2.0**  
**Terakhir Diperbarui: September 2025**  
**Total Halaman: 80+**

*Panduan komprehensif ini mencakup semua aspek penggunaan sistem dari basic operation hingga advanced features. Update akan dilakukan berkala sesuai perkembangan sistem.*
# Ini yang akan kita buat

## Ini adalah sistem manajemen leads bernama leads aladdin

### User Level

- Sistem ini memiliki 3 level pengguna, super-user, supervisor, marketing

#### Super User

- CRUD User
- CRUD Cabang
- CRUS Sumber leads
- Assign cabang supervisor dan marketing
- Melihat laporan antar user/cabang
- Akses ke semua cabang

#### Supervisor

- Melihat laporan
- Bisa memiliki 1 cabang atau lebih

##### Marketing

- Membuat leads
- Membuat follow-ups
- Membuat dokumen
- Hanya bisa memilki 1 cabang

### SK

- **WARM** Calon customer yang menghubungi untuk pertama kali
- **HOT** Sudah minta desain (smarttechno) / survey lokasi (Aladdin Karpet)
- **CUSTOMER** Memutuskan untuk membeli
- **EXIT** Memutuskan untuk tidak membeli
- **CROSS SELLING** testimoni dan penawaran produk lain
- **COLD** Customer tidak ada kejelasan setelah follow up 3 kali/ tidak ada nomer yg bisa dihubungi

### Alur

#### 1. Marketing membuat leads dengan status 'WARM','HOT','CUSTOMER','EXIT','COLD','CROSS_SELLING'

#### 2. Setelah lead dibuat marketing lalu melakukan follow ups yang prosesnya memliki tahapan yaitu

- Greeting
- Impresi
- Small Talk
- Rekomendasi
- Pengajuan Survei
- Presentasi
- Form Pemesanan
- Up / Cross Selling
- Invoice (Pembayaran)
- Konfirmasi Pemasangan

#### 3. Tahapan tidak harus urut bisa dilompati/skip misal Greeting lalu ke Rekomendasi

#### 4. Setiap tahapan memiliki maksimal 3x follow-ups. Jika sudah 3x tahapan dan tidak ada respon maka status leads berubah menjadi (COLD)

#### 5. Follow ups selanjutnya otomatis +3 hari (Bisa juga diatur sendiri) Misal

- Greeting: 1, 4,
- Impresi: 7, 10, 13
- Small Talk: 14
- Rekomendasi: 17, 20
- Pengajuan Survei: 23,
- Presentasi: 25,
- Form Pemesanan: 28, 29

**artinya:** Pada tahapan greeting dilakukan 2x follow ups yaitu tanggal 1 dan 4. Dan pada tanggal 7 Leads menunjukkan impresi, lalu marketing melakukan 3x follow-ups tanggal 7, 10 dan 13. dan seterusnya

#### 6. Jika pada follow ups membuahkan hasil (CUSTOMER) maka mengisi kolom alasan closing, jika tidak (EXIT) maka mengisi kolom alasan tidak closing

#### 7. Terdapat menu dokumen yang fungsinya uplaod file yang berelasi dengan leads

### Database

1. **User** default user +role
2. **Cabang** nama cabang, lokasi, alamat, no hp
3. **Sumber Leads** nama, deskripsi
4. **Tipe Karpet** nama, deskripsi
5. **Leads** Tgl Leads, Sapaan (Bapak/Ibu), Nama Pelanggan, No Whatsapp, Nama Masjid/Instansi, Sumber leads, Catatan, Alasan Closing, Alasan Tidak Closing, Prioritas (Fastrek, normal dan rendah), kebutuhan karpet (cth: 10x10 meter), Potensial nilai (rupiah), User/PIC, Tipe Karpet
6. **Follow ups** sesuikan aja
7. **Dokumen** Leads, judul, deskripsi, kategori, file, user/pic
8. Tabel-lain dan kolom lain sesuaikan saja dan mungkin bisa ditambahkan kolom *is_active*

### Catatan Klien tanpa edit

- followup yang di tampilkan total adalah jumlah status (list hari ini yang perlu di followup) / tgl , waktu,
- dalam dokumen (kategori) ada penawaran, sketsa survey (rumus excel)
- Format no hp 62
- catatan followup (check box) : terdapat list / no answer
- deskripsi leads dihilangkan,
- tampilan di buat responsif karena rata-rata user menggunakan HP,
- laporan bisa diexport pdf dan excel

### Catatan Tampilan

- Terdapat Menu seperti Combobox jika di shadcn untuk user ganti cabang aktif, letaknya dibawah sidebar dibawah logo dan sebelum list menu
- Jangan terlalu sering membuat informasi helper
- Card Info hanya ada di dashboard dan laporan
- Tampilan harus simple dan mudah di pahami
- warna utama #2B5235 secondary #DDBE75, hindari terlalu banyak memakai kombinasi warna
- Sidebar background warna putih, warna utama untuk button yang aktif
- List alasan closing (Promo, Survei, Bonus, Nawar, Rekomendasi, Repeat Order)
- List alasan tidak closing (Lokasi jauh, Barang yang dicari tidak ada, Harga, Jasa Pasang Aja, Tidak ada respon)
- Setiap List simpan di dalam config agar ketika ada perubahan jadi mudah
- Bahasa wajib pakai bahasa indonesia, kecuali tahap dan status leads samakan dengan yang diatas
- pakai date range untuk filter data
- ada shadcn, jadi jangan pakai `alert()` atau `confirm()` javascript

# Dokumen Persyaratan

## Pendahuluan

Expense & Budget Visualizer adalah aplikasi web single-page berbasis browser yang membantu pengguna mencatat, memantau, dan memvisualisasikan pengeluaran pribadi secara lokal. Aplikasi dibangun menggunakan HTML, CSS, dan Vanilla JavaScript tanpa backend. Semua data disimpan di `localStorage` browser sehingga bersifat single-user dan single-device. Aplikasi menyediakan fitur tambah transaksi, tampilan total balance, spending limit per item, hapus transaksi, pengurutan daftar, visualisasi pie chart pengeluaran per kategori, serta toggle dark/light mode.

---

## Glosarium

- **Aplikasi**: Expense & Budget Visualizer, aplikasi web single-page yang berjalan di browser.
- **Transaksi**: Satu catatan pengeluaran yang terdiri dari nama item, jumlah (dalam Rupiah), dan kategori.
- **Total Balance**: Akumulasi jumlah seluruh transaksi yang tersimpan.
- **Spending Limit**: Nilai ambang batas pengeluaran per item yang ditetapkan oleh pengguna.
- **Kategori**: Pengelompokan transaksi; terdiri dari tiga nilai tetap: `Food`, `Transport`, dan `Fun`.
- **localStorage**: Mekanisme penyimpanan data di browser pengguna, bersifat persisten dan tidak memerlukan backend.
- **Pie Chart**: Diagram lingkaran yang menampilkan proporsi pengeluaran per kategori, dirender menggunakan Chart.js 4.4.1.
- **Tema**: Skema tampilan aplikasi; bernilai `light` (terang) atau `dark` (gelap).
- **Item List**: Daftar tampilan seluruh transaksi yang tersimpan.
- **Pengguna**: Orang yang mengoperasikan Aplikasi melalui antarmuka browser.

---

## Persyaratan

### Persyaratan 1 — Tambah Transaksi

**User Story:** Sebagai pengguna, saya ingin menambahkan catatan pengeluaran dengan nama item, jumlah, dan kategori, sehingga saya dapat melacak setiap transaksi saya.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menyediakan formulir yang memuat kolom nama item (teks), kolom jumlah (angka), dan daftar pilihan kategori dengan nilai tetap `Food`, `Transport`, dan `Fun`.
2. WHEN pengguna mengirimkan formulir dengan seluruh kolom terisi valid, THE Aplikasi SHALL membuat objek transaksi baru yang berisi `id` unik, nama item, jumlah, kategori, dan stempel waktu pembuatan.
3. WHEN pengguna mengirimkan formulir dengan seluruh kolom terisi valid, THE Aplikasi SHALL menyimpan transaksi baru ke `localStorage` dan memperbarui tampilan Item List serta Total Balance tanpa memuat ulang halaman.
4. WHEN pengguna mengirimkan formulir dengan seluruh kolom terisi valid, THE Aplikasi SHALL mengosongkan semua kolom formulir setelah transaksi berhasil disimpan.
5. IF pengguna mengirimkan formulir dengan nama item kosong, THEN THE Aplikasi SHALL menampilkan pesan kesalahan pada elemen pesan kesalahan di dalam formulir dan membatalkan penyimpanan transaksi.
6. IF pengguna mengirimkan formulir dengan kolom jumlah kosong atau bernilai bukan angka positif, THEN THE Aplikasi SHALL menampilkan pesan kesalahan pada elemen pesan kesalahan di dalam formulir dan membatalkan penyimpanan transaksi.
7. IF pengguna mengirimkan formulir tanpa memilih kategori, THEN THE Aplikasi SHALL menampilkan pesan kesalahan pada elemen pesan kesalahan di dalam formulir dan membatalkan penyimpanan transaksi.

---

### Persyaratan 2 — Tampilan Total Balance

**User Story:** Sebagai pengguna, saya ingin melihat total akumulasi pengeluaran saya, sehingga saya mengetahui berapa total yang telah dikeluarkan.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan Total Balance sebagai penjumlahan seluruh nilai jumlah dari semua transaksi yang tersimpan, dalam format mata uang Rupiah (`Rp`).
2. WHEN transaksi baru ditambahkan, THE Aplikasi SHALL memperbarui tampilan Total Balance secara langsung tanpa memuat ulang halaman.
3. WHEN transaksi dihapus, THE Aplikasi SHALL memperbarui tampilan Total Balance secara langsung tanpa memuat ulang halaman.
4. WHILE tidak ada transaksi tersimpan, THE Aplikasi SHALL menampilkan Total Balance sebesar `Rp 0`.

---

### Persyaratan 3 — Spending Limit Per Item

**User Story:** Sebagai pengguna, saya ingin menetapkan batas pengeluaran per item, sehingga saya dapat dengan mudah mengidentifikasi transaksi yang melebihi batas tersebut.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menyediakan kolom input spending limit yang menerima nilai angka non-negatif.
2. WHEN pengguna mengisi kolom spending limit dengan angka valid lebih dari nol, THE Aplikasi SHALL menyimpan nilai spending limit ke `localStorage` dan memperbarui tampilan Item List secara langsung.
3. WHEN spending limit aktif (bernilai lebih dari nol) dan jumlah suatu transaksi melebihi nilai spending limit, THE Aplikasi SHALL menampilkan item transaksi tersebut dengan latar belakang merah dan warna teks jumlah merah sebagai penanda peringatan.
4. WHILE spending limit bernilai nol atau tidak diisi, THE Aplikasi SHALL menampilkan seluruh item transaksi tanpa penanda peringatan.
5. WHEN pengguna mengosongkan kolom spending limit, THE Aplikasi SHALL mengatur nilai spending limit menjadi nol, menyimpan perubahan ke `localStorage`, dan menghapus seluruh penanda peringatan dari Item List.

---

### Persyaratan 4 — Hapus Transaksi

**User Story:** Sebagai pengguna, saya ingin menghapus transaksi tertentu, sehingga saya dapat mengoreksi catatan yang salah.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan tombol hapus pada setiap item di Item List.
2. WHEN pengguna menekan tombol hapus pada suatu item, THE Aplikasi SHALL menghapus transaksi yang bersesuaian dari `localStorage` dan memperbarui tampilan Item List serta Total Balance secara langsung tanpa memuat ulang halaman.
3. WHEN seluruh transaksi telah dihapus, THE Aplikasi SHALL menampilkan pesan kosong pada area Item List yang menyatakan belum ada transaksi.

---

### Persyaratan 5 — Pengurutan Transaksi

**User Story:** Sebagai pengguna, saya ingin mengurutkan daftar transaksi dengan berbagai cara, sehingga saya dapat menemukan dan menganalisis transaksi dengan lebih mudah.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menyediakan kontrol pemilih urutan dengan empat opsi: terbaru (`newest`), jumlah tertinggi ke terendah (`amount-desc`), jumlah terendah ke tertinggi (`amount-asc`), dan berdasarkan kategori (`category`).
2. WHEN pengguna memilih opsi urutan `newest`, THE Aplikasi SHALL menampilkan transaksi diurutkan berdasarkan stempel waktu dari yang terbaru ke yang terlama.
3. WHEN pengguna memilih opsi urutan `amount-desc`, THE Aplikasi SHALL menampilkan transaksi diurutkan berdasarkan nilai jumlah dari yang terbesar ke yang terkecil.
4. WHEN pengguna memilih opsi urutan `amount-asc`, THE Aplikasi SHALL menampilkan transaksi diurutkan berdasarkan nilai jumlah dari yang terkecil ke yang terbesar.
5. WHEN pengguna memilih opsi urutan `category`, THE Aplikasi SHALL menampilkan transaksi diurutkan secara alfabet berdasarkan nama kategori.
6. WHEN transaksi baru ditambahkan atau dihapus, THE Aplikasi SHALL mempertahankan opsi urutan yang sedang aktif dan menampilkan ulang Item List sesuai urutan tersebut.

---

### Persyaratan 6 — Visualisasi Pie Chart Pengeluaran Per Kategori

**User Story:** Sebagai pengguna, saya ingin melihat proporsi pengeluaran saya per kategori dalam bentuk diagram, sehingga saya dapat memahami pola pengeluaran saya secara visual.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menampilkan Pie Chart yang merepresentasikan total pengeluaran per kategori (`Food`, `Transport`, `Fun`) menggunakan library Chart.js versi 4.4.1.
2. WHEN transaksi baru ditambahkan, THE Aplikasi SHALL memperbarui data Pie Chart secara langsung tanpa memuat ulang halaman.
3. WHEN transaksi dihapus, THE Aplikasi SHALL memperbarui data Pie Chart secara langsung tanpa memuat ulang halaman.
4. WHILE tidak ada transaksi tersimpan, THE Aplikasi SHALL menampilkan Pie Chart dalam kondisi kosong tanpa segmen data.
5. THE Aplikasi SHALL merender Pie Chart pada elemen `<canvas>` yang tersedia di dalam area visualisasi.

---

### Persyaratan 7 — Toggle Dark/Light Mode

**User Story:** Sebagai pengguna, saya ingin beralih antara tema terang dan gelap, sehingga tampilan aplikasi nyaman digunakan sesuai kondisi pencahayaan saya.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menyediakan tombol toggle tema yang menampilkan label `Dark mode` saat tema aktif adalah `light`, dan label `Light mode` saat tema aktif adalah `dark`.
2. WHEN pengguna menekan tombol toggle tema, THE Aplikasi SHALL menerapkan tema yang berlawanan secara langsung pada seluruh antarmuka tanpa memuat ulang halaman.
3. WHEN pengguna menekan tombol toggle tema, THE Aplikasi SHALL menyimpan nilai tema yang baru ke `localStorage`.
4. WHEN Aplikasi pertama kali dimuat, THE Aplikasi SHALL membaca preferensi tema dari `localStorage` dan menerapkannya; IF tidak ditemukan preferensi tema di `localStorage`, THEN THE Aplikasi SHALL menerapkan tema `light` sebagai nilai bawaan.

---

### Persyaratan 8 — Persistensi Data via localStorage

**User Story:** Sebagai pengguna, saya ingin data transaksi, spending limit, dan preferensi tema saya tetap tersedia setelah saya menutup atau memuat ulang browser, sehingga saya tidak kehilangan catatan pengeluaran saya.

#### Kriteria Penerimaan

1. THE Aplikasi SHALL menyimpan seluruh transaksi ke `localStorage` setiap kali transaksi ditambahkan atau dihapus.
2. THE Aplikasi SHALL menyimpan nilai spending limit ke `localStorage` setiap kali nilai spending limit diubah oleh pengguna.
3. THE Aplikasi SHALL menyimpan preferensi tema ke `localStorage` setiap kali pengguna mengganti tema.
4. WHEN Aplikasi pertama kali dimuat atau dimuat ulang, THE Aplikasi SHALL membaca dan memulihkan seluruh transaksi, nilai spending limit, dan preferensi tema dari `localStorage`.
5. WHILE `localStorage` tidak memuat data transaksi, THE Aplikasi SHALL menginisialisasi daftar transaksi sebagai larik kosong.
6. THE Aplikasi SHALL beroperasi sepenuhnya di sisi klien (browser) tanpa komunikasi ke server eksternal maupun sinkronisasi antar perangkat.

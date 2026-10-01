# Rencana Implementasi: Expense & Budget Visualizer

## Gambaran Umum

Kode aplikasi sudah ada (`index.html`, `css/style.css`, `js/script.js`). Tasks ini berfokus pada **verifikasi, validasi, dan penyempurnaan** kode yang ada agar sepenuhnya sesuai dengan requirements dan design — bukan implementasi dari nol.

Pendekatan: audit setiap komponen terhadap spesifikasi, perbaiki celah yang ditemukan, lalu tambahkan tes otomatis untuk memvalidasi properti kebenaran.

---

## Tasks

- [ ] 1. Audit dan penyempurnaan modul state & utilitas localStorage
  - [ ] 1.1 Verifikasi fungsi `save()` dan `load()` di `js/script.js`
    - Pastikan `save()` menggunakan `JSON.stringify` dan `load()` menggunakan `JSON.parse` dengan try-catch
    - Pastikan `load()` mengembalikan `fallback` bila parsing gagal atau key tidak ditemukan
    - Tambahkan penanganan `QuotaExceededError` pada `save()` jika belum ada
    - _Persyaratan: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  - [ ] 1.2 Verifikasi inisialisasi state saat halaman dimuat
    - Pastikan urutan inisialisasi: `transactions`, `limit`, `limitInput.value`, `setTheme()`, `render()` sudah benar
    - Pastikan `transactions` di-inisialisasi sebagai `[]` bila `localStorage` kosong
    - _Persyaratan: 8.4, 8.5_

- [ ] 2. Audit dan penyempurnaan komponen formulir tambah transaksi
  - [ ] 2.1 Verifikasi logika validasi formulir (`validateForm`)
    - Pastikan validasi nama item menolak string kosong dan string yang hanya berisi spasi (`trim() === ""`)
    - Pastikan validasi jumlah menolak nilai ≤ 0, NaN, dan string bukan angka
    - Pastikan validasi kategori menolak nilai kosong (`""`)
    - Pastikan pesan kesalahan muncul di elemen `#error` dan pengiriman formulir dibatalkan
    - _Persyaratan: 1.5, 1.6, 1.7_
  - [ ] 2.2 Verifikasi pembuatan objek transaksi (`addTransaction`)
    - Pastikan objek transaksi memiliki `id` unik (menggunakan `Date.now() + Math.random()`), `name`, `amount`, `category`, dan `createdAt`
    - Pastikan `amount` disimpan sebagai `number`, bukan string
    - Pastikan formulir dikosongkan setelah submit berhasil (`clearForm`)
    - _Persyaratan: 1.2, 1.3, 1.4_
  - [ ]* 2.3 Tulis property test untuk struktur objek transaksi
    - **Properti 1: Struktur objek transaksi yang valid**
    - **Memvalidasi: Persyaratan 1.2**
  - [ ]* 2.4 Tulis property test untuk penolakan nama tidak valid
    - **Properti 4: Penolakan input nama tidak valid**
    - **Memvalidasi: Persyaratan 1.5**
  - [ ]* 2.5 Tulis property test untuk penolakan jumlah tidak valid
    - **Properti 5: Penolakan jumlah tidak valid**
    - **Memvalidasi: Persyaratan 1.6**
  - [ ]* 2.6 Tulis property test untuk pengosongan formulir setelah submit valid
    - **Properti 3: Pengosongan formulir setelah submit valid**
    - **Memvalidasi: Persyaratan 1.4**

- [ ] 3. Checkpoint — Pastikan semua tes validasi formulir lulus
  - Pastikan semua tes lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 4. Audit dan penyempurnaan komponen Total Balance
  - [ ] 4.1 Verifikasi kalkulasi dan tampilan Total Balance
    - Pastikan Total Balance dihitung menggunakan `reduce` atas semua `amount` transaksi
    - Pastikan format tampilan menggunakan `Rp ${total.toLocaleString("id-ID")}`
    - Pastikan nilai `Rp 0` ditampilkan saat tidak ada transaksi
    - Pastikan `render()` / `renderList()` memperbarui balance setelah tambah atau hapus transaksi
    - _Persyaratan: 2.1, 2.2, 2.3, 2.4_
  - [ ]* 4.2 Tulis property test untuk keakuratan Total Balance
    - **Properti 6: Keakuratan Total Balance**
    - **Memvalidasi: Persyaratan 2.1, 2.2, 2.3, 2.4**

- [ ] 5. Audit dan penyempurnaan komponen Spending Limit
  - [ ] 5.1 Verifikasi logika spending limit
    - Pastikan event listener `input` pada `#limitInput` mengonversi nilai ke `Number` dan mengeset ke `0` bila kosong
    - Pastikan nilai disimpan ke `localStorage` setiap kali berubah
    - Pastikan kelas CSS `.over` ditambahkan ke item yang `amount > limit` saat `limit > 0`
    - Pastikan semua penanda `.over` dihapus saat `limit` menjadi `0`
    - _Persyaratan: 3.1, 3.2, 3.3, 3.4, 3.5_
  - [ ]* 5.2 Tulis property test untuk penanda peringatan spending limit
    - **Properti 8: Penanda peringatan spending limit**
    - **Memvalidasi: Persyaratan 3.3, 3.4, 3.5**
  - [ ]* 5.3 Tulis property test untuk round-trip persistensi spending limit
    - **Properti 7: Round-trip persistensi spending limit**
    - **Memvalidasi: Persyaratan 3.2, 8.2**

- [ ] 6. Audit dan penyempurnaan komponen hapus transaksi
  - [ ] 6.1 Verifikasi fungsi `deleteTransaction`
    - Pastikan fungsi menghapus transaksi berdasarkan `id` dari array `transactions`
    - Pastikan `localStorage` diperbarui setelah penghapusan
    - Pastikan `render()` dipanggil sehingga Item List dan Total Balance diperbarui segera
    - Pastikan pesan kosong (`#empty`) muncul bila tidak ada transaksi tersisa
    - Pastikan tombol hapus tersedia di setiap item list
    - _Persyaratan: 4.1, 4.2, 4.3_
  - [ ]* 6.2 Tulis property test untuk round-trip penghapusan transaksi
    - **Properti 9: Round-trip penghapusan transaksi**
    - **Memvalidasi: Persyaratan 4.2, 8.1**

- [ ] 7. Checkpoint — Pastikan semua tes mutasi data lulus
  - Pastikan semua tes lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [ ] 8. Audit dan penyempurnaan komponen pengurutan transaksi
  - [ ] 8.1 Verifikasi fungsi `sortTransactions`
    - Pastikan keempat opsi urutan tersedia di `#sort`: `newest`, `amount-desc`, `amount-asc`, `category`
    - Pastikan `newest` mengurutkan berdasarkan `createdAt` menurun (`b.createdAt - a.createdAt`)
    - Pastikan `amount-desc` mengurutkan berdasarkan `amount` menurun
    - Pastikan `amount-asc` mengurutkan berdasarkan `amount` menaik
    - Pastikan `category` mengurutkan secara alfabet menggunakan `localeCompare`
    - Pastikan fungsi mengembalikan **salinan** array (tidak mutasi array asli)
    - _Persyaratan: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ] 8.2 Verifikasi persistensi opsi urutan aktif saat data berubah
    - Pastikan opsi urutan yang sedang aktif di `#sort` tetap terpilih setelah tambah/hapus transaksi
    - Pastikan `renderList()` menggunakan nilai `sortEl.value` yang sedang aktif
    - _Persyaratan: 5.6_
  - [ ]* 8.3 Tulis property test untuk kebenaran pengurutan
    - **Properti 10: Kebenaran pengurutan**
    - **Memvalidasi: Persyaratan 5.2, 5.3, 5.4, 5.5**
  - [ ]* 8.4 Tulis property test untuk persistensi opsi urutan aktif
    - **Properti 11: Persistensi opsi urutan aktif**
    - **Memvalidasi: Persyaratan 5.6**

- [ ] 9. Audit dan penyempurnaan komponen Pie Chart
  - [ ] 9.1 Verifikasi fungsi `computeCategoryTotals` dan `buildChartData`
    - Pastikan `computeCategoryTotals` mengembalikan `{ Food, Transport, Fun }` dengan nilai `0` untuk kategori tanpa transaksi
    - Pastikan `buildChartData` menghasilkan objek data yang valid untuk Chart.js 4.4.1
    - _Persyaratan: 6.1, 6.4_
  - [ ] 9.2 Verifikasi strategi update chart (`renderChart`)
    - Pastikan instance `chartInstance` baru dibuat saat pertama kali (`chartInstance` belum ada)
    - Pastikan update selanjutnya menggunakan `chartInstance.data = ...` dan `chartInstance.update()` tanpa membuat ulang instance
    - Pastikan `renderChart` keluar lebih awal (`early return`) bila `<canvas id="chart">` tidak ditemukan
    - Pastikan chart diperbarui segera setelah tambah atau hapus transaksi
    - _Persyaratan: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]* 9.3 Tulis property test untuk keakuratan data Pie Chart per kategori
    - **Properti 12: Keakuratan data Pie Chart per kategori**
    - **Memvalidasi: Persyaratan 6.1, 6.2, 6.3, 6.4**

- [ ] 10. Audit dan penyempurnaan komponen toggle tema
  - [ ] 10.1 Verifikasi fungsi `setTheme`
    - Pastikan `data-theme` diterapkan pada elemen `<html>` (`document.documentElement`)
    - Pastikan label tombol `#themeToggle` bernilai `"Dark mode"` saat tema `light` dan `"Light mode"` saat tema `dark`
    - Pastikan tema disimpan ke `localStorage["theme"]` setiap kali berubah
    - _Persyaratan: 7.1, 7.2, 7.3_
  - [ ] 10.2 Verifikasi pemulihan tema saat halaman dimuat
    - Pastikan tema dibaca dari `localStorage` saat inisialisasi
    - Pastikan tema `light` diterapkan sebagai default bila tidak ada nilai di `localStorage`
    - _Persyaratan: 7.4_
  - [ ]* 10.3 Tulis property test untuk konsistensi label tombol tema
    - **Properti 13: Konsistensi label tombol tema**
    - **Memvalidasi: Persyaratan 7.1**
  - [ ]* 10.4 Tulis property test untuk round-trip toggle tema
    - **Properti 14: Round-trip toggle tema**
    - **Memvalidasi: Persyaratan 7.2, 7.3**

- [ ] 11. Audit dan penyempurnaan persistensi data & integrasi
  - [ ] 11.1 Verifikasi round-trip persistensi transaksi
    - Pastikan setiap tambah/hapus transaksi langsung menyimpan array terbaru ke `localStorage["transactions"]`
    - Pastikan `load("transactions", [])` mengembalikan array yang identik dengan yang tersimpan
    - _Persyaratan: 8.1, 8.4_
  - [ ] 11.2 Verifikasi pemulihan state penuh saat reload
    - Pastikan setelah reload, `transactions`, `limit`, dan tema aktif dipulihkan sesuai nilai `localStorage`
    - _Persyaratan: 8.4, 8.5_
  - [ ] 11.3 Verifikasi tidak ada komunikasi ke server eksternal
    - Pastikan tidak ada `fetch`, `XMLHttpRequest`, atau koneksi jaringan dalam kode `js/script.js`
    - _Persyaratan: 8.6_
  - [ ]* 11.4 Tulis property test untuk round-trip persistensi transaksi
    - **Properti 2: Round-trip persistensi transaksi**
    - **Memvalidasi: Persyaratan 1.3, 8.1, 8.4**
  - [ ]* 11.5 Tulis property test untuk pemulihan state penuh dari localStorage
    - **Properti 15: Pemulihan state penuh dari localStorage**
    - **Memvalidasi: Persyaratan 8.4, 8.5**

- [ ] 12. Checkpoint akhir — Semua tes lulus dan kode siap
  - Pastikan semua tes lulus, tanyakan kepada pengguna jika ada pertanyaan.

---

## Catatan

- Tasks yang ditandai `*` bersifat opsional dan dapat dilewati untuk penyelesaian lebih cepat
- Setiap task merujuk pada persyaratan spesifik untuk keterlacakan
- Karena ini adalah proyek Vanilla JS tanpa build tool, property test dapat ditulis menggunakan `fast-check` via CDN atau sebagai skrip Node.js terpisah
- Kode yang sudah ada di `js/script.js` mungkin belum lengkap — verifikasi setiap fungsi terhadap spesifikasi sebelum menandai task sebagai selesai
- Checkpoint memastikan validasi bertahap pada setiap kelompok fitur

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "4.1", "5.1", "6.1", "8.1", "9.1", "10.1"] },
    { "id": 2, "tasks": ["2.3", "2.4", "2.5", "2.6", "4.2", "5.2", "5.3", "6.2", "8.3", "9.3", "10.3"] },
    { "id": 3, "tasks": ["8.2", "9.2", "10.2"] },
    { "id": 4, "tasks": ["8.4", "10.4"] },
    { "id": 5, "tasks": ["11.1", "11.2", "11.3"] },
    { "id": 6, "tasks": ["11.4", "11.5"] }
  ]
}
```

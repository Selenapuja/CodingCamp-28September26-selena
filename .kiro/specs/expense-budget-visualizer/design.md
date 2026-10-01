# Dokumen Desain

## Expense & Budget Visualizer

---

## Gambaran Umum

Expense & Budget Visualizer adalah aplikasi web single-page (SPA) yang berjalan sepenuhnya di browser tanpa backend. Arsitektur dibangun di atas tiga lapisan yang saling terpisah: **Penyimpanan** (`localStorage`), **Logika Bisnis** (fungsi-fungsi JavaScript murni), dan **Antarmuka Pengguna** (manipulasi DOM + Chart.js). Pembaruan UI dilakukan dengan pendekatan *render-on-mutate*: setiap kali data berubah, fungsi `render()` utama dipanggil untuk menyinkronkan seluruh tampilan dengan state terbaru.

---

## Arsitektur

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (Client Only)                  │
│                                                         │
│  ┌──────────────┐   ┌──────────────────────────────┐   │
│  │   index.html │   │         js/script.js          │   │
│  │  (Struktur)  │   │                              │   │
│  │  css/style   │   │  State Management            │   │
│  │  (Tampilan)  │   │  ├─ transactions[]           │   │
│  └──────────────┘   │  ├─ limit (number)           │   │
│                     │  │                           │   │
│                     │  Business Logic              │   │
│                     │  ├─ addTransaction()         │   │
│                     │  ├─ deleteTransaction()      │   │
│                     │  ├─ validateForm()           │   │
│                     │  ├─ sortTransactions()       │   │
│                     │  └─ computeCategoryTotals()  │   │
│                     │                              │   │
│                     │  UI Layer                    │   │
│                     │  ├─ render()                 │   │
│                     │  ├─ renderList()             │   │
│                     │  ├─ renderChart()            │   │
│                     │  └─ setTheme()               │   │
│                     └──────────────────────────────┘   │
│                                                         │
│  ┌──────────────────┐   ┌──────────────────────────┐   │
│  │   Chart.js 4.4.1 │   │       localStorage        │   │
│  │   (CDN External) │   │  ├─ "transactions" (JSON) │   │
│  └──────────────────┘   │  ├─ "limit" (number)     │   │
│                         │  └─ "theme" (string)     │   │
│                         └──────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Prinsip arsitektur utama:**

- **Tidak ada backend** — semua data disimpan di `localStorage` browser.
- **Single source of truth** — variabel modul `transactions[]` dan `limit` merupakan state utama; `localStorage` adalah persistensi sekunder yang selalu disinkronkan.
- **Render-on-mutate** — setiap fungsi yang mengubah data memanggil `render()` atau `renderList()` setelahnya.
- **No framework** — manipulasi DOM langsung menggunakan Vanilla JS; tidak ada reaktivitas framework.

---

## Komponen

### 1. Modul State

Variabel modul yang menjadi state utama aplikasi:

| Variabel | Tipe | Kunci localStorage | Deskripsi |
|---|---|---|---|
| `transactions` | `Transaction[]` | `"transactions"` | Larik semua transaksi tersimpan |
| `limit` | `number` | `"limit"` | Spending limit per item; `0` berarti tidak aktif |

State dibaca dari `localStorage` saat skrip pertama kali dieksekusi (inisialisasi modul).

---

### 2. Komponen Formulir Tambah Transaksi

**Elemen DOM:**

| ID Elemen | Tipe | Fungsi |
|---|---|---|
| `#txForm` | `<form>` | Kontainer formulir |
| `#name` | `<input type="text">` | Input nama item |
| `#amount` | `<input type="number">` | Input jumlah (Rupiah) |
| `#category` | `<select>` | Pilihan kategori |
| `#error` | `<p role="alert">` | Area pesan kesalahan |

**Alur kerja:**

```
submit event
    │
    ▼
validateForm()
    │
    ├─ gagal → tampilkan pesan kesalahan di #error → STOP
    │
    └─ sukses → buat objek Transaction baru
                │
                ▼
           transactions.push(tx)
                │
                ▼
           save("transactions", transactions)
                │
                ▼
           clearForm()
                │
                ▼
           render()
```

---

### 3. Komponen Item List

**Elemen DOM:**

| ID Elemen | Tipe | Fungsi |
|---|---|---|
| `#list` | `<ul>` | Wadah daftar transaksi |
| `#empty` | `<p>` | Pesan "belum ada transaksi" |
| `#sort` | `<select>` | Kontrol pemilih urutan |

**Opsi urutan:**

| Nilai | Label | Logika Pengurutan |
|---|---|---|
| `newest` | Terbaru | `b.createdAt - a.createdAt` (menurun) |
| `amount-desc` | Jumlah: tinggi ke rendah | `b.amount - a.amount` (menurun) |
| `amount-asc` | Jumlah: rendah ke tinggi | `a.amount - b.amount` (menaik) |
| `category` | Kategori | `a.category.localeCompare(b.category)` (alfabet) |

Setiap item yang dirender menggunakan `limit > 0 && tx.amount > limit` untuk menentukan apakah kelas CSS `.over` ditambahkan.

---

### 4. Komponen Total Balance

**Elemen DOM:** `#totalBalance`

Dihitung sebagai:

```javascript
const total = transactions.reduce((sum, t) => sum + t.amount, 0);
```

Ditampilkan dalam format Rupiah:

```javascript
`Rp ${total.toLocaleString("id-ID")}`
```

---

### 5. Komponen Spending Limit

**Elemen DOM:** `#limitInput`

- Menerima event `input` secara real-time.
- Nilai dikonversi ke `Number`; bila gagal atau kosong, diset ke `0`.
- Nilai `0` menonaktifkan fitur penanda peringatan.
- Disimpan ke `localStorage` di setiap perubahan.

---

### 6. Komponen Pie Chart

Menggunakan **Chart.js 4.4.1** (dimuat via CDN). Instance chart disimpan dalam variabel `chartInstance`.

**Strategi update:**

```javascript
// Pertama kali: buat instance baru
chartInstance = new Chart(ctx, { type: "pie", data: buildChartData() });

// Selanjutnya: update data tanpa membuat ulang instance
chartInstance.data = buildChartData();
chartInstance.update();
```

**Fungsi agregasi:**

```javascript
function computeCategoryTotals(transactions) {
  // Mengembalikan { Food: number, Transport: number, Fun: number }
}
```

Kategori yang memiliki total `0` tetap disertakan dalam data chart dengan nilai `0`.

---

### 7. Komponen Toggle Tema

**Elemen DOM:** `#themeToggle`

**Mekanisme:**

- Tema diterapkan via atribut `data-theme` pada elemen `<html>`.
- CSS custom properties (variabel) pada `:root` dan `[data-theme="dark"]` mengontrol seluruh warna.
- Label tombol: `"Dark mode"` saat tema `light`, `"Light mode"` saat tema `dark`.
- Preferensi tersimpan di `localStorage["theme"]`.

---

## Antarmuka & Model Data

### Model `Transaction`

```javascript
/**
 * @typedef {Object} Transaction
 * @property {string} id          - ID unik, dibuat dengan Date.now() + Math.random()
 * @property {string} name        - Nama item pengeluaran
 * @property {number} amount      - Jumlah dalam Rupiah (bilangan positif)
 * @property {string} category    - Salah satu dari: "Food" | "Transport" | "Fun"
 * @property {number} createdAt   - Unix timestamp (ms) saat transaksi dibuat
 */
```

**Contoh objek:**

```javascript
{
  id: "1717000000000-0.4827",
  name: "Nasi goreng",
  amount: 25000,
  category: "Food",
  createdAt: 1717000000000
}
```

---

### Antarmuka Fungsi Utama

```javascript
// Utilitas localStorage
function save(key, value)           // JSON.stringify lalu simpan ke localStorage
function load(key, fallback)        // JSON.parse dari localStorage; kembalikan fallback bila gagal

// Validasi
function validateForm()             // Kembalikan string pesan kesalahan atau "" bila valid

// Mutasi state
function addTransaction(event)      // Handler submit formulir
function deleteTransaction(id)      // Hapus transaksi berdasarkan id

// Pengurutan
function sortTransactions(arr, mode) // Kembalikan salinan larik yang sudah diurutkan

// Kalkulasi
function computeCategoryTotals(txs)  // Kembalikan { Food, Transport, Fun }
function buildChartData()            // Kembalikan objek data Chart.js

// Render
function render()                   // Render ulang seluruh UI (list + chart + balance)
function renderList()               // Render ulang hanya list (digunakan saat sort/limit berubah)
function renderChart()              // Update atau buat instance Chart.js
function clearForm()                // Kosongkan semua kolom formulir

// Tema
function setTheme(theme)            // Terapkan tema dan simpan ke localStorage
```

---

## Penanganan Error

### Validasi Formulir

Validasi dilakukan secara klien saja (tidak ada server). Urutan pemeriksaan:

1. **Nama item kosong** — `name.trim() === ""`  
   → Pesan: `"Nama item tidak boleh kosong."`

2. **Jumlah tidak valid** — `isNaN(amount) || amount <= 0`  
   → Pesan: `"Masukkan jumlah yang valid (angka positif)."`

3. **Kategori tidak dipilih** — `category === ""`  
   → Pesan: `"Pilih kategori terlebih dahulu."`

Bila ada kesalahan, pesan ditampilkan pada elemen `#error` dan `event.preventDefault()` dipanggil untuk membatalkan pengiriman formulir.

### Error localStorage

Operasi `localStorage` dibungkus dengan try-catch untuk menangani kondisi:

- Storage penuh (`QuotaExceededError`)
- Mode privat browser yang menonaktifkan `localStorage`

Bila `load()` gagal, nilai `fallback` digunakan sehingga aplikasi tetap berfungsi tanpa data persisten.

### Error Chart.js

Bila `<canvas id="chart">` tidak ditemukan di DOM, `renderChart()` keluar lebih awal (`early return`) tanpa melempar exception.

---

## Alur Inisialisasi

Saat halaman pertama kali dimuat (`script.js` dieksekusi):

```
1. transactions = load("transactions", [])
2. limit        = load("limit", 0)
3. limitInput.value = limit > 0 ? limit : ""
4. setTheme(load("theme", "light"))
5. render()
```

Urutan ini memastikan state dipulihkan dari `localStorage` sebelum UI dirender untuk pertama kalinya.

---

## Tata Letak UI

```
┌────────────────────────────────────────────────┐
│  Header: Judul + Tombol Toggle Tema            │
├────────────────────────────────────────────────┤
│  Card: Total Balance + Input Spending Limit    │
├────────────────────────────────────────────────┤
│  Card: Formulir Tambah Transaksi               │
├──────────────────────┬─────────────────────────┤
│  Card: Item List     │  Card: Pie Chart        │
│  (dengan sort)       │  (Chart.js)             │
└──────────────────────┴─────────────────────────┘
```

Layout responsif: satu kolom pada lebar < 720px, dua kolom pada lebar ≥ 720px (menggunakan CSS Grid).

---

## Properti Kebenaran (Correctness Properties)

*Sebuah properti adalah karakteristik atau perilaku yang harus berlaku benar di seluruh eksekusi sistem yang valid — pada dasarnya, pernyataan formal tentang apa yang seharusnya dilakukan sistem. Properti berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi oleh mesin.*

---

### Properti 1: Struktur objek transaksi yang valid

*Untuk setiap* kombinasi nama item (string non-kosong), jumlah (angka positif), dan kategori valid (`Food`, `Transport`, `Fun`) yang dikirimkan melalui formulir, objek transaksi yang dihasilkan harus memiliki `id` (string unik), `name`, `amount`, `category`, dan `createdAt` (number).

**Memvalidasi: Persyaratan 1.2**

---

### Properti 2: Round-trip persistensi transaksi

*Untuk setiap* transaksi yang berhasil ditambahkan ke daftar, membaca `localStorage["transactions"]` dan mem-parse JSON-nya harus menghasilkan larik yang mengandung transaksi tersebut dengan nilai yang sama persis.

**Memvalidasi: Persyaratan 1.3, 8.1, 8.4**

---

### Properti 3: Pengosongan formulir setelah submit valid

*Untuk setiap* pengiriman formulir yang berhasil (input valid), semua kolom formulir (`#name`, `#amount`, `#category`) harus bernilai kosong/default setelah transaksi ditambahkan.

**Memvalidasi: Persyaratan 1.4**

---

### Properti 4: Penolakan input nama tidak valid

*Untuk setiap* string yang terdiri seluruhnya dari spasi putih (whitespace) atau string kosong yang dimasukkan sebagai nama item, formulir harus ditolak, pesan kesalahan ditampilkan, dan panjang daftar transaksi tidak berubah.

**Memvalidasi: Persyaratan 1.5**

---

### Properti 5: Penolakan jumlah tidak valid

*Untuk setiap* nilai yang bukan angka positif (termasuk `0`, angka negatif, atau teks) yang dimasukkan sebagai jumlah, formulir harus ditolak, pesan kesalahan ditampilkan, dan panjang daftar transaksi tidak berubah.

**Memvalidasi: Persyaratan 1.6**

---

### Properti 6: Keakuratan Total Balance

*Untuk setiap* daftar transaksi (termasuk daftar kosong), nilai Total Balance yang ditampilkan harus sama persis dengan hasil penjumlahan semua `amount` dalam daftar tersebut.

**Memvalidasi: Persyaratan 2.1, 2.2, 2.3, 2.4**

---

### Properti 7: Round-trip persistensi spending limit

*Untuk setiap* nilai angka non-negatif yang dimasukkan ke kolom spending limit, membaca `localStorage["limit"]` setelahnya harus mengembalikan nilai yang sama.

**Memvalidasi: Persyaratan 3.2, 8.2**

---

### Properti 8: Penanda peringatan spending limit

*Untuk setiap* transaksi dan setiap nilai spending limit aktif (> 0), item transaksi tersebut harus memiliki kelas CSS `.over` jika dan hanya jika `amount > limit`.

**Memvalidasi: Persyaratan 3.3, 3.4, 3.5**

---

### Properti 9: Round-trip penghapusan transaksi

*Untuk setiap* transaksi yang ada dalam daftar, setelah tombol hapusnya ditekan, transaksi tersebut tidak boleh lagi ada di `localStorage["transactions"]` maupun di Item List yang ditampilkan.

**Memvalidasi: Persyaratan 4.2, 8.1**

---

### Properti 10: Kebenaran pengurutan

*Untuk setiap* daftar transaksi dan setiap opsi urutan yang dipilih (`newest`, `amount-desc`, `amount-asc`, `category`), setiap pasangan item yang berdekatan dalam hasil tampilan harus memenuhi relasi urutan yang sesuai (tidak ada elemen yang "salah posisi").

**Memvalidasi: Persyaratan 5.2, 5.3, 5.4, 5.5**

---

### Properti 11: Persistensi opsi urutan aktif

*Untuk setiap* opsi urutan yang sedang aktif, menambahkan atau menghapus transaksi tidak boleh mengubah opsi urutan yang terpilih; daftar harus dirender ulang menggunakan opsi yang sama.

**Memvalidasi: Persyaratan 5.6**

---

### Properti 12: Keakuratan data Pie Chart per kategori

*Untuk setiap* daftar transaksi, nilai data yang dikirimkan ke Chart.js untuk setiap kategori harus sama persis dengan jumlah `amount` semua transaksi dalam kategori tersebut.

**Memvalidasi: Persyaratan 6.1, 6.2, 6.3, 6.4**

---

### Properti 13: Konsistensi label tombol tema

*Untuk setiap* nilai tema aktif, label tombol toggle harus bernilai `"Dark mode"` bila tema adalah `light`, dan `"Light mode"` bila tema adalah `dark`.

**Memvalidasi: Persyaratan 7.1**

---

### Properti 14: Round-trip toggle tema

*Untuk setiap* keadaan tema awal, menekan tombol toggle dua kali berturut-turut harus mengembalikan tema ke keadaan semula, termasuk nilai yang tersimpan di `localStorage["theme"]`.

**Memvalidasi: Persyaratan 7.2, 7.3**

---

### Properti 15: Pemulihan state penuh dari localStorage

*Untuk setiap* kombinasi data yang tersimpan di `localStorage` (transaksi, limit, tema), memuat ulang aplikasi harus menghasilkan state `transactions`, `limit`, dan tema aktif yang identik dengan yang tersimpan sebelumnya.

**Memvalidasi: Persyaratan 8.4, 8.5**

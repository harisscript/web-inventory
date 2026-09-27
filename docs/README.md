# Web Inventory — Dokumentasi Aplikasi

> Aplikasi Web PWA untuk monitoring inventaris bahan baku (ingredients) pada bisnis multi-restaurant.

---

## 1. Konteks Bisnis

**Pemilik**: Pebisnis restaurant dengan **> 1 cabang restaurant**.

**POS**: Tiap restaurant sudah memakai **Moka POS** untuk transaksi penjualan menu.

**Masalah yang diselesaikan**:

- Setiap menu di POS punya resep (ingredients + jumlah). Contoh:
  - **Bakso Urat**: Daging 15g · Telur 1 · Tepung 15g · Garam 5g · Mie 10g · Kaldu 1 pcs
  - **Bakso Keju**: Daging 5g · Telur 1 · Tepung 15g · Garam 5g · Mie 10g · Kaldu 1 pcs · Keju 5g
- Owner ingin tahu **stok bahan baku terkini** tanpa harus bertanya ke tiap cabang.
- Stok bahan **otomatis berkurang** setiap ada penjualan menu (dari sinkronisasi POS).
- Stok bahan **bertambah** setiap ada pembelian ke supplier.
- Semua perubahan stok tercatat di **history/audit log** untuk audit & analitik.

---

## 2. MVP Scope

Minimum Viable Product fokus pada 3 kemampuan inti:

| #   | Capability                                      | Modul yang terlibat                 |
| --- | ----------------------------------------------- | ----------------------------------- |
| 1   | Definisi master data bahan + resep per menu     | Master Data                         |
| 2   | Tracking perubahan stok (in / out / adjustment) | Operasional                         |
| 3   | Audit log / history pergerakan stok             | Mutasi Stok (operasional) + Laporan |

Di luar MVP (future): notifikasi real-time (WA/email), purchase order otomatis, integrasi langsung API Moka, multi-warehouse, transfer antar cabang.

---

## 3. Struktur Menu Sidebar

Aplikasi punya **4 section** di sidebar:

| Section     | Warna accent     | Fokus                     |
| ----------- | ---------------- | ------------------------- |
| Main        | Primary (indigo) | Halaman utama & ringkasan |
| Master Data | Amber            | Referensi, jarang diubah  |
| Operasional | Emerald          | Pekerjaan harian          |
| Laporan     | Sky              | Analytics, read-only      |

---

### 3.1 Main

#### Dashboard

- **Fungsi**: Halaman utama / ringkasan kondisi inventoris saat ini.
- **Isi**: total nilai inventaris, jumlah item low stock, top 5 bahan paling banyak dipakai, grafik pergerakan stok 7 hari terakhir.
- **Akses cepat**: klik card peringatan → redirect ke halaman Peringatan Stok.

---

### 3.2 Master Data (referensi)

#### Bahan (Ingredients)

- **Fungsi**: Master data seluruh bahan baku yang dipakai di semua menu.
- **Field**: nama, satuan (gram / pcs / liter / ml), kategori (daging / sayur / bumbu / dll), harga per satuan, stok minimum (alert threshold), supplier default.
- **Contoh entri**:
  - Daging — satuan `gram`, kategori `Protein`, harga Rp 120/gr, min 500g
  - Telur — satuan `butir`, kategori `Protein`, harga Rp 1.800/butir, min 12 butir
  - Tepung — satuan `gram`, kategori `Tepung`, harga Rp 12/gr, min 1.000g
  - Garam — satuan `gram`, kategori `Bumbu`, harga Rp 2/gr, min 200g
  - Mie — satuan `gram`, kategori `Karbohidrat`, harga Rp 15/gr, min 500g
  - Kaldu — satuan `pcs`, kategori `Bumbu`, harga Rp 800/pcs, min 20 pcs
  - Keju — satuan `gram`, kategori `Dairy`, harga Rp 90/gr, min 200g

#### Resep Menu (Recipes)

- **Fungsi**: Mapping menu POS ↔ daftar bahan + jumlah per 1 porsi.
- **Field**: nama menu POS, daftar baris (bahan + qty per porsi), catatan.
- **Contoh entri**:
  - Bakso Urat → Daging 15g · Telur 1 · Tepung 15g · Garam 5g · Mie 10g · Kaldu 1 pcs
  - Bakso Keju → Daging 5g · Telur 1 · Tepung 15g · Garam 5g · Mie 10g · Kaldu 1 pcs · Keju 5g
- **Penting**: resep jadi acuan sistem untuk **auto-deduct stok** saat ada penjualan POS. Kalau menu belum punya resep, penjualan menu tsb TIDAK akan mengurangi stok bahan.

#### Supplier

- **Fungsi**: Master data vendor/supplier bahan baku.
- **Field**: nama supplier, kontak (HP/email), alamat, daftar bahan yang biasa di-supply, termin pembayaran (COD / tempo 7 hari / tempo 14 hari / dll).
- **Relasi**: 1 supplier bisa supply banyak bahan; 1 bahan bisa punya multiple supplier (harga & lead time bisa beda).

---

### 3.3 Operasional (pekerjaan harian)

#### Stok Bahan (Stock Overview)

- **Fungsi**: Monitoring stok terkini seluruh bahan baku.
- **Tampilan**: daftar bahan · satuan · qty saat ini · nilai (qty × harga satuan) · status (`aman` / `rendah` / `kosong`) · restoran (jika multi-restaurant).
- **Filter**: per restoran, per kategori, per status.
- **Update real-time**: stok berubah otomatis dari penjualan POS (out) & pembelian (in).

#### Stok Opname

- **Fungsi**: Hitung fisik stok secara periodik (harian/mingguan/bulanan) untuk rekonsiliasi.
- **Workflow**:
  1. Pilih tanggal opname & restoran.
  2. Input hasil hitung fisik (qty aktual di rak/gudang).
  3. Sistem hitung selisih = qty sistem − qty fisik.
  4. Selisih otomatis tercatat di Mutasi Stok sebagai **adjustment** (bertanda "Opname").
- **Tujuan**: menemukan barang hilang, rusak tidak tercatat, atau selisih input.

#### Mutasi Stok (Stock Movement)

- **Fungsi**: Catatan SEMUA pergerakan stok — satu-satunya sumber kebenaran histori.
- **Tipe mutasi**:
  | Tipe       | Sumber                             | Arah   | Trigger                        |
  | ---------- | ---------------------------------- | ------ | ------------------------------ |
  | Penjualan  | Sinkronisasi POS                   | Out    | Auto, tiap transaksi menu      |
  | Pembelian  | Modul Pembelian (status: received) | In     | Manual, saat barang diterima   |
  | Adjustment | Stok Opname                        | In/Out | Manual, dari hasil opname      |
  | Waste      | Modul Pembuangan                   | Out    | Manual, saat bahan busuk/rusak |
  | Transfer   | Modul Transfer (future)            | In/Out | Manual, pindah antar restoran  |
- **Field**: tanggal, bahan, qty, tipe, referensi (no. PO / no. opname / no. POS order), user input, catatan.
- **Filter**: per rentang tanggal, per bahan, per tipe, per restoran.

#### Pembuangan (Waste)

- **Fungsi**: Track bahan baku yang terbuang (basi, kadaluwarsa, jatuh, dll).
- **Field**: bahan, qty, alasan (basi/kedaluwarsa/rusak/hilang), foto bukti (optional), tanggal, penanggung jawab.
- **Efek**: otomatis mengurangi stok + tercatat di Mutasi Stok bertipe "Waste".

#### Pembelian (Purchase Orders)

- **Fungsi**: Catat pembelian bahan baku ke supplier.
- **Workflow**:
  1. Buat PO: pilih supplier → input item & qty → set harga.
  2. Status PO: `Draft` → `Ordered` (sudah dikirim ke supplier) → `Received` (barang sudah datang).
  3. Saat status berubah ke `Received` → stok bahan otomatis bertambah + tercatat di Mutasi Stok bertipe "Pembelian".
- **Output**: histori harga beli per bahan (berguna untuk hitung HPP akurat).

---

### 3.4 Laporan (analytics, read-only)

#### Laporan Stok

- **Fungsi**: Snapshot stok terkini + valuasi nilai inventaris.
- **Hitung**: total qty × harga satuan terakhir (dari PO terakhir) → nilai inventaris.
- **Filter**: per restoran, per kategori bahan, per supplier.
- **Export**: CSV / PDF (future).

#### Laporan Penggunaan

- **Fungsi**: Track konsumsi bahan dalam periode waktu.
- **2 view**:
  - **Per bahan**: qty bahan terpakai, nilai pemakaian (qty × harga).
  - **Per menu**: menu mana yang paling banyak terjual → bahan apa yang paling tertekan stoknya.
- **Penggunaan**: identifikasi bahan fast-moving untuk optimasi stok minimum & forecast pembelian.

#### HPP Menu (Recipe Costing)

- **Fungsi**: Hitung **Harga Pokok Penjualan** per menu POS.
- **Formula**:
  ```
  HPP(Menu) = Σ (qty_bahan_per_porsi × harga_satuan_bahan)
  ```
- **Contoh hitung Bakso Urat**:
  | Bahan         | Qty/porsi | Harga satuan | Subtotal     |
  | ------------- | --------- | ------------ | ------------ |
  | Daging        | 15g       | Rp 120/gr    | Rp 1.800     |
  | Telur         | 1         | Rp 1.800     | Rp 1.800     |
  | Tepung        | 15g       | Rp 12/gr     | Rp 180       |
  | Garam         | 5g        | Rp 2/gr      | Rp 10        |
  | Mie           | 10g       | Rp 15/gr     | Rp 150       |
  | Kaldu         | 1 pcs     | Rp 800/pcs   | Rp 800       |
  | **Total HPP** |           |              | **Rp 4.740** |
- **Use case**: bantu tentukan harga jual menu yang sehat (markup min. 30% dari HPP).

#### Peringatan Stok (Low Stock Alerts)

- **Fungsi**: List bahan yang stoknya turun di bawah **stok minimum** yang didefinisikan di Master Data Bahan.
- **Tampilan**: nama bahan · qty saat ini · min stok · selisih · restoran · status urgent.
- **Aksi**: dari sini bisa langsung trigger "Buat PO" ke supplier default bahan tsb (future).
- **Notifikasi**: badge counter di sidebar (future: WA blast ke manager).

---

## 4. Alur Data (Data Flow)

```
┌──────────────────┐
│   POS Moka       │ (penjualan menu)
└────────┬─────────┘
         │ sinkronisasi transaksi
         ▼
┌──────────────────┐
│ Sistem: cari     │
│ resep menu POS   │
└────────┬─────────┘
         │ untuk tiap bahan di resep
         ▼
┌──────────────────────────────────────────┐
│ AUTO-DEDUCT: kurangi qty stok bahan      │
│ Catat ke Mutasi Stok (tipe: Penjualan,   │
│ ref: no. order POS)                       │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────┐    ┌──────────────────┐
│ Stok Bahan: -qty │    │ Mutasi Stok      │
│ (real-time)      │    │ (history log)    │
└──────────────────┘    └──────────────────┘

┌──────────────────┐
│ Pembelian        │ (status: Received)
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ AUTO-INCREMENT: tambah qty stok bahan    │
│ Catat ke Mutasi Stok (tipe: Pembelian,   │
│ ref: no. PO, harga beli)                  │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────┐    ┌──────────────────┐
│ Stok Bahan: +qty │    │ Mutasi Stok      │
│ (real-time)      │    │ (history log)    │
└──────────────────┘    └──────────────────┘

┌──────────────────┐
│ Stok Opname      │ (hasil hitung fisik)
└────────┬─────────┘
         │ qty fisik < qty sistem
         ▼
┌──────────────────────────────────────────┐
│ ADJUSTMENT: hitung selisih               │
│ Catat ke Mutasi Stok (tipe: Adjustment,  │
│ ref: no. opname)                          │
└──────────────────────────────────────────┘

┌──────────────────┐
│ Pembuangan       │ (bahan basi/rusak)
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ WASTE: kurangi qty stok bahan            │
│ Catat ke Mutasi Stok (tipe: Waste,       │
│ ref: no. waste, alasan)                   │
└──────────────────────────────────────────┘
```

**Prinsip utama**: SEMUA perubahan stok (dari sumber apapun) WAJIB tercatat di **Mutasi Stok**. Stok Bahan = materialized view dari kumulatif Mutasi Stok per bahan.

---

## 5. Permission / Role

| Role      | Akses                       |
| --------- | --------------------------- |
| `owner`   | Semua menu                  |
| `manager` | Semua menu                  |
| `staff`   | Dashboard + Stok Bahan saja |

(Diperlukan review lebih lanjut saat implementasi fitur — misal staff yang pegang gudang perlu akses Stok Opname & Pembuangan. Iterasi berikutnya.)

---

## 6. Status Implementasi

| Menu               | Status         | Keterangan       |
| ------------------ | -------------- | ---------------- |
| Dashboard          | 🚧 Placeholder | Coming soon page |
| Bahan              | 🚧 Placeholder | Coming soon page |
| Resep Menu         | 🚧 Placeholder | Coming soon page |
| Supplier           | 🚧 Placeholder | Coming soon page |
| Stok Bahan         | 🚧 Placeholder | Coming soon page |
| Stok Opname        | 🚧 Placeholder | Coming soon page |
| Mutasi Stok        | 🚧 Placeholder | Coming soon page |
| Pembuangan         | 🚧 Placeholder | Coming soon page |
| Pembelian          | 🚧 Placeholder | Coming soon page |
| Laporan Stok       | 🚧 Placeholder | Coming soon page |
| Laporan Penggunaan | 🚧 Placeholder | Coming soon page |
| HPP Menu           | 🚧 Placeholder | Coming soon page |
| Peringatan Stok    | 🚧 Placeholder | Coming soon page |

Sidebar nav + routing + translation sudah selesai (semua menu bisa di-klik dan menampilkan halaman placeholder dengan judul yang benar).

---

## 7. Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v7
- **Data**: TanStack Query (planned)
- **State**: Zustand (untuk auth store)
- **PWA**: vite-plugin-pwa
- **i18n**: react-i18next (id / en)
- **Icons**: lucide-react

---

## 8. Catatan Pengembangan

- Setiap halaman baru dibuat sebagai **feature module** di `src/features/<nama>/` mengikuti pola yang sudah ada (`src/features/inventory/`).
- Convention penamaan route: kebab-case (`/stock-opname`, `/purchase-orders`).
- Setiap halaman yang butuh data baru: tambah service + hook di feature module masing-masing, daftar di `src/features/<nama>/index.ts`.
- Untuk integrasi POS Moka di kemudian hari: cek dokumentasi API Moka → buat adapter di `src/integrations/moka/`.

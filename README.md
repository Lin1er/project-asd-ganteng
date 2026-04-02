# Lab Material - Sistem Antrean Sampel Laboratorium

Aplikasi **console berbasis C++** untuk mengelola antrean sampel material yang menunggu pengujian di laboratorium. Proyek ini merupakan implementasi dari struktur data **Queue (Antrean)** dan **Stack (Tumpukan)** dalam konteks dunia nyata.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Struktur Proyek](#struktur-proyek)
- [Struktur Data](#struktur-data)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Diagram Flow User](#diagram-flow-user)
- [Screenshot Menu](#screenshot-menu)
- [Penjelasan Menu](#penjelasan-menu)
- [Kontributor](#kontributor)

---

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Tambah Sampel** | Menambahkan sampel baru ke antrean pengujian (FIFO) |
| **Proses Sampel** | Memproses sampel pertama dalam antrean |
| **Lihat Antrean** | Menampilkan seluruh sampel yang menunggu pengujian |
| **Riwayat Pengujian** | Menyimpan dan menampilkan sampel yang telah diproses (LIFO) |
| **Dashboard Dinamis** | Menampilkan jumlah antrean dan sampel selesai secara real-time |
| **Animasi Loading** | Efek visual saat memproses sampel |
| **Cross-Platform** | Mendukung Windows dan Linux/Unix |

---

## Teknologi

| Kategori | Teknologi |
|----------|-----------|
| Bahasa | C++ (C++11) |
| Platform | Windows / Linux / Unix |
| Libraries | `<iostream>`, `<string>`, `<iomanip>`, `<chrono>`, `<thread>`, `<cstdlib>` |
| Compiler | g++ / clang++ |

---

## Struktur Proyek

```
project-asd-ganteng/
├── main.cpp        # Source code utama (331 lines)
├── app             # Binary executable (hasil compile)
└── README.md       # Dokumentasi proyek
```

---

## Struktur Data

### 1. Sample (Node)

```cpp
struct Sample {
    string kode;      // Kode unik sampel
    string pengirim;  // Nama pengirim sampel
    string jenisUji;  // Jenis pengujian yang diminta
    string jadwal;    // Waktu/jadwal pengujian
    Sample *next;     // Pointer ke node berikutnya
};
```

### 2. Queue (Antrean Pengujian)

Implementasi **Linked List** dengan pointer `head` dan `tail` untuk operasi FIFO:

| Method | Deskripsi | Kompleksitas |
|--------|-----------|--------------|
| `enqueue()` | Menambah sampel ke belakang antrean | O(1) |
| `dequeue()` | Mengambil sampel dari depan antrean | O(1) |
| `printQueue()` | Menampilkan seluruh antrean | O(n) |
| `getSize()` | Mengembalikan jumlah antrean | O(1) |

### 3. Stack (Riwayat Pengujian)

Implementasi **Linked List** dengan pointer `top` untuk operasi LIFO:

| Method | Deskripsi | Kompleksitas |
|--------|-----------|--------------|
| `push()` | Menambah sampel ke puncak stack | O(1) |
| `showLast()` | Menampilkan sampel terakhir diproses | O(1) |
| `showHistory()` | Menampilkan seluruh riwayat | O(n) |
| `getSize()` | Mengembalikan jumlah riwayat | O(1) |

---

## Instalasi & Menjalankan

### Prasyarat

- **g++** atau compiler C++ lainnya yang mendukung C++11

### Compile

```bash
# Linux/Unix
g++ -std=c++11 -o app main.cpp

# Windows (MinGW)
g++ -std=c++11 -o app.exe main.cpp
```

### Jalankan

```bash
# Linux/Unix
./app

# Windows
app.exe
```

---

## Diagram Flow User

### Flow Utama Aplikasi

```
                           ┌─────────────────────┐
                           │       START         │
                           └──────────┬──────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │   Tampilkan Menu    │
                           │   + Dashboard       │
                           └──────────┬──────────┘
                                      │
                                      ▼
                           ┌─────────────────────┐
                           │   Input Pilihan     │
                           │      (0-5)          │
                           └──────────┬──────────┘
                                      │
           ┌──────────────────────────┼──────────────────────────┐
           │          │          │          │          │         │
           ▼          ▼          ▼          ▼          ▼         ▼
        ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐   ┌─────┐    ┌─────┐
        │  1  │   │  2  │   │  3  │   │  4  │   │  5  │    │  0  │
        └──┬──┘   └──┬──┘   └──┬──┘   └──┬──┘   └──┬──┘    └──┬──┘
           │         │         │         │         │          │
           ▼         ▼         ▼         ▼         ▼          ▼
      ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
      │ Tambah │ │ Proses │ │ Lihat  │ │ Lihat  │ │ Lihat  │ │ Keluar │
      │ Sampel │ │ Sampel │ │Antrean │ │Terakhir│ │Riwayat │ │  App   │
      └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
           │         │         │         │         │          │
           └─────────┴─────────┴─────────┴─────────┘          │
                              │                               │
                              ▼                               ▼
                     ┌────────────────┐              ┌────────────────┐
                     │ Kembali ke     │              │      END       │
                     │ Menu Utama     │              └────────────────┘
                     └────────────────┘
```

---

### Flow 1: Tambah Sampel ke Antrean

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLOW: TAMBAH SAMPEL                          │
└─────────────────────────────────────────────────────────────────┘

    ┌───────────────┐
    │ Pilih Menu 1  │
    └───────┬───────┘
            │
            ▼
    ┌───────────────────┐
    │ Input Kode Sampel │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Input Nama        │
    │ Pengirim          │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Input Jenis Uji   │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Input Jadwal      │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │    enqueue()      │
    │ Tambah ke Queue   │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Tampilkan Pesan   │
    │    Sukses         │
    └───────────────────┘

    QUEUE (FIFO):
    ┌─────┬─────┬─────┬─────┐
    │ S1  │ S2  │ S3  │ S4  │ ◄── Sampel baru masuk di BELAKANG
    └─────┴─────┴─────┴─────┘
      ▲
      │
    HEAD (Keluar pertama)
```

---

### Flow 2: Proses Sampel

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLOW: PROSES SAMPEL                          │
└─────────────────────────────────────────────────────────────────┘

    ┌───────────────┐
    │ Pilih Menu 2  │
    └───────┬───────┘
            │
            ▼
    ┌───────────────────┐     Tidak
    │ Antrean Kosong?   ├──────────────┐
    └─────────┬─────────┘              │
              │ Ya                     │
              ▼                        ▼
    ┌───────────────────┐     ┌───────────────────┐
    │ Tampilkan Error   │     │ Animasi Loading   │
    │ "Antrean kosong!" │     │ "Memproses..."    │
    └───────────────────┘     └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │    dequeue()      │
                              │ Ambil dari Queue  │
                              └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │     push()        │
                              │ Simpan ke Stack   │
                              └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │ Tampilkan Pesan   │
                              │    Sukses         │
                              └───────────────────┘

    PROSES DEQUEUE:
    ┌─────┬─────┬─────┐          ┌─────┬─────┐
    │ S1  │ S2  │ S3  │   ───►   │ S2  │ S3  │
    └─────┴─────┴─────┘          └─────┴─────┘
      ▲                            ▲
      │                            │
    Diambil                      HEAD baru

    PROSES PUSH KE STACK:
    ┌─────┐
    │ S1  │ ◄── TOP (Sampel terakhir diproses)
    ├─────┤
    │ S0  │
    └─────┘
```

---

### Flow 3: Lihat Antrean

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLOW: LIHAT ANTREAN                          │
└─────────────────────────────────────────────────────────────────┘

    ┌───────────────┐
    │ Pilih Menu 3  │
    └───────┬───────┘
            │
            ▼
    ┌───────────────────┐     Tidak
    │ Antrean Kosong?   ├──────────────┐
    └─────────┬─────────┘              │
              │ Ya                     │
              ▼                        ▼
    ┌───────────────────┐     ┌───────────────────┐
    │ Tampilkan Error   │     │ printQueue()      │
    │ "Antrean kosong!" │     │ Iterasi Linked    │
    └───────────────────┘     │ List dari HEAD    │
                              └─────────┬─────────┘
                                        │
                                        ▼
                              ┌───────────────────┐
                              │ Tampilkan Tabel   │
                              │ Semua Sampel      │
                              └───────────────────┘

    OUTPUT:
    +----+------------+----------------------+-----------------+
    | No | Kode       | Nama Pengirim        | Jenis Uji       |
    +----+------------+----------------------+-----------------+
    | 1  | SPL-001    | PT. ABC              | Uji Tarik       |
    | 2  | SPL-002    | CV. XYZ              | Uji Keras       |
    +----+------------+----------------------+-----------------+
```

---

### Flow 4 & 5: Lihat Riwayat

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLOW: LIHAT RIWAYAT                          │
└─────────────────────────────────────────────────────────────────┘

    ┌───────────────┐          ┌───────────────┐
    │ Pilih Menu 4  │          │ Pilih Menu 5  │
    │ (Terakhir)    │          │ (Semua)       │
    └───────┬───────┘          └───────┬───────┘
            │                          │
            ▼                          ▼
    ┌───────────────────┐     ┌───────────────────┐
    │   showLast()      │     │   showHistory()   │
    │ Tampilkan TOP     │     │ Iterasi Stack     │
    └───────────────────┘     │ dari TOP ke bawah │
                              └───────────────────┘

    STACK (LIFO):
    ┌─────┐
    │ S3  │ ◄── TOP (Terbaru / Terakhir diproses)
    ├─────┤
    │ S2  │
    ├─────┤
    │ S1  │     (Terlama)
    └─────┘
```

---

### Diagram Relasi Queue & Stack

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        ARSITEKTUR SISTEM                                 │
└──────────────────────────────────────────────────────────────────────────┘

                              USER INPUT
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            MAIN PROGRAM                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      QUEUE (Antrean)                             │   │
│  │                                                                  │   │
│  │    enqueue()                                     dequeue()       │   │
│  │        │                                             │           │   │
│  │        ▼                                             ▼           │   │
│  │   ┌────────┐    ┌────────┐    ┌────────┐       ┌────────┐       │   │
│  │   │ Sampel │───►│ Sampel │───►│ Sampel │  ───► │ Sampel │       │   │
│  │   │  Baru  │    │   2    │    │   3    │       │Diproses│       │   │
│  │   └────────┘    └────────┘    └────────┘       └───┬────┘       │   │
│  │       ▲                                            │             │   │
│  │       │                                            │             │   │
│  │     TAIL                                           │             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                       │                  │
│                                                       │ push()           │
│                                                       ▼                  │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                      STACK (Riwayat)                             │   │
│  │                                                                  │   │
│  │                        ┌────────┐                                │   │
│  │                        │ Sampel │ ◄── TOP (showLast)             │   │
│  │                        │Terbaru │                                │   │
│  │                        ├────────┤                                │   │
│  │                        │ Sampel │                                │   │
│  │                        │   2    │     showHistory()              │   │
│  │                        ├────────┤     (Iterasi semua)            │   │
│  │                        │ Sampel │                                │   │
│  │                        │Terlama │                                │   │
│  │                        └────────┘                                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Screenshot Menu

```
  _          _      ____    __  __       _            _       _ 
 | |    __ _| |__  |  _ \  |  \/  | __ _| |_ ___ _ __(_) __ _| |
 | |   / _` | '_ \ | |_) | | |\/| |/ _` | __/ _ \ '__| |/ _` | |
 | |__| (_| | |_) ||  __/  | |  | | (_| | ||  __/ |  | | (_| | |
 |_____\__,_|_.__/ |_|     |_|  |_|\__,_|\__\___|_|  |_|\__,_|_|

  =======================================================
  ||  Status Lab:  [2 Antrean]  ---  [5 Selesai]       ||
  =======================================================

  [1] + Tambah Sampel ke Antrean
  [2] >> Proses Sampel Berikutnya
  [3] = Lihat Antrean Saat Ini
  [4] * Lihat Sampel Terakhir Diproses
  [5] # Lihat Riwayat Keseluruhan
  [0] x Keluar

  Pilih menu (0-5): _
```

---

## Penjelasan Menu

| Menu | Aksi | Deskripsi |
|------|------|-----------|
| `[1]` | Tambah Sampel | Input data sampel baru (kode, pengirim, jenis uji, jadwal) lalu masuk ke antrean |
| `[2]` | Proses Sampel | Mengambil sampel pertama dari antrean, memproses, dan menyimpan ke riwayat |
| `[3]` | Lihat Antrean | Menampilkan tabel seluruh sampel yang sedang menunggu |
| `[4]` | Sampel Terakhir | Menampilkan sampel yang terakhir selesai diproses |
| `[5]` | Riwayat Lengkap | Menampilkan semua sampel yang telah diproses (terbaru di atas) |
| `[0]` | Keluar | Menutup aplikasi |

---

## Kontributor

Proyek ini dibuat sebagai tugas mata kuliah **Algoritma dan Struktur Data (ASD)**.

---

## Lisensi

Proyek ini dibuat untuk keperluan edukasi.

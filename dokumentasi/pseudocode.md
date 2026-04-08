# FINAL Pseudocode - Sesuai Logic main.cpp versi terbaru

## 1. Tambah Sampel ke Antrean (Menu 1)
```
Tampilkan form input:
  Input pengirim
    Validasi: min 3 karakter, hanya huruf/spasi/dash
  Pilih jenis uji (1-10)
    Validasi angka 1-10
  Input tanggal (DD/MM/YYYY)
    Validasi format tanggal, range tahun 2000-2100, tanggal legal
Jika ada input salah: tampilkan pesan error, ulangi input
Jika valid: auto-generate kode sampel
Konfirmasi: Simpan data? (Ya/Tidak)
Jika Ya:
  Masukkan ke antrean (insert sort: tanggal terdekat paling depan, FIFO untuk tanggal sama)
  Notifikasi "Berhasil tambah ke antrean"
Jika Tidak:
  Data batal disimpan
```

## 2. Proses Sampel (Menu 2)
```
Jika antrean kosong:
  Tampilkan error 'Tidak ada antrean untuk diproses'
Jika tidak kosong:
  Tampilkan animasi proses
  Dequeue node pertama dari antrean (prioritas tanggal)
  Push ke stack riwayat
  Notifikasi sukses
```

## 3. Lihat Antrean & Riwayat (Menu 3, 5), Terakhir Selesai (Menu 4)
```
Menu 3: Cetak seluruh antrean urut prioritas (tanggal lalu FIFO)
Menu 4: Cetak top riwayat (1 data terakhir selesai)
Menu 5: Cetak seluruh riwayat (stack: terbaru-terlama)
```

## 4. Cari Sampel (Menu 6)
```
Input kode (format SPL-XXXX)
Cek antrean:
  Kalau ditemukan tampilkan detail
  Kalau tidak, cek riwayat
    Kalau ditemukan, tampilkan detail
    Kalau tidak ada, notif 'tidak ditemukan'
```

## 5. Statistik Laboratorium (Menu 7)
```
Hitung:
  Total = antrean + riwayat
  Antrean = sisa antrean
  Selesai = stack riwayat
  Persentase selesai
Print kode SPL terakhir, tampilkan semua statistik
```

## 6. Filter Jenis Uji (Menu 8)
```
Input jenis uji (1-10)
Untuk semua data di antrean dan riwayat:
  Jika jenis uji sama:
    Print (kode, pengirim, jadwal, lokasi antrean/riwayat)
Jika tidak ada yang ditemukan, notif kosong
```

## 7. Keluar (Menu 0)
```
Exit program.
```

# Pseudocode Sistem Antrean Sampel Laboratorium

## 1. Tambah Sampel ke Antrean

```
Mulai
Input data_sampel (pengirim, jenis_uji, tanggal)
Jika data_sampel ada yang kosong:
    Tampilkan error 'Harap lengkapi semua data'
    Ulangi input
Else:
    antrian.enqueue(data_sampel)
    Tampilkan notifikasi 'Berhasil tambah ke antrean'
Selesai
```

## 2. Proses Sampel (Ambil dari Antrian)

```
Jika antrian tidak kosong:
    sampel <- antrian.dequeue()
    riwayat.push(sampel)
    Tampilkan notifikasi 'Sampel berhasil diproses'
Else:
    Tampilkan error 'Tidak ada antrean untuk diproses'
```

## 3. Reset Data

```
antrian.clear()
riwayat.clear()
Tampilkan notifikasi 'Semua data antrean & riwayat berhasil dihapus'
```

## 4. Cari Sampel di Antrean/Riwayat

```
Input kode_cari
Jika kode_cari ditemukan di antrian:
    Tampilkan detail sampel dari antrian
Else jika kode_cari ditemukan di riwayat:
    Tampilkan detail sampel dari riwayat
Else:
    Tampilkan error 'Sampel tidak ditemukan'
```

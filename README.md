# Lab Material - Sistem Antrean Sampel Laboratorium

Aplikasi C++ console dan web (integrasi WebAssembly) untuk pengelolaan antrean dan riwayat sampel laboratorium. Visualisasi antrian dan stack dengan UI interaktif modern.

---

## Build & Instalasi

### Prasyarat
- Linux: g++, Python 3
- Windows: g++ (MinGW/WSL), Python 3
- (Untuk WebAssembly/website-dev) Emscripten: https://emscripten.org/

### Build Otomatis
Gunakan Makefile (build otomatis deteksi OS & artefak):

    # Build console app (Linux)
    make
    # Build Windows binary (di Linux/WSL atau MinGW, hasil app.exe)
    make win
    # Build WebAssembly artefak/Web
    make wasm

### Clean (hapus artefak build):

    make clean

---

## Menjalankan

### Aplikasi Console (Terminal)

    # Linux/Unix
    ./app
    # Windows
    app.exe

### Website

    # Masuk folder web dan jalankan server
    cd web
    python3 -m http.server 8000
    # Buka browser http://localhost:8000

---

## UX: Website Ramah Orang Tua & Anak Muda (V2)
- Tampilan ringkas, tulisan jelas, navigasi 1 klik
- Label tombol & instruksi menggunakan Bahasa Indonesia komunikatif
- Warna kontras tinggi, teks besar, animasi loading friendly
- Aksesibel: tombol besar, form ringkas, instruksi simpel
- Cocok untuk operator laboratorium senior & mahasiswa

---

## Source Kode dan Pengembangan
- Kode utama: main.cpp (console), web/app.js + web/index.html (frontend)
- Build WASM dari main.cpp (mode web)
- Lihat Makefile untuk detail build lintas platform
- Kompatibel Linux dan Windows/MinGW

---

## Catatan / Lisensi
Proyek edukasi, bebas modifikasi.

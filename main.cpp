#include <chrono>
#include <cstdlib>
#include <ctime>
#include <iomanip>
#include <iostream>
#include <limits>
#include <regex>
#include <string>
#ifdef _WIN32
#include <windows.h>
#else
#include <thread>
#endif

using namespace std;

// ====== GLOBAL COUNTER FOR AUTO-GENERATION ======
int sampleCounter = 1000;
int antreanCounter = 0;  // No. Antrean (1, 2, 3, ...)

// Generate kode sampel unik (SPL-1001, SPL-1002, dst)
string generateSampleCode() {
  return "SPL-" + to_string(++sampleCounter);
}

// --- UTILITIES ---
// Cetak garis dengan karakter dan panjang custom
void printLine(char c = '-', int len = 60) {
  cout << string(len, c) << "\n";
}

// Helper untuk uppercase string
string toUpperCase(string s) {
  for (auto& c : s) c = toupper(c);
  return s;
}

// Helper untuk trim whitespace
string trim(const string& s) {
  size_t awal = s.find_first_not_of(" \t\n\r");
  size_t akhir = s.find_last_not_of(" \t\n\r");
  if (awal == string::npos) return "";
  return s.substr(awal, akhir - awal + 1);
}

void clearScreen() {
#ifdef _WIN32
  system("cls");
#else
  system("clear");
#endif
}

// Fungsi untuk bikin animasi loading simpel
void loadingAnimation(string message) {
  cout << "\033[36m" << message << "\033[0m";
  for (int i = 0; i < 4; i++) {
    cout << "\033[36m.\033[0m" << flush;
#ifdef _WIN32
    Sleep(400);
#else
    this_thread::sleep_for(chrono::milliseconds(400));
#endif
  }
  cout << "\n";
}

// Garis tabel
void printTableLine() {
  cout << "+----+------------+----------------------+-----------------+--------"
          "--------------+\n";
}

// --- TEMPLATE RESPONSE ---
template <typename T> struct Response {
  bool status;
  string message;
  T data;
  Response(bool s = false, string m = "", T d = T())
      : status(s), message(m), data(d) {}
};

template <> struct Response<void> {
  bool status;
  string message;
  Response(bool s = false, string m = "") : status(s), message(m) {}
};

template <typename T> using Res = Response<T>;

// --- ENUM JENIS UJI LABORATORIUM ---
enum JenisUji {
  UJI_TARIK        = 1,
  UJI_TEKAN        = 2,
  UJI_KEKERASAN    = 3,
  UJI_IMPAK        = 4,
  UJI_LENTUR       = 5,
  UJI_KELELAHAN    = 6,
  UJI_KOROSI       = 7,
  UJI_METALOGRAFI  = 8,
  UJI_KOMPOSISI    = 9,
  UJI_TERMAL       = 10,
};

// Konversi enum ke string
string jenisUjiToString(int kode) {
  switch (kode) {
    case UJI_TARIK:       return "Uji Tarik (Tensile Test)";
    case UJI_TEKAN:       return "Uji Tekan (Compression Test)";
    case UJI_KEKERASAN:   return "Uji Kekerasan (Hardness Test)";
    case UJI_IMPAK:       return "Uji Impak (Impact Test)";
    case UJI_LENTUR:      return "Uji Lentur (Flexural Test)";
    case UJI_KELELAHAN:   return "Uji Kelelahan (Fatigue Test)";
    case UJI_KOROSI:      return "Uji Korosi (Corrosion Test)";
    case UJI_METALOGRAFI: return "Metalografi (Metallography)";
    case UJI_KOMPOSISI:   return "Analisis Komposisi (SEM/EDX)";
    case UJI_TERMAL:      return "Analisis Termal (TGA/DSC)";
    default:              return "Tidak Diketahui";
  }
}

// Tampilkan menu pilihan jenis uji
void tampilkanMenuJenisUji() {
  cout << "\033[36m";
  printLine('-', 55);
  cout << "  DAFTAR JENIS UJI LABORATORIUM\n";
  printLine('-', 55);
  cout << "\033[0m";
  for (int i = UJI_TARIK; i <= UJI_TERMAL; i++) {
    cout << "  " << i << ". " << jenisUjiToString(i) << "\n";
  }
  printLine('-', 55);
}

// --- VALIDASI INPUT ---
// Baca integer dalam rentang [min, max], ulangi jika tidak valid
int bacaInt(const string& prompt, int min, int max) {
  int nilai;
  while (true) {
    cout << prompt;
    if (cin >> nilai && nilai >= min && nilai <= max) {
      cin.ignore(numeric_limits<streamsize>::max(), '\n');
      return nilai;
    }
    cin.clear();
    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "\033[31m  Input tidak valid! Masukkan angka antara "
         << min << " dan " << max << ".\033[0m\n";
  }
}

// Validasi nama pengirim: huruf, spasi, dan dash. Minimal 3 karakter
Res<string> validasiNama(const string& nama) {
  if (nama.length() < 3)
    return {false, "Nama terlalu pendek (minimal 3 karakter).", ""};
  for (char c : nama) {
    if (!isalpha(c) && c != ' ' && c != '-')
      return {false, "Nama hanya boleh mengandung huruf, spasi, dan dash.", ""};
  }
  return {true, "OK", nama};
}

// Validasi jadwal: format DD/MM/YYYY
Res<string> validasiJadwal(const string& jadwal) {
   regex pola("^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$");
   if (!regex_match(jadwal, pola))
     return {false, "Format jadwal harus DD/MM/YYYY (contoh: 25/12/2025).", ""};

   int dd = stoi(jadwal.substr(0, 2));
   int mm = stoi(jadwal.substr(3, 2));
   int yyyy = stoi(jadwal.substr(6, 4));

   if (yyyy < 2000 || yyyy > 2100)
     return {false, "Tahun tidak valid (2000–2100).", ""};

   int maxHari[] = {0,31,29,31,30,31,30,31,31,30,31,30,31};
   if (dd > maxHari[mm])
     return {false, "Tanggal tidak valid untuk bulan tersebut.", ""};

   return {true, "OK", jadwal};
}

// Validasi kode sampel: format SPL-XXXX
Res<string> validasiKodeSampel(const string& kode) {
  regex pola("^SPL-[0-9]{4}$");
  if (!regex_match(kode, pola))
    return {false, "Format kode harus SPL-XXXX (contoh: SPL-1001).", ""};
  return {true, "OK", kode};
}

// Baca string dengan validasi, ulangi jika gagal
string bacaStringValid(const string& prompt,
                       Res<string> (*validator)(const string&)) {
  string input;
  while (true) {
    cout << prompt;
    getline(cin, input);
    input = trim(input);

    if (input.empty()) {
      cout << "\033[31m  Input tidak boleh kosong.\033[0m\n";
      continue;
    }

    auto res = validator(input);
    if (res.status) return res.data;
    cout << "\033[31m  " << res.message << "\033[0m\n";
  }
}

// --- STRUKTUR DATA NODE ---
struct Sample {
  int noAntrean;
  string kode;
  string pengirim;
  int jenisUjiKode;
  string jadwal;
  Sample *next;

  Sample(int no = 0, string k = "", string p = "", int ju = 0, string jdl = "") {
    noAntrean = no;
    kode = k;
    pengirim = p;
    jenisUjiKode = ju;
    jadwal = jdl;
    next = nullptr;
  }
};

// Helper buat parsing tanggal DD/MM/YYYY ke integer biar gampang dibandingin
// Formatnya jadi YYYYMMDD
int parseTgl(string jdwl) {
    try {
        int d = stoi(jdwl.substr(0, 2));
        int m = stoi(jdwl.substr(3, 2));
        int y = stoi(jdwl.substr(6, 4));
        return y * 10000 + m * 100 + d;
    } catch (...) { return 0; }
}

// --- CLASS QUEUE (Sistem Antrean Laboratorium) ---
class QueueAntrean {
private:
  Sample *head;
  Sample *tail;
  int count;

public:
  QueueAntrean() : head(nullptr), tail(nullptr), count(0) {}

  ~QueueAntrean() {
    while (head != nullptr) {
      Sample *temp = head;
      head = head->next;
      delete temp;
    }
  }

  bool isEmpty() { return head == nullptr; }
  int getSize() { return count; }

  // Masukin sampel ke antrean (Berdasarkan Prioritas Tanggal & Waktu Input)
  Res<void> enqueue(string kode, string pengirim, int jenisUjiKode, string jadwal) {
    count++;
    Sample *baru = new Sample(count, kode, pengirim, jenisUjiKode, jadwal);
    int tglBaru = parseTgl(jadwal);

    // Kasus 1: Antrean masih kosong
    if (head == nullptr) {
      head = tail = baru;
    } 
    // Kasus 2: Tanggal sampel baru lebih awal dari head (jadi prioritas pertama)
    else if (tglBaru < parseTgl(head->jadwal)) {
      baru->next = head;
      head = baru;
    } 
    // Kasus 3: Cari posisi yang pas di tengah atau belakang
    else {
      Sample *curr = head;
      // Geser terus selama tanggal sampel berikutnya masih <= tanggal sampel baru
      // Ini ngejamin kalo tanggal sama, yang masuk duluan tetep di depan (FIFO)
      while (curr->next != nullptr && parseTgl(curr->next->jadwal) <= tglBaru) {
        curr = curr->next;
      }
      
      baru->next = curr->next;
      curr->next = baru;
      
      // Update tail kalo ternyata masuk paling belakang
      if (baru->next == nullptr) {
        tail = baru;
      }
    }
    
    return {true, "Sampel " + kode + " masuk antrean (Jadwal: " + jadwal + ")"};
  }

  // Ambil sampel paling depan (FIFO Prioritas)
  Res<Sample *> dequeue() {
    if (head == nullptr) return {false, "Antrean kosong!", nullptr};

    Sample *temp = head;
    head = head->next;

    if (head == nullptr) tail = nullptr;

    temp->next = nullptr;
    count--;
    return {true, "Sampel " + temp->kode + " (No. " + to_string(temp->noAntrean) + ") beres diproses", temp};
  }

  // Cari sampel pake kode (Sequential Search)
  Res<Sample *> search(string kode) {
    Sample *t = head;
    while (t != nullptr) {
      if (t->kode == kode) return {true, "Ketemu!", t};
      t = t->next;
    }
    return {false, "Kode '" + kode + "' gak ada di antrean", nullptr};
  }

  Response<void> printQueue() {
    if (head == nullptr) return {false, "Lagi gak ada antrean nih."};
    
    Sample *t = head;
    int i = 1;
    cout << "\n\033[36m";
    printLine('=', 75);
    cout << ">>> URUTAN ANTREAN (BERDASARKAN PRIORITAS TANGGAL) <<<\n";
    printLine('=', 75);
    cout << "\033[0m";
    
    while (t != nullptr) {
      cout << "  " << i++ << ". \033[1m[" << t->kode << "]\033[0m | \033[33m" << t->jadwal << "\033[0m\n"
           << "     Pengirim : " << t->pengirim << "\n"
           << "     Uji      : \033[36m" << jenisUjiToString(t->jenisUjiKode) << "\033[0m\n";
      t = t->next;
    }
    printLine('=', 75);
    return {true, ""};
  }

  // Getter untuk iterasi (diperlukan untuk filtering)
  Sample* getHead() { return head; }
};

// --- CLASS STACK ---
class StackHistory {
private:
  Sample *top;
  int count; // Melacak jumlah riwayat

public:
  StackHistory() {
    top = nullptr;
    count = 0;
  }

  // Destructor untuk memory management
  ~StackHistory() {
    while (top != nullptr) {
      Sample *temp = top;
      top = top->next;
      delete temp;
    }
  }

  bool isEmpty() { return top == nullptr; }

  int getSize() { return count; }

  Res<void> push(Sample *node) {
    if (node == nullptr)
      return {false, "Node yang di push kosong!"};
    node->next = this->top;
    this->top = node;
    count++;
    return {true, "Data pengujian telah disimpan ke Riwayat."};
  }

  Res<void> showLast() {
    if (this->top == nullptr)
      return {false, "Belum ada sampel yang diproses."};

    cout << "\n\033[32m";
    printLine('=', 75);
    cout << ">>> SAMPEL TERAKHIR SELESAI DIPROSES <<<\n";
    printLine('=', 75);
    cout << "\033[0m";
    cout << "  1. "
         << "\033[1m[" << this->top->kode << "]\033[0m"
         << " No. Antrean: " << "\033[33m" << this->top->noAntrean << "\033[0m"
         << " | Pengirim: " << this->top->pengirim << "\n"
         << "     Jenis Uji: " << "\033[36m"
         << jenisUjiToString(this->top->jenisUjiKode) << "\033[0m"
         << " | Jadwal: " << this->top->jadwal << "\n";
    printLine('=', 75);
    return {true, ""};
  }

  Res<void> showHistory() {
    if (top == nullptr) {
      return {false, "Riwayat pengujian masih kosong!"};
    }
    Sample *temp = top;
    int no = 1;
    cout << "\n\033[35m";
    printLine('=', 75);
    cout << ">>> RIWAYAT PENGUJIAN (TERBARU -> TERLAMA) <<<\n";
    printLine('=', 75);
    cout << "\033[0m";

    while (temp != nullptr) {
      cout << "  " << no << ". "
           << "\033[1m[" << temp->kode << "]\033[0m"
           << " No. Antrean: " << "\033[33m" << temp->noAntrean << "\033[0m"
           << " | Pengirim: " << temp->pengirim << "\n"
           << "     Jenis Uji: " << "\033[36m"
           << jenisUjiToString(temp->jenisUjiKode) << "\033[0m"
           << " | Jadwal: " << temp->jadwal << "\n";
      temp = temp->next;
      no++;
    }
    printLine('-', 75);
    cout << "  Total: " << count << " sampel telah diproses\n";
    printLine('=', 75);
    return {true, ""};
  }

  // Getter untuk iterasi (diperlukan untuk filtering)
  Sample* getTop() { return top; }
};

// --- MAIN PROGRAM ---
int main() {
  QueueAntrean antrean;
  StackHistory riwayat;

  // Palet Warna Terminal
  string merah = "\033[31m";
  string hijau = "\033[32m";
  string kuning = "\033[33m";
  string cyan = "\033[36m";
  string ungu = "\033[35m";
  string reset = "\033[0m";

  int pilihan;
  string kd, prm, jns, jdwl;

  do {
    clearScreen();
    // ASCII Art Header
    cout << kuning << R"(
  _          _      ____    __  __       _            _       _ 
 | |    __ _| |__  |  _ \  |  \/  | __ _| |_ ___ _ __(_) __ _| |
 | |   / _` | '_ \ | |_) | | |\/| |/ _` | __/ _ \ '__| |/ _` | |
 | |__| (_| | |_) ||  __/  | |  | | (_| | ||  __/ |  | | (_| | |
 |_____\__,_|_.__/ |_|     |_|  |_|\__,_|\__\___|_|  |_|\__,_|_|
)" << reset
         << "\n";

    // Dynamic Dashboard Stats
    cout << cyan
         << "  =======================================================\n"
         << reset;
    cout << "  ||  Status Lab:  [" << merah << antrean.getSize() << " Antrean"
         << reset << "]  ---  [" << hijau << riwayat.getSize() << " Selesai"
         << reset << "]  ||\n";
    cout << cyan
         << "  =======================================================\n\n"
         << reset;

    cout << "  [1] " << kuning << "+" << reset << " Tambah Sampel ke Antrean\n";
    cout << "  [2] " << hijau << ">>" << reset << " Proses Sampel Berikutnya\n";
    cout << "  [3] " << cyan << "=" << reset << " Lihat Antrean Saat Ini\n";
    cout << "  [4] " << ungu << "*" << reset
         << " Lihat Sampel Terakhir Diproses\n";
    cout << "  [5] " << ungu << "#" << reset << " Lihat Riwayat Keseluruhan\n";
    cout << "  [6] " << cyan << "?" << reset << " Cari Sampel (by Kode)\n";
    cout << "  [7] " << cyan << "!" << reset << " Lihat Statistik Lab\n";
    cout << "  [8] " << cyan << "@" << reset << " Filter Sampel (by Jenis Uji)\n";
    cout << "  [0] " << merah << "x" << reset << " Keluar\n\n";
    cout << "  Pilih menu (0-8): ";
    
    // Input validation
    while (!(cin >> pilihan)) {
      cin.clear();
      cin.ignore(numeric_limits<streamsize>::max(), '\n');
      cout << merah << "  [!] Input tidak valid! Masukkan angka: " << reset;
    }
    cin.ignore();

    cout << "\n";

    switch (pilihan) {
    case 1: {
      cout << "\033[36m";
      printLine('-', 60);
      cout << "  INPUT DATA SAMPEL BARU\n";
      printLine('-', 60);
      cout << "\033[0m";

      // Auto-generate kode
      kd = generateSampleCode();
      cout << "  Kode Sampel    : \033[33m" << kd << "\033[0m (Auto-generated)\n\n";

      // Input nama pengirim
      prm = bacaStringValid("  Nama Pengirim  : ", validasiNama);

      // Pilih jenis uji
      tampilkanMenuJenisUji();
      int jenisUjiKode = bacaInt("  Pilih jenis uji [1-10]: ", UJI_TARIK, UJI_TERMAL);

      // Input jadwal
      jdwl = bacaStringValid("  Jadwal (DD/MM/YYYY): ", validasiJadwal);

      // Konfirmasi data
      cout << "\n\033[33m";
      printLine('-', 60);
      cout << "  KONFIRMASI DATA\n";
      printLine('-', 60);
      cout << "\033[0m";
      cout << "  Kode      : " << kd << "\n";
      cout << "  Pengirim  : " << prm << "\n";
      cout << "  Jenis Uji : " << jenisUjiToString(jenisUjiKode) << "\n";
      cout << "  Jadwal    : " << jdwl << "\n";
      printLine('-', 60);
      
      int konfirmasi = bacaInt("  Simpan data? (1=Ya / 0=Tidak): ", 0, 1);

      if (konfirmasi == 1) {
        auto res = antrean.enqueue(kd, prm, jenisUjiKode, jdwl);
        cout << (res.status ? "\033[32m" : "\033[31m")
             << "\n  " << res.message << "\033[0m\n";
      } else {
        cout << "\033[33m\n  Data tidak disimpan.\033[0m\n";
      }
      break;
    }
    case 2: {
      if (antrean.isEmpty()) {
        cout << "\033[31m  Antrean kosong, tidak ada sampel untuk diproses!\033[0m\n";
        break;
      }
      // Animasi Loading
      loadingAnimation("  Mesin sedang memproses sampel");

      auto resQ = antrean.dequeue();
      if (resQ.status) {
        auto resS = riwayat.push(resQ.data);
        cout << "\033[32m  [v] " << resQ.message << "\n"
             << "  [v] " << resS.message << "\033[0m\n";
      }
      break;
    }
    case 3: {
      auto res = antrean.printQueue();
      if (!res.status)
        cout << "\033[31m  [!] " << res.message << "\033[0m\n";
      break;
    }
    case 4: {
      auto res = riwayat.showLast();
      if (!res.status)
        cout << "\033[31m  [!] " << res.message << "\033[0m\n";
      break;
    }
    case 5: {
      auto res = riwayat.showHistory();
      if (!res.status)
        cout << "\033[31m  [!] " << res.message << "\033[0m\n";
      break;
    }
    case 6: {
      cout << "\033[36m";
      printLine('-', 60);
      cout << "  CARI SAMPEL\n";
      printLine('-', 60);
      cout << "\033[0m";
      
      string kodeCari = bacaStringValid("  Masukkan Kode Sampel: ", validasiKodeSampel);
      
      auto res = antrean.search(kodeCari);
      if (res.status) {
        cout << "\n\033[32m  " << res.message << "\033[0m\n";
        printLine('-', 60);
        cout << "  " << "\033[1m[" << res.data->kode << "]\033[0m"
             << " No. Antrean: " << "\033[33m" << res.data->noAntrean << "\033[0m"
             << " | Pengirim: " << res.data->pengirim << "\n"
             << "  Jenis Uji: " << "\033[36m"
             << jenisUjiToString(res.data->jenisUjiKode) << "\033[0m"
             << " | Jadwal: " << res.data->jadwal << "\n";
        printLine('-', 60);
      } else {
        cout << "\033[31m  [!] " << res.message << "\033[0m\n";
      }
      break;
    }
    case 7: {
      // Statistik Lab
      cout << "\033[36m";
      printLine('-', 60);
      cout << "  STATISTIK LABORATORIUM\n";
      printLine('-', 60);
      cout << "\033[0m";
      
      int totalAntrean = antrean.getSize();
      int totalSelesai = riwayat.getSize();
      int totalSampel = totalAntrean + totalSelesai;
      
      cout << "  Total Sampel Terdaftar    : " << "\033[33m" << totalSampel << "\033[0m\n";
      cout << "  Sampel dalam Antrean      : " << "\033[31m" << totalAntrean << "\033[0m\n";
      cout << "  Sampel Selesai Diproses   : " << "\033[32m" << totalSelesai << "\033[0m\n";
      
      if (totalSampel > 0) {
        double persenSelesai = (totalSelesai * 100.0) / totalSampel;
        cout << "  Persentase Selesai        : " << "\033[32m" << fixed << setprecision(1) << persenSelesai << "%\033[0m\n";
      }
      
      cout << "  Kode Sampel Terakhir      : " << "\033[33m" << "SPL-" << sampleCounter << "\033[0m\n";
      printLine('-', 60);
      break;
    }
    case 8: {
      // Filter by Jenis Uji
      cout << "\033[36m";
      printLine('-', 60);
      cout << "  FILTER SAMPEL BERDASARKAN JENIS UJI\n";
      printLine('-', 60);
      cout << "\033[0m";
      
      cout << "  Pilih Jenis Uji:\n";
      for (int i = UJI_TARIK; i <= UJI_TERMAL; i++) {
        cout << "  [" << i << "] " << jenisUjiToString(i) << "\n";
      }
      cout << "  [0] Kembali ke Menu\n\n";
      
      int jenisUjiFilter = bacaInt("  Pilih (0-10): ", 0, 10);
      if (jenisUjiFilter == 0) break;
      
      cout << "\n  Sampel dengan Uji: " << "\033[36m" << jenisUjiToString(jenisUjiFilter) << "\033[0m\n";
      printLine('-', 60);
      
      // Filter from both queue and history
      int found = 0;
      
      // Check in antrian (queue)
      auto curr = antrean.getHead();
      while (curr != nullptr) {
        if (curr->jenisUjiKode == jenisUjiFilter) {
          cout << "  [ANTREAN] " << curr->kode << " - Pengirim: " << curr->pengirim 
               << " (Jadwal: " << curr->jadwal << ")\n";
          found++;
        }
        curr = curr->next;
      }
      
      // Check in riwayat (history/stack)
      auto histCurr = riwayat.getTop();
      while (histCurr != nullptr) {
        if (histCurr->jenisUjiKode == jenisUjiFilter) {
          cout << "  [SELESAI] " << histCurr->kode << " - Pengirim: " << histCurr->pengirim 
               << " (Jadwal: " << histCurr->jadwal << ")\n";
          found++;
        }
        histCurr = histCurr->next;
      }
      
      if (found == 0) {
        cout << "  \033[33m[!] Tidak ada sampel dengan jenis uji ini.\033[0m\n";
      } else {
        cout << "  \033[32m✓ Total sampel ditemukan: " << found << "\033[0m\n";
      }
      printLine('-', 60);
      break;
    }
    case 0:
      cout << "\033[32m  Keluar dari program. Terima kasih!\033[0m\n";
      break;

    default:
      cout << "\033[31m  [!] Pilihan tidak valid! Masukkan angka 0-8.\033[0m\n";
    }

    if (pilihan != 0) {
      cout << "\nTekan Enter untuk kembali ke menu...";
      cin.get();
    }

  } while (pilihan != 0);

  return 0;
}

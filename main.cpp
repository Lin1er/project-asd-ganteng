#include <chrono>  // Untuk durasi waktu
#include <cstdlib>
#include <ctime>   // Untuk random seed
#include <iomanip> // Untuk format tabel (setw, left)
#include <iostream>
#include <limits>  // Untuk numeric_limits (input validation)
#include <string>
#include <thread>  // Untuk animasi delay

using namespace std;

// ====== GLOBAL COUNTER FOR AUTO-GENERATION ======
int sampleCounter = 1000;

// --- UTILITIES ---
// Generate kode sampel unik (SPL-1001, SPL-1002, dst)
string generateSampleCode() {
  return "SPL-" + to_string(++sampleCounter);
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
    this_thread::sleep_for(chrono::milliseconds(400)); // Delay 400ms
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

// --- STRUKTUR DATA NODE ---
struct Sample {
  string kode;
  string pengirim;
  string jenisUji;
  string jadwal;
  Sample *next;

  Sample(string k = "", string p = "", string ju = "", string jdl = "") {
    kode = k;
    pengirim = p;
    jenisUji = ju;
    jadwal = jdl;
    next = nullptr;
  }
};

// --- CLASS QUEUE ---
class QueueAntrean {
private:
  Sample *head;
  Sample *tail;
  int count; // Tambahan kreativitas: melacak jumlah antrean

public:
  QueueAntrean() {
    head = nullptr;
    tail = nullptr;
    count = 0;
  }

  // Destructor untuk memory management (mencegah memory leak)
  ~QueueAntrean() {
    while (head != nullptr) {
      Sample *temp = head;
      head = head->next;
      delete temp;
    }
  }

  bool isEmpty() { return head == nullptr; }

  int getSize() { return count; }

  // Peek: lihat sampel pertama tanpa menghapus
  Res<Sample *> peek() {
    if (head == nullptr) {
      return {false, "Antrean kosong!", nullptr};
    }
    return {true, "Sampel pertama dalam antrean", head};
  }

  // Cari sampel berdasarkan kode
  Res<Sample *> search(string kode) {
    Sample *temp = head;
    while (temp != nullptr) {
      if (temp->kode == kode) {
        return {true, "Sampel ditemukan!", temp};
      }
      temp = temp->next;
    }
    return {false, "Sampel dengan kode '" + kode + "' tidak ditemukan!", nullptr};
  }

  Res<void> enqueue(string kode, string pengirim, string jenisUji,
                    string jadwal) {
    Sample *newNode = new Sample(kode, pengirim, jenisUji, jadwal);
    if (this->tail == nullptr) {
      this->head = this->tail = newNode;
    } else {
      this->tail->next = newNode;
      this->tail = newNode;
    }
    count++;
    return {true, "Sampel berhasil ditambahkan ke antrean!"};
  }

  Res<Sample *> dequeue() {
    if (this->head == nullptr) {
      return {false, "Antrean kosong!", nullptr};
    }

    Sample *temp = this->head;
    this->head = this->head->next;

    if (this->head == nullptr) {
      this->tail = nullptr;
    }

    temp->next = nullptr;
    count--;
    return {true, "Sampel berhasil diproses!", temp};
  }

  Response<void> printQueue() {
    if (this->head == nullptr) {
      return {false, "Antrean pengujian saat ini kosong!"};
    }
    Sample *temp = this->head;
    int no = 1;
    cout << "\n\033[36m>>> DAFTAR ANTREAN PENGUJIAN SAAT INI <<<\033[0m\n";
    printTableLine();
    cout << "| " << left << setw(2) << "No"
         << " | " << setw(10) << "Kode"
         << " | " << setw(20) << "Nama Pengirim"
         << " | " << setw(15) << "Jenis Uji"
         << " | " << setw(20) << "Jadwal" << " |\n";
    printTableLine();

    while (temp != nullptr) {
      cout << "| " << left << setw(2) << no++ << " | " << setw(10) << temp->kode
           << " | " << setw(20) << temp->pengirim << " | " << setw(15)
           << temp->jenisUji << " | " << setw(20) << temp->jadwal << " |\n";
      temp = temp->next;
    }
    printTableLine();
    return {true, ""};
  }
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

    cout << "\n\033[32m>>> SAMPEL TERAKHIR SELESAI DIPROSES <<<\033[0m\n";
    printTableLine();
    cout << "| " << left << setw(10) << "Kode"
         << " | " << setw(20) << "Nama Pengirim"
         << " | " << setw(15) << "Jenis Uji"
         << " | " << setw(25) << "Jadwal" << " |\n";
    printTableLine();
    cout << "| " << left << setw(10) << this->top->kode << " | " << setw(20)
         << this->top->pengirim << " | " << setw(15) << this->top->jenisUji
         << " | " << setw(25) << this->top->jadwal << " |\n";
    printTableLine();
    return {true, ""};
  }

  Res<void> showHistory() {
    if (top == nullptr) {
      return {false, "Riwayat pengujian masih kosong!"};
    }
    Sample *temp = top;
    int no = 1;
    cout << "\n\033[35m>>> RIWAYAT PENGUJIAN (TERBARU -> TERLAMA) <<<\033[0m\n";
    printTableLine();
    cout << "| " << left << setw(2) << "No"
         << " | " << setw(10) << "Kode"
         << " | " << setw(20) << "Nama Pengirim"
         << " | " << setw(15) << "Jenis Uji"
         << " | " << setw(20) << "Jadwal" << " |\n";
    printTableLine();

    while (temp != nullptr) {
      cout << "| " << left << setw(2) << no++ << " | " << setw(10) << temp->kode
           << " | " << setw(20) << temp->pengirim << " | " << setw(15)
           << temp->jenisUji << " | " << setw(20) << temp->jadwal << " |\n";
      temp = temp->next;
    }
    printTableLine();
    return {true, ""};
  }
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
    cout << "  [0] " << merah << "x" << reset << " Keluar\n\n";
    cout << "  Pilih menu (0-6): ";
    
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
      cout << cyan << "--- INPUT DATA SAMPEL BARU ---\n" << reset;
      // AUTO-GENERATE KODE SAMPEL
      kd = generateSampleCode();
      cout << " > Kode Sampel    : " << kuning << kd << reset << " (Auto-generated)\n";
      cout << " > Nama Pengirim  : ";
      getline(cin, prm);
      cout << " > Jenis Uji      : ";
      getline(cin, jns);
      cout << " > Jadwal (Waktu) : ";
      getline(cin, jdwl);

      auto res = antrean.enqueue(kd, prm, jns, jdwl);
      cout << "\n"
           << (res.status ? hijau : merah) << "[!] " << res.message << reset
           << endl;
      break;
    }
    case 2: {
      if (antrean.getSize() == 0) {
        cout << merah << "[!] Antrean kosong, tidak ada sampel untuk diproses!"
             << reset << endl;
        break;
      }
      // Animasi Loading Kreatif!
      loadingAnimation("Mesin sedang memproses sampel");

      auto resQ = antrean.dequeue();
      if (resQ.status) {
        auto resS = riwayat.push(resQ.data);
        cout << hijau << "[v] " << resQ.message << reset << endl;
        cout << hijau << "[v] " << resS.message << reset << endl;
      }
      break;
    }
    case 3: {
      auto res = antrean.printQueue();
      if (!res.status)
        cout << merah << "[!] " << res.message << reset << endl;
      break;
    }
    case 4: {
      auto res = riwayat.showLast();
      if (!res.status)
        cout << merah << "[!] " << res.message << reset << endl;
      break;
    }
    case 5: {
      auto res = riwayat.showHistory();
      if (!res.status)
        cout << merah << "[!] " << res.message << reset << endl;
      break;
    }
    case 6: {
      cout << cyan << "--- CARI SAMPEL ---\n" << reset;
      cout << " > Masukkan Kode Sampel: ";
      string kodeCari;
      getline(cin, kodeCari);
      
      auto res = antrean.search(kodeCari);
      if (res.status) {
        cout << "\n" << hijau << "[v] " << res.message << reset << "\n";
        printTableLine();
        cout << "| " << left << setw(10) << "Kode"
             << " | " << setw(20) << "Nama Pengirim"
             << " | " << setw(15) << "Jenis Uji"
             << " | " << setw(25) << "Jadwal" << " |\n";
        printTableLine();
        cout << "| " << left << setw(10) << res.data->kode << " | " << setw(20)
             << res.data->pengirim << " | " << setw(15) << res.data->jenisUji
             << " | " << setw(25) << res.data->jadwal << " |\n";
        printTableLine();
      } else {
        cout << merah << "[!] " << res.message << reset << endl;
      }
      break;
    }
    case 0:
      cout << hijau
           << "Sistem ditutup. Terima kasih telah menggunakan Lab Material!"
           << reset << endl;
      break;
    default:
      cout << merah << "[!] Pilihan tidak valid! Masukkan angka 0-6." << reset
           << endl;
    }

    if (pilihan != 0) {
      cout << "\nTekan Enter untuk kembali ke menu...";
      cin.get();
    }

  } while (pilihan != 0);

  return 0;
}

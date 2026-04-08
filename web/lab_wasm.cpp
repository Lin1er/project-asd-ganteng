/**
 * ============================================
 * LAB MATERIAL - WASM VERSION
 * ============================================
 * Implementasi Queue (FIFO) dan Stack (LIFO)
 * menggunakan Linked List untuk WebAssembly
 * ============================================
 */

#include <emscripten/bind.h>
#include <string>
#include <vector>

using namespace emscripten;

// ====== GLOBAL COUNTER FOR AUTO-GENERATION ======
int sampleCounter = 1000;
int antreanCounter = 0;

// Generate kode sampel unik (SPL-1001, SPL-1002, dst)
std::string generateSampleCode() {
    return "SPL-" + std::to_string(++sampleCounter);
}

// Konversi jenis uji ke string
std::string jenisUjiToString(int kode) {
    switch (kode) {
        case 1: return "Uji Tarik (Tensile Test)";
        case 2: return "Uji Tekan (Compression Test)";
        case 3: return "Uji Kekerasan (Hardness Test)";
        case 4: return "Uji Impak (Impact Test)";
        case 5: return "Uji Lentur (Flexural Test)";
        case 6: return "Uji Kelelahan (Fatigue Test)";
        case 7: return "Uji Korosi (Corrosion Test)";
        case 8: return "Metalografi (Metallography)";
        case 9: return "Analisis Komposisi (SEM/EDX)";
        case 10: return "Analisis Termal (TGA/DSC)";
        default: return "Tidak Diketahui";
    }
}

// ====== SAMPLE STRUCTURE ======
struct Sample {
    int noAntrean;
    std::string kode;
    std::string pengirim;
    int jenisUjiKode;
    std::string jadwal;
    Sample* next;

    Sample(const std::string& p, int j, const std::string& jd)
        : noAntrean(0), kode(generateSampleCode()), pengirim(p),
          jenisUjiKode(j), jadwal(jd), next(nullptr) {}
};

// ====== SAMPLE DATA for JS (plain object) ======
struct SampleData {
    int noAntrean;
    std::string kode;
    std::string pengirim;
    int jenisUjiKode;
    std::string jenisUji;
    std::string jadwal;
};

// ====== RESPONSE STRUCTURE ======
struct Response {
    bool status;
    std::string message;
};

// Helper parse tanggal
int parseTgl(std::string jdwl) {
    try {
        int d = std::stoi(jdwl.substr(0, 2));
        int m = std::stoi(jdwl.substr(3, 2));
        int y = std::stoi(jdwl.substr(6, 4));
        return y * 10000 + m * 100 + d;
    } catch (...) { return 0; }
}

// ====== QUEUE CLASS (Priority FIFO by Date) ======
class QueueAntrean {
private:
    Sample* head;
    Sample* tail;
    int count;

public:
    QueueAntrean() : head(nullptr), tail(nullptr), count(0) {}

    ~QueueAntrean() {
        while (head != nullptr) {
            Sample* temp = head;
            head = head->next;
            delete temp;
        }
    }

    bool isEmpty() { return head == nullptr; }
    int getSize() { return count; }

    // Enqueue dengan sorting tanggal
    Response enqueue(const std::string& pengirim, int jenisUjiKode, const std::string& jadwal) {
        Sample* baru = new Sample(pengirim, jenisUjiKode, jadwal);
        baru->noAntrean = ++antreanCounter;
        int tglBaru = parseTgl(jadwal);

        if (head == nullptr) {
            head = tail = baru;
        } else if (tglBaru < parseTgl(head->jadwal)) {
            baru->next = head;
            head = baru;
        } else {
            Sample* curr = head;
            while (curr->next != nullptr && parseTgl(curr->next->jadwal) <= tglBaru) {
                curr = curr->next;
            }
            baru->next = curr->next;
            curr->next = baru;
            if (baru->next == nullptr) tail = baru;
        }
        count++;

        return {true, "Sampel " + baru->kode + " masuk antrean (Jadwal: " + jadwal + ")"};
    }

    // Dequeue - O(1)
    Response dequeue() {
        if (head == nullptr) {
            return {false, "Antrean kosong!"};
        }

        Sample* temp = head;
        head = head->next;

        if (head == nullptr) {
            tail = nullptr;
        }

        count--;
        // Note: temp will be used by push to history, don't delete here
        return {true, temp->kode};
    }

    // Get front sample data
    SampleData peek() {
        if (head == nullptr) {
            return {0, "", "", 0, "", ""};
        }
        return {
            head->noAntrean,
            head->kode,
            head->pengirim,
            head->jenisUjiKode,
            jenisUjiToString(head->jenisUjiKode),
            head->jadwal
        };
    }

    // Get all samples as vector
    std::vector<SampleData> getAll() {
        std::vector<SampleData> result;
        Sample* curr = head;
        while (curr != nullptr) {
            result.push_back({
                curr->noAntrean,
                curr->kode,
                curr->pengirim,
                curr->jenisUjiKode,
                jenisUjiToString(curr->jenisUjiKode),
                curr->jadwal
            });
            curr = curr->next;
        }
        return result;
    }

    // Search by kode
    SampleData search(const std::string& kode) {
        Sample* curr = head;
        while (curr != nullptr) {
            if (curr->kode == kode) {
                return {
                    curr->noAntrean,
                    curr->kode,
                    curr->pengirim,
                    curr->jenisUjiKode,
                    jenisUjiToString(curr->jenisUjiKode),
                    curr->jadwal
                };
            }
            curr = curr->next;
        }
        return {0, "", "", 0, "", ""};
    }

    // Clear all
    void clear() {
        while (head != nullptr) {
            Sample* temp = head;
            head = head->next;
            delete temp;
        }
        tail = nullptr;
        count = 0;
    }
};

// ====== STACK CLASS (LIFO) ======
class StackHistory {
private:
    Sample* top;
    int count;

public:
    StackHistory() : top(nullptr), count(0) {}

    ~StackHistory() {
        while (top != nullptr) {
            Sample* temp = top;
            top = top->next;
            delete temp;
        }
    }

    bool isEmpty() { return top == nullptr; }
    int getSize() { return count; }

    // Push - O(1)
    Response push(const std::string& kode, const std::string& pengirim, 
                  int noAntrean, int jenisUjiKode, const std::string& jadwal) {
        Sample* newNode = new Sample(pengirim, jenisUjiKode, jadwal);
        newNode->kode = kode;  // Use existing kode
        newNode->noAntrean = noAntrean;
        newNode->next = top;
        top = newNode;
        count++;

        return {true, "Sampel " + kode + " selesai diproses!"};
    }

    // Peek top
    SampleData peek() {
        if (top == nullptr) {
            return {0, "", "", 0, "", ""};
        }
        return {
            top->noAntrean,
            top->kode,
            top->pengirim,
            top->jenisUjiKode,
            jenisUjiToString(top->jenisUjiKode),
            top->jadwal
        };
    }

    // Get all samples as vector
    std::vector<SampleData> getAll() {
        std::vector<SampleData> result;
        Sample* curr = top;
        while (curr != nullptr) {
            result.push_back({
                curr->noAntrean,
                curr->kode,
                curr->pengirim,
                curr->jenisUjiKode,
                jenisUjiToString(curr->jenisUjiKode),
                curr->jadwal
            });
            curr = curr->next;
        }
        return result;
    }

    // Search by kode
    SampleData search(const std::string& kode) {
        Sample* curr = top;
        while (curr != nullptr) {
            if (curr->kode == kode) {
                return {
                    curr->noAntrean,
                    curr->kode,
                    curr->pengirim,
                    curr->jenisUjiKode,
                    jenisUjiToString(curr->jenisUjiKode),
                    curr->jadwal
                };
            }
            curr = curr->next;
        }
        return {0, "", "", 0, "", ""};
    }

    // Clear all
    void clear() {
        while (top != nullptr) {
            Sample* temp = top;
            top = top->next;
            delete temp;
        }
        count = 0;
    }
};

// ====== GLOBAL INSTANCES ======
QueueAntrean antrean;
StackHistory riwayat;

// ====== WRAPPER FUNCTIONS FOR JS ======
Response addSample(const std::string& pengirim, int jenisUjiKode, const std::string& jadwal) {
    return antrean.enqueue(pengirim, jenisUjiKode, jadwal);
}

Response processSample() {
    SampleData front = antrean.peek();
    if (front.kode.empty()) {
        return {false, "Antrean kosong!"};
    }

    Response res = antrean.dequeue();
    if (res.status) {
        riwayat.push(front.kode, front.pengirim, front.noAntrean, front.jenisUjiKode, front.jadwal);
        return {true, "Sampel " + front.kode + " selesai diproses!"};
    }
    return res;
}

int getQueueSize() { return antrean.getSize(); }
int getHistorySize() { return riwayat.getSize(); }

std::vector<SampleData> getQueueList() { return antrean.getAll(); }
std::vector<SampleData> getHistoryList() { return riwayat.getAll(); }

SampleData searchSample(const std::string& kode) {
    SampleData result = antrean.search(kode);
    if (!result.kode.empty()) {
        return result;
    }
    return riwayat.search(kode);
}

void resetAll() {
    antrean.clear();
    riwayat.clear();
    sampleCounter = 1000;
    antreanCounter = 0;
}

std::string getJenisUji(int kode) {
    return jenisUjiToString(kode);
}

// ====== EMSCRIPTEN BINDINGS ======
EMSCRIPTEN_BINDINGS(lab_module) {
    value_object<Response>("Response")
        .field("status", &Response::status)
        .field("message", &Response::message);

    value_object<SampleData>("SampleData")
        .field("noAntrean", &SampleData::noAntrean)
        .field("kode", &SampleData::kode)
        .field("pengirim", &SampleData::pengirim)
        .field("jenisUjiKode", &SampleData::jenisUjiKode)
        .field("jenisUji", &SampleData::jenisUji)
        .field("jadwal", &SampleData::jadwal);

    register_vector<SampleData>("vector<SampleData>");

    function("addSample", &addSample);
    function("processSample", &processSample);
    function("getQueueSize", &getQueueSize);
    function("getHistorySize", &getHistorySize);
    function("getQueueList", &getQueueList);
    function("getHistoryList", &getHistoryList);
    function("searchSample", &searchSample);
    function("resetAll", &resetAll);
    function("getJenisUji", &getJenisUji);
}

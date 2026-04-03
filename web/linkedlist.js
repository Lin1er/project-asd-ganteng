/**
 * ============================================
 * LINKED LIST IMPLEMENTATION IN JAVASCRIPT
 * ============================================
 * Implementasi Queue (FIFO) dan Stack (LIFO) 
 * menggunakan struktur data Linked List
 * ============================================
 */

// ====== GLOBAL COUNTER FOR AUTO-GENERATION ======
let sampleCounter = 1000;

// Generate kode sampel unik (SPL-1001, SPL-1002, dst)
function generateSampleCode() {
  return "SPL-" + (++sampleCounter);
}

// ====== NODE STRUCTURE ======
// Representasi setiap sampel dalam linked list
class SampleNode {
    constructor(pengirim, jenisUji, jadwal) {
        // Data fields
        this.kode = generateSampleCode();  // Auto-generated
        this.pengirim = pengirim;          // Nama pengirim
        this.jenisUji = jenisUji;          // Jenis pengujian
        this.jadwal = jadwal;              // Jadwal pengujian
        
        // Pointer ke node berikutnya (linked list)
        this.next = null;
    }
}

// ====== QUEUE CLASS (FIFO - First In First Out) ======
// Implementasi antrean menggunakan linked list
class QueueAntrean {
    constructor() {
        this.head = null;   // Pointer ke depan antrean (keluar)
        this.tail = null;   // Pointer ke belakang antrean (masuk)
        this.count = 0;     // Jumlah sampel dalam antrean
    }

    // Cek apakah antrean kosong
    isEmpty() {
        return this.head === null;
    }

    // Dapatkan jumlah sampel dalam antrean
    getSize() {
        return this.count;
    }

    /**
     * ENQUEUE - Menambahkan sampel ke belakang antrean
     * Time Complexity: O(1)
     * 
     * Proses:
     * 1. Buat node baru
     * 2. Jika antrean kosong, head dan tail menunjuk ke node baru
     * 3. Jika tidak, sambungkan tail.next ke node baru, update tail
     */
    enqueue(pengirim, jenisUji, jadwal) {
        const newNode = new SampleNode(pengirim, jenisUji, jadwal);
        
        if (this.tail === null) {
            // Antrean kosong - node baru jadi head dan tail
            this.head = this.tail = newNode;
        } else {
            // Sambungkan ke belakang antrean
            this.tail.next = newNode;
            this.tail = newNode;
        }
        
        this.count++;
        return {
            status: true,
            message: `Sampel ${newNode.kode} berhasil ditambahkan ke antrean!`,
            data: newNode
        };
    }

    /**
     * DEQUEUE - Mengambil sampel dari depan antrean
     * Time Complexity: O(1)
     * 
     * Proses:
     * 1. Simpan referensi ke head
     * 2. Pindahkan head ke node berikutnya
     * 3. Jika head jadi null, tail juga harus null
     * 4. Kembalikan node yang diambil
     */
    dequeue() {
        if (this.head === null) {
            return {
                status: false,
                message: 'Antrean kosong!',
                data: null
            };
        }

        const temp = this.head;
        this.head = this.head.next;

        // Jika antrean jadi kosong
        if (this.head === null) {
            this.tail = null;
        }

        temp.next = null; // Putuskan koneksi
        this.count--;
        
        return {
            status: true,
            message: `Sampel ${temp.kode} berhasil diproses!`,
            data: temp
        };
    }

    /**
     * PEEK - Melihat sampel pertama tanpa menghapus
     * Time Complexity: O(1)
     */
    peek() {
        if (this.head === null) {
            return {
                status: false,
                message: 'Antrean kosong!',
                data: null
            };
        }
        return {
            status: true,
            message: 'Sampel pertama dalam antrean',
            data: this.head
        };
    }

    /**
     * SEARCH - Mencari sampel berdasarkan kode
     * Time Complexity: O(n)
     */
    search(kode) {
        let temp = this.head;
        let position = 1;
        
        while (temp !== null) {
            if (temp.kode.toLowerCase() === kode.toLowerCase()) {
                return {
                    status: true,
                    message: `Sampel ditemukan di posisi ${position}!`,
                    data: temp,
                    position: position
                };
            }
            temp = temp.next;
            position++;
        }
        
        return {
            status: false,
            message: `Sampel dengan kode '${kode}' tidak ditemukan!`,
            data: null
        };
    }

    /**
     * TO ARRAY - Konversi linked list ke array untuk display
     * Time Complexity: O(n)
     */
    toArray() {
        const result = [];
        let temp = this.head;
        
        while (temp !== null) {
            result.push({
                kode: temp.kode,
                pengirim: temp.pengirim,
                jenisUji: temp.jenisUji,
                jadwal: temp.jadwal
            });
            temp = temp.next;
        }
        
        return result;
    }

    // Reset antrean
    clear() {
        this.head = null;
        this.tail = null;
        this.count = 0;
    }
}

// ====== STACK CLASS (LIFO - Last In First Out) ======
// Implementasi riwayat pengujian menggunakan linked list
class StackHistory {
    constructor() {
        this.top = null;    // Pointer ke puncak stack
        this.count = 0;     // Jumlah sampel dalam riwayat
    }

    // Cek apakah stack kosong
    isEmpty() {
        return this.top === null;
    }

    // Dapatkan jumlah sampel dalam riwayat
    getSize() {
        return this.count;
    }

    /**
     * PUSH - Menambahkan sampel ke puncak stack
     * Time Complexity: O(1)
     * 
     * Proses:
     * 1. Node baru menunjuk ke top saat ini
     * 2. Update top ke node baru
     */
    push(sampleNode) {
        if (sampleNode === null) {
            return {
                status: false,
                message: 'Node kosong!'
            };
        }

        // Node baru menunjuk ke top lama
        sampleNode.next = this.top;
        // Update top ke node baru
        this.top = sampleNode;
        this.count++;
        
        return {
            status: true,
            message: `Data pengujian ${sampleNode.kode} telah disimpan ke Riwayat.`
        };
    }

    /**
     * POP - Mengambil sampel dari puncak stack
     * Time Complexity: O(1)
     */
    pop() {
        if (this.top === null) {
            return {
                status: false,
                message: 'Riwayat kosong!',
                data: null
            };
        }

        const temp = this.top;
        this.top = this.top.next;
        temp.next = null;
        this.count--;
        
        return {
            status: true,
            message: 'Data diambil dari riwayat',
            data: temp
        };
    }

    /**
     * SHOW LAST - Melihat sampel terakhir diproses (top of stack)
     * Time Complexity: O(1)
     */
    showLast() {
        if (this.top === null) {
            return {
                status: false,
                message: 'Belum ada sampel yang diproses.',
                data: null
            };
        }
        
        return {
            status: true,
            message: 'Sampel terakhir diproses',
            data: this.top
        };
    }

    /**
     * TO ARRAY - Konversi stack ke array (terbaru di awal)
     * Time Complexity: O(n)
     */
    toArray() {
        const result = [];
        let temp = this.top;
        
        while (temp !== null) {
            result.push({
                kode: temp.kode,
                pengirim: temp.pengirim,
                jenisUji: temp.jenisUji,
                jadwal: temp.jadwal
            });
            temp = temp.next;
        }
        
        return result;
    }

    // Reset stack
    clear() {
        this.top = null;
        this.count = 0;
    }
}

// ====== CODE SNIPPETS FOR DISPLAY ======
const codeSnippets = {
    node: `// Node Structure - Representasi setiap sampel dalam linked list
// KODE SAMPEL AUTO-GENERATED!
class SampleNode {
    constructor(pengirim, jenisUji, jadwal) {
        this.kode = generateSampleCode();  // Auto: SPL-1001, SPL-1002, ...
        this.pengirim = pengirim;          // Data: nama pengirim
        this.jenisUji = jenisUji;          // Data: jenis uji
        this.jadwal = jadwal;              // Data: jadwal pengujian
        this.next = null;                  // Pointer ke node berikutnya
    }
}

// Auto-generate function
let sampleCounter = 1000;
function generateSampleCode() {
    return "SPL-" + (++sampleCounter);
}

/* Visualisasi Node:
┌─────────────────────────────┐
│  kode: "SPL-1001" (auto)    │
│  pengirim: "PT. ABC"        │
│  jenisUji: "Uji Tarik"      │
│  jadwal: "2024-03-15 09:00" │
│  next: ─────────────────────┼───► (node berikutnya)
└─────────────────────────────┘
*/`,
    
    queue: `// Queue Class (FIFO) - Implementasi menggunakan Linked List
class QueueAntrean {
    constructor() {
        this.head = null;  // Pointer ke depan (dequeue)
        this.tail = null;  // Pointer ke belakang (enqueue)
        this.count = 0;
    }

    // ENQUEUE - Tambah ke belakang | O(1)
    enqueue(pengirim, jenisUji, jadwal) {
        const newNode = new SampleNode(pengirim, jenisUji, jadwal);
        // newNode.kode otomatis di-generate di constructor!
        
        if (this.tail === null) {
            this.head = this.tail = newNode;
        } else {
            this.tail.next = newNode;  // Sambung ke belakang
            this.tail = newNode;       // Update tail
        }
        this.count++;
        return newNode;  // Return node dengan kode yang sudah di-generate
    }

    // DEQUEUE - Ambil dari depan | O(1)
    dequeue() {
        if (this.head === null) return null;
        
        const temp = this.head;
        this.head = this.head.next;
        
        if (this.head === null) {
            this.tail = null;  // Antrean kosong
        }
        
        temp.next = null;
        this.count--;
        return temp;
    }
}

/* Visualisasi Queue:
HEAD                                    TAIL
  │                                       │
  ▼                                       ▼
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│SPL-1001 │───►│SPL-1002 │───►│SPL-1003 │───►│SPL-1004 │───► null
└─────────┘    └─────────┘    └─────────┘    └─────────┘
  ▲                                       ▲
  │                                       │
KELUAR                                 MASUK
(dequeue)                            (enqueue)
*/`,

    stack: `// Stack Class (LIFO) - Implementasi menggunakan Linked List
class StackHistory {
    constructor() {
        this.top = null;   // Pointer ke puncak stack
        this.count = 0;
    }

    // PUSH - Tambah ke puncak | O(1)
    push(sampleNode) {
        sampleNode.next = this.top;  // Node baru menunjuk ke top lama
        this.top = sampleNode;       // Update top ke node baru
        this.count++;
    }

    // POP - Ambil dari puncak | O(1)
    pop() {
        if (this.top === null) return null;
        
        const temp = this.top;
        this.top = this.top.next;  // Pindah top ke node di bawahnya
        temp.next = null;
        this.count--;
        return temp;
    }

    // PEEK - Lihat top tanpa menghapus | O(1)
    peek() {
        return this.top;
    }
}

/* Visualisasi Stack:
    TOP
     │
     ▼
┌─────────┐
│   S4    │ ◄── Terakhir masuk (terbaru)
├─────────┤
│   S3    │
├─────────┤
│   S2    │
├─────────┤
│   S1    │ ◄── Pertama masuk (terlama)
└─────────┘
     │
     ▼
   null
*/`
};

// Export untuk digunakan di app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SampleNode, QueueAntrean, StackHistory, codeSnippets };
}

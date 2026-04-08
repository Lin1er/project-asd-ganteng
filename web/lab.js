// Definisikan Module global sebelum app.js dimuat
var Module = {
    onRuntimeInitialized: function() {
        // Beri sedikit delay (misal 500ms) agar animasi loading terlihat smooth sebelum transisi
        setTimeout(() => {
            const loading = document.getElementById('loading');
            const app = document.getElementById('app');

            if (loading && app) {
                loading.classList.add('hidden');
                app.classList.remove('hidden');
            }

            // Buat custom event agar DOMContentLoaded bisa panggil updateUI
            window.dispatchEvent(new CustomEvent('wasmLoaded'));
        }, 500); // 500ms delay untuk animasi loading
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Tunggu Emscripten module siap kalau belum siap
    if (Module.getQueueSize) {
        updateUI();
    } else {
        window.addEventListener('wasmLoaded', updateUI);
    }

    // Elemen form & aksi
    const addForm = document.getElementById('addForm');
    const inputPengirim = document.getElementById('pengirim');
    const selectJenisUji = document.getElementById('jenisUji');
    const inputJadwal = document.getElementById('jadwal');

    const btnProcess = document.getElementById('btnProcess');
    const btnSearch = document.getElementById('btnSearch');
    const btnReset = document.getElementById('btnReset');

    // Modal Cari
    const modal = document.getElementById('searchModal');
    const searchInput = document.getElementById('searchInput');
    const searchResult = document.getElementById('searchResult');
    const btnCloseModal = document.querySelector('.modal-close');

    // Render daftar sampel ke HTML
    function renderList(listId, dataVector, historyMode = false) {
        const container = document.getElementById(listId);
        container.innerHTML = '';

        let count = dataVector.size();
        if (count === 0) {
            container.innerHTML = `<p class="empty">Belum ada sampel ${historyMode ? 'yang selesai diproses' : 'dalam antrean'}</p>`;
            return;
        }

        for (let i = 0; i < count; i++) {
            const item = dataVector.get(i);
            const div = document.createElement('div');
            div.className = `list-item ${historyMode ? 'history-item' : 'queue-item'}`;

            div.innerHTML = `
                <div class="item-header">
                    <span class="item-id">Antrean #${item.noAntrean}</span>
                    <span class="item-code">${item.kode}</span>
                </div>
                <div class="item-body">
                    <div><strong>Pengirim:</strong> ${item.pengirim}</div>
                    <div><strong>Jenis Uji:</strong> ${item.jenisUji}</div>
                    <div><strong>Jadwal Uji:</strong> ${item.jadwal}</div>
                </div>
            `;
            container.appendChild(div);
        }
    }

    // Toast message (notifikasi)
    function showToast(message, isSuccess = true) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${isSuccess ? 'success' : 'error'}`;

        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    // Refresh UI dari C++
    function updateUI() {
        // Update Hitungan
        const qSize = Module.getQueueSize();
        const hSize = Module.getHistorySize();

        document.getElementById('queueCount').textContent = qSize;
        document.getElementById('historyCount').textContent = hSize;
        document.getElementById('totalCount').textContent = qSize + hSize;

        document.getElementById('queueBadge').textContent = qSize;
        document.getElementById('historyBadge').textContent = hSize;

        // Tarik data dari C++
        const qList = Module.getQueueList();
        const hList = Module.getHistoryList();

        renderList('queueList', qList, false);
        renderList('historyList', hList, true);

        // Jangan lupa di-delete untuk mencegah memori bocor
        qList.delete();
        hList.delete();
    }

    // Tambah Antrean
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const pengirim = inputPengirim.value.trim();
        const jenisUji = parseInt(selectJenisUji.value);
        // Format jadwal: yyyy-mm-dd -> ubah ke dd/mm/yyyy di C++ mintanya atau string bebas
        // C++: parseTgl: d = substr(0,2), m = substr(3,2), y = substr(6,4)
        // HTML date picker itu yyyy-mm-dd
        let d = inputJadwal.value;
        if(d.includes('-')) {
            const parts = d.split('-');
            d = `${parts[2]}/${parts[1]}/${parts[0]}`; // dd/mm/yyyy compatible
        }

        const res = Module.addSample(pengirim, jenisUji, d);
        if (res.status) {
            showToast(res.message, true);
            updateUI();
            addForm.reset();
        } else {
            showToast(res.message, false);
        }
    });

    // Proses Antrean
    btnProcess.addEventListener('click', () => {
        if (Module.getQueueSize() === 0) {
            showToast("Antrean sudah kosong!", false);
            return;
        }

        const res = Module.processSample();
        if (res.status) {
            showToast(res.message, true);
            updateUI();
        } else {
            showToast(res.message, false);
        }
    });

    // Modal Pencarian
    btnSearch.addEventListener('click', () => {
        modal.classList.add('show');
        searchInput.value = '';
        searchResult.innerHTML = '';
        searchInput.focus();
    });

    btnCloseModal.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Aksi submit/enter pada input pencarian
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const kode = searchInput.value.trim();
            if (!kode) return;

            const res = Module.searchSample(kode);
            if (res.kode !== "") {
                searchResult.innerHTML = `
                    <div class="list-item" style="border-left: 4px solid var(--primary)">
                        <div class="item-header">
                            <span class="item-id">Ditemukan! (#${res.noAntrean})</span>
                            <span class="item-code">${res.kode}</span>
                        </div>
                        <div class="item-body">
                            <div><strong>Pengirim:</strong> ${res.pengirim}</div>
                            <div><strong>Jenis Uji:</strong> ${res.jenisUji}</div>
                            <div><strong>Jadwal Uji:</strong> ${res.jadwal}</div>
                        </div>
                    </div>
                `;
            } else {
                searchResult.innerHTML = `<p class="empty" style="color:var(--danger)">Sampel dengan kode ${kode} tidak ditemukan.</p>`;
            }
        }
    });

    // Reset
    btnReset.addEventListener('click', () => {
        if (confirm("Yakin ingin menghapus seluruh data secara permanen?")) {
            Module.resetAll();
            updateUI();
            showToast("Sistem berhasil direset.", true);
        }
    });

});

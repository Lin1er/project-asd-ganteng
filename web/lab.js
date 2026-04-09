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
            if (!historyMode) {
                container.innerHTML = `
                    <div class="md:col-span-2 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                        <p class="text-slate-400 font-medium">Belum ada antrean yang masuk.</p>
                    </div>`;
            } else {
                container.innerHTML = `<p class="text-slate-400 text-sm italic">Belum ada riwayat pengerjaan.</p>`;
            }
            return;
        }

        for (let i = 0; i < count; i++) {
            const item = dataVector.get(i);
            const div = document.createElement('div');
            
            if (!historyMode) {
                div.className = 'bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all';
                div.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <span class="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-lg mb-2">Antrean #${item.noAntrean}</span>
                            <h4 class="font-bold text-slate-800">${item.kode}</h4>
                        </div>
                        <span class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        </span>
                    </div>
                    <div class="space-y-2 text-sm text-slate-600">
                        <div class="flex items-center gap-2"><span class="w-4 h-4 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-[8px]">P</span> ${item.pengirim}</div>
                        <div class="flex items-center gap-2"><span class="w-4 h-4 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-[8px]">U</span> ${item.jenisUji}</div>
                        <div class="flex items-center gap-2"><span class="w-4 h-4 rounded bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-[8px]">J</span> ${item.jadwal}</div>
                    </div>
                `;
            } else {
                div.className = 'bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4';
                div.innerHTML = `
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <h4 class="font-bold text-slate-800">${item.kode}</h4>
                                <span class="text-xs text-slate-400">&bull; Antrean #${item.noAntrean}</span>
                            </div>
                            <p class="text-sm text-slate-500">${item.pengirim} &bull; ${item.jenisUji}</p>
                        </div>
                    </div>
                    <div class="text-sm font-mono text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">${item.jadwal}</div>
                `;
            }
            container.appendChild(div);
        }
    }

    // Toast message (notifikasi)
    function showToast(message, isSuccess = true) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        const toastIcon = document.getElementById('toastIcon');
        
        if (toastMsg && toastIcon) {
            toastMsg.textContent = message;
            toastIcon.innerHTML = isSuccess 
                ? '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>' 
                : '<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
            
            toast.classList.remove('translate-y-24', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');

            setTimeout(() => {
                toast.classList.add('translate-y-24', 'opacity-0');
                toast.classList.remove('translate-y-0', 'opacity-100');
            }, 3000);
        } else {
            // Fallback just in case
            toast.textContent = message;
            toast.className = 'fixed bottom-8 right-8 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl transition-all duration-300';
            setTimeout(() => {
                toast.className = 'hidden';
            }, 3000);
        }
    }

    // Refresh UI dari C++
    function updateUI() {
        // Update Hitungan
        const qSize = Module.getQueueSize();
        const hSize = Module.getHistorySize();

        document.getElementById('queueCount').textContent = qSize;
        document.getElementById('historyCount').textContent = hSize;

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
        modal.classList.remove('hidden');
        searchInput.value = '';
        searchResult.innerHTML = '';
        setTimeout(() => searchInput.focus(), 100);
    });

    btnCloseModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Aksi submit/enter pada input pencarian
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const kode = searchInput.value.trim();
            if (!kode) return;

            const res = Module.searchSample(kode);
            if (res.kode !== "") {
                searchResult.innerHTML = `
                    <div class="bg-indigo-50 p-5 rounded-2xl border border-indigo-200 shadow-sm relative overflow-hidden">
                        <div class="absolute -right-6 -top-6 text-indigo-100">
                            <svg class="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        </div>
                        <div class="relative z-10">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <span class="inline-block px-2.5 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg mb-2">Ditemukan! (#${res.noAntrean})</span>
                                    <h4 class="font-bold text-slate-800 text-xl">${res.kode}</h4>
                                </div>
                            </div>
                            <div class="space-y-2 text-sm text-slate-700">
                                <div class="flex items-center gap-2"><strong>Pengirim:</strong> ${res.pengirim}</div>
                                <div class="flex items-center gap-2"><strong>Jenis Uji:</strong> ${res.jenisUji}</div>
                                <div class="flex items-center gap-2"><strong>Jadwal Uji:</strong> ${res.jadwal}</div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                searchResult.innerHTML = `
                    <div class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center font-medium">
                        <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Sampel dengan kode ${kode} tidak ditemukan.
                    </div>`;
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

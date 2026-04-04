/**
 * ============================================
 * LAB MATERIAL - APPLICATION CONTROLLER
 * ============================================
 * Menghubungkan UI dengan implementasi Linked List
 * ============================================
 */

// ====== INITIALIZE DATA STRUCTURES ======
const antrean = new QueueAntrean();
const riwayat = new StackHistory();

// ====== DOM ELEMENTS ======
const elements = {
    // Form
    addSampleForm: document.getElementById('addSampleForm'),
    pengirim: document.getElementById('pengirim'),
    jenisUji: document.getElementById('jenisUji'),
    jadwal: document.getElementById('jadwal'),
    
    // Buttons
    processBtn: document.getElementById('processBtn'),
    searchBtn: document.getElementById('searchBtn'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    
    // Stats
    queueCount: document.getElementById('queueCount'),
    historyCount: document.getElementById('historyCount'),
    totalCount: document.getElementById('totalCount'),
    
    // Lists
    queueList: document.getElementById('queueList'),
    historyList: document.getElementById('historyList'),
    
    // Modal
    searchModal: document.getElementById('searchModal'),
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    
    confirmModal: document.getElementById('confirmModal'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmYes: document.getElementById('confirmYes'),
    confirmNo: document.getElementById('confirmNo')
};

// ====== HELPER FUNCTIONS ======
function jenisUjiToString(kode) {
    const uji = {
        1: 'Uji Tarik',
        2: 'Uji Tekan',
        3: 'Uji Kekerasan',
        4: 'Uji Impak',
        5: 'Uji Lentur',
        6: 'Uji Kelelahan',
        7: 'Uji Korosi',
        8: 'Metalografi',
        9: 'Analisis Komposisi',
        10: 'Analisis Termal'
    };
    return uji[kode] || 'Unknown';
}

function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return 'N/A';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('id-ID', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showModal(modal) {
    modal.classList.add('open');
}

function hideModal(modal) {
    modal.classList.remove('open');
}

function showConfirm(message, onConfirm) {
    elements.confirmMessage.textContent = message;
    showModal(elements.confirmModal);
    
    const handleYes = () => {
        hideModal(elements.confirmModal);
        elements.confirmYes.removeEventListener('click', handleYes);
        elements.confirmNo.removeEventListener('click', handleNo);
        onConfirm();
    };
    
    const handleNo = () => {
        hideModal(elements.confirmModal);
        elements.confirmYes.removeEventListener('click', handleYes);
        elements.confirmNo.removeEventListener('click', handleNo);
    };
    
    elements.confirmYes.addEventListener('click', handleYes);
    elements.confirmNo.addEventListener('click', handleNo);
}

// ====== RENDER FUNCTIONS ======
function updateStats() {
    const queueSize = antrean.getSize();
    const historySize = riwayat.getSize();
    
    elements.queueCount.textContent = queueSize;
    elements.historyCount.textContent = historySize;
    elements.totalCount.textContent = queueSize + historySize;
}

function renderQueueList() {
    const items = [];
    let curr = antrean.getHead();
    
    if (!curr) {
        elements.queueList.innerHTML = '<p class="empty-state">Belum ada sampel dalam antrean</p>';
        return;
    }
    
    while (curr) {
        const html = `
            <div class="list-item">
                <div>
                    <div class="list-item-code">${curr.kode}</div>
                    <div class="list-item-info">
                        <div class="list-item-sender">${curr.pengirim}</div>
                        <div class="list-item-test">${jenisUjiToString(curr.jenisUjiKode)}</div>
                        <div class="list-item-schedule">${formatDateTime(curr.jadwal)}</div>
                    </div>
                </div>
                <div class="list-item-badge">No. ${curr.noAntrean}</div>
            </div>
        `;
        items.push(html);
        curr = curr.next;
    }
    
    elements.queueList.innerHTML = items.join('');
}

function renderHistoryList() {
    const items = [];
    let curr = riwayat.getTop();
    
    if (!curr) {
        elements.historyList.innerHTML = '<p class="empty-state">Belum ada sampel yang selesai</p>';
        return;
    }
    
    while (curr) {
        const html = `
            <div class="list-item">
                <div>
                    <div class="list-item-code">${curr.kode}</div>
                    <div class="list-item-info">
                        <div class="list-item-sender">${curr.pengirim}</div>
                        <div class="list-item-test">${jenisUjiToString(curr.jenisUjiKode)}</div>
                        <div class="list-item-schedule">${formatDateTime(curr.jadwal)}</div>
                    </div>
                </div>
                <div class="list-item-badge" style="background: var(--accent-green);">✓ Selesai</div>
            </div>
        `;
        items.push(html);
        curr = curr.next;
    }
    
    elements.historyList.innerHTML = items.join('');
}

// ====== EVENT HANDLERS ======
function handleAddSample(e) {
    e.preventDefault();
    
    const pengirim = elements.pengirim.value.trim();
    const jenisUji = parseInt(elements.jenisUji.value);
    const jadwal = elements.jadwal.value;
    
    if (!pengirim || !jenisUji || !jadwal) {
        alert('Semua field harus diisi!');
        return;
    }
    
    // Validate name (minimal 3 karakter, hanya huruf, spasi, dash)
    if (pengirim.length < 3) {
        alert('Nama pengirim minimal 3 karakter');
        return;
    }
    
    if (!/^[a-zA-Z\s\-]+$/.test(pengirim)) {
        alert('Nama pengirim hanya boleh mengandung huruf, spasi, dan dash');
        return;
    }
    
    const res = antrean.enqueue(undefined, pengirim, jenisUji, jadwal);
    
    if (res.status) {
        updateStats();
        renderQueueList();
        elements.addSampleForm.reset();
        alert(`Sampel berhasil ditambahkan: ${res.message}`);
    } else {
        alert('Gagal menambahkan sampel: ' + res.message);
    }
}

function handleProcessSample() {
    const res = antrean.dequeue();
    
    if (!res.status) {
        alert(res.message);
        return;
    }
    
    const sample = res.data;
    showConfirm(`Proses sampel ${sample.kode}?`, () => {
        const pushRes = riwayat.push(sample);
        if (pushRes.status) {
            updateStats();
            renderQueueList();
            renderHistoryList();
            alert(`Sampel ${sample.kode} selesai diproses`);
        }
    });
}

function handleSearch() {
    showModal(elements.searchModal);
    elements.searchInput.focus();
    elements.searchInput.value = '';
    elements.searchResults.innerHTML = '';
}

function handleSearchInput(e) {
    const kode = e.target.value.trim();
    
    if (!kode) {
        elements.searchResults.innerHTML = '';
        return;
    }
    
    // Validate format SPL-XXXX
    if (!/^SPL-[0-9]{4}$/.test(kode)) {
        elements.searchResults.innerHTML = '<p style="color: var(--accent-red);">Format: SPL-XXXX</p>';
        return;
    }
    
    // Search in queue
    let found = false;
    let curr = antrean.getHead();
    
    while (curr) {
        if (curr.kode === kode) {
            const html = `
                <div class="search-result-item">
                    <div class="search-result-code">${curr.kode}</div>
                    <div class="search-result-info">
                        <strong>${curr.pengirim}</strong> | ${jenisUjiToString(curr.jenisUjiKode)}
                        <br>Jadwal: ${formatDateTime(curr.jadwal)}
                        <br><span style="color: var(--accent-cyan);">Status: Dalam Antrean (No. ${curr.noAntrean})</span>
                    </div>
                </div>
            `;
            elements.searchResults.innerHTML = html;
            found = true;
            break;
        }
        curr = curr.next;
    }
    
    // Search in history
    if (!found) {
        curr = riwayat.getTop();
        while (curr) {
            if (curr.kode === kode) {
                const html = `
                    <div class="search-result-item">
                        <div class="search-result-code">${curr.kode}</div>
                        <div class="search-result-info">
                            <strong>${curr.pengirim}</strong> | ${jenisUjiToString(curr.jenisUjiKode)}
                            <br>Jadwal: ${formatDateTime(curr.jadwal)}
                            <br><span style="color: var(--accent-green);">Status: ✓ Selesai</span>
                        </div>
                    </div>
                `;
                elements.searchResults.innerHTML = html;
                found = true;
                break;
            }
            curr = curr.next;
        }
    }
    
    if (!found) {
        elements.searchResults.innerHTML = '<p style="color: var(--accent-red);">Sampel tidak ditemukan</p>';
    }
}

function handleClearAll() {
    showConfirm('Hapus semua data? Tindakan ini tidak dapat dibatalkan.', () => {
        location.reload();
    });
}

// ====== EVENT LISTENERS ======
elements.addSampleForm.addEventListener('submit', handleAddSample);
elements.processBtn.addEventListener('click', handleProcessSample);
elements.searchBtn.addEventListener('click', handleSearch);
elements.clearAllBtn.addEventListener('click', handleClearAll);

// Search input real-time
elements.searchInput.addEventListener('input', handleSearchInput);

// Close modals
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        hideModal(modal);
    });
});

// Close modal on background click
[elements.searchModal, elements.confirmModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });
});

// ====== INITIALIZATION ======
updateStats();
renderQueueList();
renderHistoryList();

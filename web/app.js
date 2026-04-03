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
    
    // Visualization
    queueViz: document.getElementById('queueViz'),
    stackViz: document.getElementById('stackViz'),
    
    // Tables
    queueTableBody: document.getElementById('queueTableBody'),
    historyTableBody: document.getElementById('historyTableBody'),
    
    // Code
    codeDisplay: document.getElementById('codeDisplay'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    
    // Modal
    searchModal: document.getElementById('searchModal'),
    searchKode: document.getElementById('searchKode'),
    doSearchBtn: document.getElementById('doSearchBtn'),
    searchResult: document.getElementById('searchResult'),
    closeModal: document.querySelector('.close'),
    
    // Toast
    toast: document.getElementById('toast')
};

// ====== UTILITY FUNCTIONS ======

// Format tanggal untuk display
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Tampilkan toast notification
function showToast(message, type = 'info') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// ====== UPDATE UI FUNCTIONS ======

// Update statistik dashboard
function updateStats() {
    elements.queueCount.textContent = antrean.getSize();
    elements.historyCount.textContent = riwayat.getSize();
    
    // Animate number change
    elements.queueCount.style.transform = 'scale(1.2)';
    elements.historyCount.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        elements.queueCount.style.transform = 'scale(1)';
        elements.historyCount.style.transform = 'scale(1)';
    }, 200);
}

// Render Queue Visualization
function renderQueueViz() {
    const queueArray = antrean.toArray();
    
    if (queueArray.length === 0) {
        elements.queueViz.innerHTML = '<div class="empty-state">Antrean kosong</div>';
        return;
    }
    
    let html = '';
    queueArray.forEach((sample, index) => {
        html += `
            <div class="node">
                <div class="node-box" title="${sample.pengirim} - ${sample.jenisUji}">
                    <div class="node-kode">${sample.kode}</div>
                    <div class="node-pengirim">${sample.pengirim}</div>
                    <div class="node-jenis">${sample.jenisUji}</div>
                </div>
                ${index < queueArray.length - 1 ? '<span class="node-arrow">→</span>' : '<span class="node-arrow">→</span><span class="node-null">null</span>'}
            </div>
        `;
    });
    
    elements.queueViz.innerHTML = html;
}

// Render Stack Visualization
function renderStackViz() {
    const stackArray = riwayat.toArray();
    
    if (stackArray.length === 0) {
        elements.stackViz.innerHTML = '<div class="empty-state">Riwayat kosong</div>';
        return;
    }
    
    let html = '';
    stackArray.forEach((sample, index) => {
        html += `
            <div class="node">
                <div class="node-box" title="${sample.pengirim} - ${sample.jenisUji}" style="border-color: ${index === 0 ? '#a371f7' : ''}">
                    <div class="node-kode">${sample.kode}</div>
                    <div class="node-pengirim">${sample.pengirim}</div>
                    <div class="node-jenis">${sample.jenisUji}</div>
                </div>
                ${index < stackArray.length - 1 ? '<span class="node-arrow">→</span>' : '<span class="node-arrow">→</span><span class="node-null">null</span>'}
            </div>
        `;
    });
    
    elements.stackViz.innerHTML = html;
}

// Render Queue Table
function renderQueueTable() {
    const queueArray = antrean.toArray();
    
    if (queueArray.length === 0) {
        elements.queueTableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">Tidak ada sampel dalam antrean</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    queueArray.forEach((sample, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${sample.kode}</strong></td>
                <td>${sample.pengirim}</td>
                <td>${sample.jenisUji}</td>
                <td>${formatDate(sample.jadwal)}</td>
            </tr>
        `;
    });
    
    elements.queueTableBody.innerHTML = html;
}

// Render History Table
function renderHistoryTable() {
    const historyArray = riwayat.toArray();
    
    if (historyArray.length === 0) {
        elements.historyTableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="5">Belum ada sampel yang diproses</td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    historyArray.forEach((sample, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${sample.kode}</strong></td>
                <td>${sample.pengirim}</td>
                <td>${sample.jenisUji}</td>
                <td>${formatDate(sample.jadwal)}</td>
            </tr>
        `;
    });
    
    elements.historyTableBody.innerHTML = html;
}

// Update all UI components
function updateUI() {
    updateStats();
    renderQueueViz();
    renderStackViz();
    renderQueueTable();
    renderHistoryTable();
}

// ====== EVENT HANDLERS ======

// Handle form submission - Add new sample
elements.addSampleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pengirim = elements.pengirim.value.trim();
    const jenisUjiKode = parseInt(elements.jenisUji.value);
    const jadwal = elements.jadwal.value;
    
    // Validasi input (kode tidak perlu, auto-generated!)
    if (!pengirim || !jenisUjiKode || !jadwal) {
        showToast('Mohon lengkapi semua field!', 'error');
        return;
    }
    
    // Enqueue sampel baru (kode auto-generated di constructor)
    const result = antrean.enqueue(pengirim, jenisUjiKode, jadwal);
    
    if (result.status) {
        showToast(`${result.message}`, 'success');
        
        // Reset form
        elements.addSampleForm.reset();
        
        // Update UI
        updateUI();
    }
});

// Handle process button - Dequeue and push to stack
elements.processBtn.addEventListener('click', async () => {
    if (antrean.isEmpty()) {
        showToast('Antrean kosong, tidak ada sampel untuk diproses!', 'error');
        return;
    }
    
    // Disable button during processing
    elements.processBtn.disabled = true;
    elements.processBtn.innerHTML = '<span class="btn-icon">...</span> Memproses...';
    
    // Animate first node
    const firstNode = elements.queueViz.querySelector('.node-box');
    if (firstNode) {
        firstNode.classList.add('node-processing');
    }
    
    // Delay untuk animasi
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Dequeue dari antrean
    const dequeueResult = antrean.dequeue();
    
    if (dequeueResult.status) {
        // Push ke stack riwayat
        const pushResult = riwayat.push(dequeueResult.data);
        
        showToast(`${dequeueResult.message} ${pushResult.message}`, 'success');
        
        // Update UI
        updateUI();
    }
    
    // Re-enable button
    elements.processBtn.disabled = false;
    elements.processBtn.innerHTML = '<span class="btn-icon">>></span> Proses Sampel';
});

// Handle search button - Open modal
elements.searchBtn.addEventListener('click', () => {
    elements.searchModal.classList.add('show');
    elements.searchKode.focus();
    elements.searchResult.classList.remove('show');
});

// Handle search execution
elements.doSearchBtn.addEventListener('click', () => {
    const kode = elements.searchKode.value.trim();
    
    if (!kode) {
        showToast('Masukkan kode sampel untuk mencari!', 'error');
        return;
    }
    
    const result = antrean.search(kode);
    
    elements.searchResult.classList.add('show');
    
    if (result.status) {
        elements.searchResult.classList.remove('not-found');
        elements.searchResult.classList.add('found');
        elements.searchResult.innerHTML = `
            <strong style="color: var(--accent-green);">Ditemukan!</strong>
            <div style="margin-top: 10px;">
                <p><strong>Kode:</strong> ${result.data.kode}</p>
                <p><strong>Pengirim:</strong> ${result.data.pengirim}</p>
                <p><strong>Jenis Uji:</strong> ${result.data.jenisUji}</p>
                <p><strong>Jadwal:</strong> ${formatDate(result.data.jadwal)}</p>
                <p><strong>Posisi dalam antrean:</strong> ${result.position}</p>
            </div>
        `;
    } else {
        elements.searchResult.classList.remove('found');
        elements.searchResult.classList.add('not-found');
        elements.searchResult.innerHTML = `
            <strong style="color: var(--accent-red);">Tidak Ditemukan</strong>
            <p style="margin-top: 10px;">${result.message}</p>
        `;
    }
});

// Handle search on enter key
elements.searchKode.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.doSearchBtn.click();
    }
});

// Handle modal close
elements.closeModal.addEventListener('click', () => {
    elements.searchModal.classList.remove('show');
    elements.searchKode.value = '';
    elements.searchResult.classList.remove('show');
});

// Close modal on outside click
elements.searchModal.addEventListener('click', (e) => {
    if (e.target === elements.searchModal) {
        elements.searchModal.classList.remove('show');
    }
});

// Handle clear all button
elements.clearAllBtn.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
        antrean.clear();
        riwayat.clear();
        updateUI();
        showToast('Semua data telah direset!', 'info');
    }
});

// Handle code tabs
elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all
        elements.tabBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        // Update code display
        const tab = btn.dataset.tab;
        elements.codeDisplay.innerHTML = `<code>${codeSnippets[tab]}</code>`;
    });
});

// ====== INITIALIZE ======
document.addEventListener('DOMContentLoaded', () => {
    // Set default datetime to now
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    elements.jadwal.value = now.toISOString().slice(0, 16);
    
    // Add some demo data
    antrean.enqueue('PT. Baja Utama', 1, '2024-03-15T09:00');
    antrean.enqueue('CV. Metal Jaya', 3, '2024-03-15T10:30');
    antrean.enqueue('PT. Steel Indo', 4, '2024-03-15T14:00');
    
    // Initial UI update
    updateUI();
    
    console.log('Lab Material - Sistem Antrean Sampel Laboratorium');
    console.log('Linked List Implementation Ready!');
});

// js/ui.js

const historyList = document.getElementById('history-list');
const scannerContainer = document.getElementById('scanner-container');
const scanResultEl = document.getElementById('scan-result');

export function renderHistory(items) {
    historyList.innerHTML = ''; // Vide la liste actuelle
    if (items.length === 0) {
        historyList.innerHTML = '<li>Aucun élément dans l\'historique.</li>';
        return;
    }
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.value}</strong><br>
            <small>${item.type} - ${new Date(item.timestamp).toLocaleString()}</small>
        `;
        historyList.appendChild(li);
    });
}

export function showScanner() {
    scannerContainer.classList.remove('hidden');
}

export function hideScanner() {
    scannerContainer.classList.add('hidden');
}

export function displayScanResult(result) {
    scanResultEl.textContent = result ? `Dernier scan : ${result}` : '';
}

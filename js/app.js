// js/app.js
import { db } from './db.js';
import { Scanner } from './scanner.js';
import { renderHistory, showScanner, hideScanner, displayScanResult } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // Enregistrement du Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker enregistré'))
            .catch(err => console.error('Erreur Service Worker:', err));
    }

    // Références DOM
    const startScanBtn = document.getElementById('start-scan-btn');
    const videoEl = document.getElementById('scanner-video');
    const canvasEl = document.getElementById('scanner-canvas');
    const exportBtn = document.getElementById('export-btn');
    const filterInput = document.getElementById('filter-input');
    
    let lastScanResult = null;

    // --- Fonctions principales ---
    
    async function refreshHistory() {
        const filterValue = filterInput.value;
        let items;
        if (filterValue) {
            items = await db.scannedItems
                .where('value')
                .startsWithIgnoreCase(filterValue)
                .reverse()
                .toArray();
        } else {
            items = await db.scannedItems.reverse().toArray();
        }
        renderHistory(items);
    }
    
    async function onScanSuccess(value) {
        if (value === lastScanResult) return;
        lastScanResult = value;

        hideScanner();
        startScanBtn.disabled = false;
        displayScanResult(value);
        
        try {
            await db.scannedItems.add({
                type: 'qrcode',
                value: value,
                timestamp: new Date(),
                metadata: { source: 'camera' }
            });
            console.log('Item sauvegardé !');
            refreshHistory();
        } catch (error) {
            console.error('Erreur de sauvegarde :', error);
        }
    }

    // Initialisation du scanner
    const scanner = new Scanner(videoEl, canvasEl, onScanSuccess);

    // --- Écouteurs d'événements ---

    startScanBtn.addEventListener('click', () => {
        startScanBtn.disabled = true;
        displayScanResult('');
        showScanner();
        scanner.start().catch(err => {
            alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
            startScanBtn.disabled = false;
            hideScanner();
        });
    });

    filterInput.addEventListener('input', refreshHistory);

    exportBtn.addEventListener('click', async () => {
        const allItems = await db.scannedItems.toArray();
        const dataStr = JSON.stringify(allItems, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inventaire.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // --- Initialisation ---
    refreshHistory();
});

// js/db.js

// Dexie est disponible globalement car importé via <script> dans l'HTML
export const db = new Dexie('inventoryAppDB');

db.version(1).stores({
  scannedItems: '++id, value, type, timestamp'
});

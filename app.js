// =====================
// IndexedDB Setup
// =====================
let db;
const request = indexedDB.open('scoutingDB', 1);

request.onupgradeneeded = (event) => {
  db = event.target.result;
  if (!db.objectStoreNames.contains('scoutingData')) {
    const store = db.createObjectStore('scoutingData', { keyPath: 'id', autoIncrement: true });
    store.createIndex('synced', 'synced', { unique: false });
  }
};

request.onsuccess = (event) => {
  db = event.target.result;
  loadAndRenderData();
};

request.onerror = (event) => {
  console.error('IndexedDB error:', event.target.errorCode);
};

// =====================
// Login Handling
// =====================
const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const loginBtn = document.getElementById('loginBtn');
const welcomeMessage = document.getElementById('welcomeMessage');

const savedScout = localStorage.getItem('scoutName');
if (savedScout) {
  loginSection.style.display = 'none';
  mainApp.style.display = 'block';
  welcomeMessage.textContent = `Logged in as: ${savedScout}`;
}

loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert('Enter a username');
  localStorage.setItem('scoutName', username);
  loginSection.style.display = 'none';
  mainApp.style.display = 'block';
  welcomeMessage.textContent = `Logged in as: ${username}`;
});

// =====================
// Helper Functions
// =====================
function saveEntry(entry) {
  const transaction = db.transaction(['scoutingData'], 'readwrite');
  const store = transaction.objectStore('scoutingData');
  store.add(entry);
  transaction.oncomplete = () => loadAndRenderData();
}

function getAllEntries(callback) {
  const transaction = db.transaction(['scoutingData'], 'readonly');
  const store = transaction.objectStore('scoutingData');
  const request = store.getAll();
  request.onsuccess = () => callback(request.result);
}

// =====================
// Render Tables
// =====================
function renderTables(data) {
  const unsyncedTbody = document.querySelector('#unsyncedTable tbody');
  const syncedTbody = document.querySelector('#syncedTable tbody');
  unsyncedTbody.innerHTML = '';
  syncedTbody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.matchNumber}</td>
      <td>${row.team}</td>
      <td>${row.l1}</td>
      <td>${row.l2}</td>
      <td>${row.l3}</td>
      <td>${row.l4}</td>
      <td>${row.climb}</td>
    `;
    if (row.synced) syncedTbody.appendChild(tr);
    else unsyncedTbody.appendChild(tr);
  });
}

function loadAndRenderData() {
  getAllEntries(renderTables);
}

// =====================
// Save New Entry
// =====================
document.getElementById('scoutingForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const entry = {
    scout: localStorage.getItem('scoutName'),
    matchNumber: document.getElementById('matchNumber').value,
    team: document.getElementById('teamNumber').value,
    l1: document.getElementById('l1').value,
    l2: document.getElementById('l2').value,
    l3: document.getElementById('l3').value,
    l4: document.getElementById('l4').value,
    climb: document.getElementById('climb').checked,
    synced: false
  };
  saveEntry(entry);
  this.reset();
  alert('Saved locally!');
});

// =====================
// Sync to Google Sheets
// =====================
async function syncToSheets(entries) {
  if (!navigator.onLine) return alert("No internet connection. Data will sync later.");

  const webAppUrl = "https://script.google.com/macros/s/AKfycbxSBrkraioDlIbD9L3dUdiU6a1hWs54buut3raV7W3Rmhy7P1i4b4r7qlvXUa13vsqGTQ/exec";

  try {
    const response = await fetch(webAppUrl, {
      method: "POST",
      body: JSON.stringify(entries),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();
    if (result.status === 'success') {
      const transaction = db.transaction(['scoutingData'], 'readwrite');
      const store = transaction.objectStore('scoutingData');
      entries.forEach(entry => {
        entry.synced = true;
        store.put(entry);
      });
      transaction.oncomplete = () => loadAndRenderData();
      alert("Data synced successfully!");
    }
  } catch (err) {
    console.error("Error syncing:", err);
    alert("Sync failed. Will try again later.");
  }
}

// =====================
// Export Button
// =====================
document.getElementById('exportBtn').addEventListener('click', function() {
  const transaction = db.transaction(['scoutingData'], 'readonly');
  const store = transaction.objectStore('scoutingData');
  const index = store.index('synced');
  const request = index.getAll(IDBKeyRange.only(false));

  request.onsuccess = () => {
    const unsyncedEntries = request.result;
    if (!unsyncedEntries.length) return alert('No new data to export');
    syncToSheets(unsyncedEntries);
  };
});

// =====================
// Initial Render
// =====================
loadAndRenderData();

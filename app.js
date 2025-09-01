// Simple offline-first PWA skeleton

// ----- Login -----
const loginSection = document.getElementById('loginSection');
const mainApp = document.getElementById('mainApp');
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  if (!username) return alert('Enter a username');
  localStorage.setItem('scoutName', username);
  loginSection.style.display = 'none';
  mainApp.style.display = 'block';
});

// ----- Load existing data -----
let scoutingData = JSON.parse(localStorage.getItem('scoutingData')) || [];

function renderTables() {
  const unsyncedTbody = document.querySelector('#unsyncedTable tbody');
  const syncedTbody = document.querySelector('#syncedTable tbody');
  unsyncedTbody.innerHTML = '';
  syncedTbody.innerHTML = '';

  scoutingData.forEach(row => {
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

// ----- Save new entry -----
document.getElementById('scoutingForm').addEventListener('submit', function(e){
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
  scoutingData.push(entry);
  localStorage.setItem('scoutingData', JSON.stringify(scoutingData));
  renderTables();
  this.reset();
  alert('Saved locally!');
});

// ----- Export data (placeholder for future Sheets sync) -----
document.getElementById('exportBtn').addEventListener('click', function(){
  let csv = 'Match,Team,l1,l2,l3,l4,Climb\n';
  scoutingData.forEach(row => {
    if (!row.synced) {
      csv += `${row.matchNumber},${row.team},${row.l1},${row.l2},${row.l3},${row.l4},${row.climb}\n`;
      row.synced = true;
    }
  });
  localStorage.setItem('scoutingData', JSON.stringify(scoutingData));
  renderTables();

  // Download CSV as backup
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'scoutingData.csv';
  link.click();
});

// ----- Render on load -----
renderTables();

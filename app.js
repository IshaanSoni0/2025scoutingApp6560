// Load existing data or start empty
let scoutingData = JSON.parse(localStorage.getItem("scoutingData")) || [];

// Function to render the tables
function renderTables() {
  const unsyncedTbody = document.querySelector("#unsyncedTable tbody");
  const syncedTbody = document.querySelector("#syncedTable tbody");
  unsyncedTbody.innerHTML = "";
  syncedTbody.innerHTML = "";

  scoutingData.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.team}</td>
      <td>${row.l1}</td>
      <td>${row.l2}</td>
      <td>${row.l3}</td>
      <td>${row.l4}</td>
      <td>${row.climb}</td>
    `;
    if (row.synced) {
      syncedTbody.appendChild(tr);
    } else {
      unsyncedTbody.appendChild(tr);
    }
  });
}

// Save new entry
document.getElementById("scoutingForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const entry = {
    team: document.getElementById("teamNumber").value,
    l1: document.getElementById("l1").value,
    l2: document.getElementById("l2").value,
    l3: document.getElementById("l3").value,
    l4: document.getElementById("l4").value,
    climb: document.getElementById("climb").checked,
    synced: false
  };
  scoutingData.push(entry);
  localStorage.setItem("scoutingData", JSON.stringify(scoutingData));
  renderTables();
  alert("Saved!");
  document.getElementById("scoutingForm").reset();
});

// Export unsynced entries
document.getElementById("exportBtn").addEventListener("click", function() {
  let csv = "Team,l1,l2,l3,l4,Climb\n";
  scoutingData.forEach(row => {
    if (!row.synced) {
      csv += `${row.team},${row.l1},${row.l2},${row.l3},${row.l4},${row.climb}\n`;
      row.synced = true; // mark as exported
    }
  });

  localStorage.setItem("scoutingData", JSON.stringify(scoutingData));
  renderTables();

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "scoutingData.csv";
  link.click();
});

// Render tables on page load
renderTables();

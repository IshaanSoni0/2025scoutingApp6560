// Load existing data from localStorage or start empty
let scoutingData = JSON.parse(localStorage.getItem("scoutingData")) || [];

// Function to render table with only unsynced entries
function renderTable() {
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = ""; // clear current table
  scoutingData.forEach((row, index) => {
    if (!row.synced) { // only show unsynced entries
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.team}</td>
        <td>${row.l1}</td>
        <td>${row.l2}</td>
        <td>${row.l3}</td>
        <td>${row.l4}</td>
        <td>${row.climb}</td>
      `;
      tbody.appendChild(tr);
    }
  });
}

// Save form data
document.getElementById("scoutingForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const entry = {
    team: document.getElementById("teamNumber").value,
    l1: document.getElementById("l1").value,
    l2: document.getElementById("l2").value,
    l3: document.getElementById("l3").value,
    l4: document.getElementById("l4").value,
    climb: document.getElementById("climb").checked,
    synced: false // mark as unsynced
  };
  
  scoutingData.push(entry);
  localStorage.setItem("scoutingData", JSON.stringify(scoutingData));
  renderTable(); // update table immediately
  alert("Saved!");
  document.getElementById("scoutingForm").reset();
});

// Export data as CSV
document.getElementById("exportBtn").addEventListener("click", function() {
  let csv = "Team,l1,l2,l3,l4,Climb\n";
  // Only export unsynced entries
  scoutingData.forEach(row => {
    if (!row.synced) {
      csv += `${row.team},${row.l1},${row.l2},${row.l3},${row.l4},${row.climb}\n`;
      row.synced = true; // mark as exported
    }
  });

  localStorage.setItem("scoutingData", JSON.stringify(scoutingData)); // save updated synced flags

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "scoutingData.csv";
  link.click();

  renderTable(); // update table to remove exported entries
});

// Render table on page load
renderTable();

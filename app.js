let scoutingData = [];

document.getElementById("scoutingForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const entry = {
    team: document.getElementById("teamNumber").value,
    autoCones: document.getElementById("autoCones").value,
    climb: document.getElementById("climb").checked
  };
  scoutingData.push(entry);
  alert("Saved!");
});

// Export data as CSV
document.getElementById("exportBtn").addEventListener("click", function() {
  let csv = "Team,l1,l2,l3,l4,Climb\n";
  scoutingData.forEach(row => {
    csv += `${row.team},${row.autoCones},${row.climb}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "scoutingData.csv";
  link.click();
});

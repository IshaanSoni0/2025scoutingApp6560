let scoutingData = JSON.parse(localStorage.getItem("scoutingData")) || [];

// Update localStorage every time we add a new entry
document.getElementById("scoutingForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const entry = {
    team: document.getElementById("teamNumber").value,
    l1: document.getElementById("l1").value,
    l2: document.getElementById("l2").value,
    l3: document.getElementById("l3").value,
    l4: document.getElementById("l4").value,
    climb: document.getElementById("climb").checked
  };
  
  scoutingData.push(entry);
  localStorage.setItem("scoutingData", JSON.stringify(scoutingData)); // save persistently

  alert("Saved!");
  document.getElementById("scoutingForm").reset();
});

// Export data as CSV
document.getElementById("exportBtn").addEventListener("click", function() {
  let csv = "Team,l1,l2,l3,l4,Climb\n";
  scoutingData.forEach(row => {
    csv += `${row.team},${row.l1},${row.l2},${row.l3},${row.l4},${row.climb}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "scoutingData.csv";
  link.click();
});

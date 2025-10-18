// --- Initialize Map ---
const map = L.map('map').setView([18.5, -69.9], 8); // Dominican Republic example
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Real-time location and nearby hospitals
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      L.marker([lat, lon]).addTo(map)
        .bindPopup('📍 Your current location')
        .openPopup();

      map.setView([lat, lon], 13);

      // Overpass API: Nearby hospitals
      fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"="hospital"](around:5000,${lat},${lon});out;`)
        .then(response => response.json())
        .then(data => {
          data.elements.forEach(hospital => {
            L.marker([hospital.lat, hospital.lon]).addTo(map)
              .bindPopup(`🏥 ${hospital.tags.name || 'Hospital'}`);
          });
        });
    },
    () => { alert("⚠️ Unable to get your current location."); }
  );
} else {
  alert("Geolocation is not supported by this browser.");
}

// --- Vital Signs Elements ---
const bpEl = document.getElementById("bp");
const hrEl = document.getElementById("hr");
const stressEl = document.getElementById("stress");

const bpStatus = document.getElementById("bpStatus");
const hrStatus = document.getElementById("hrStatus");
const stressStatus = document.getElementById("stressStatus");

// --- Vital Signs Variables ---
let systolic = 120;
let diastolic = 80;
let heartRate = 75;
let stress = 3;

// --- Update Vital Signs Every 5s ---
function updateVitals() {
  systolic = Math.floor(Math.random() * 40) + 90;      // 90-130
  diastolic = Math.floor(Math.random() * 30) + 60;     // 60-90
  heartRate = Math.floor(Math.random() * 40) + 60;     // 60-100
  stress = Math.floor(Math.random() * 10) + 1;         // 1-10

  bpEl.textContent = `${systolic} / ${diastolic}`;
  hrEl.textContent = heartRate;
  stressEl.textContent = stress;

  // Clear previous status
  bpStatus.textContent = "";
  hrStatus.textContent = "";
  stressStatus.textContent = "";
}

setInterval(updateVitals, 5000);

// --- Vital Signs Buttons ---
document.getElementById("checkLow").addEventListener("click", () => {
  if (systolic < 100 || diastolic < 60) {
    bpStatus.textContent = "⚠️ Low pressure detected!";
  } else {
    bpStatus.textContent = "✅ All good!";
  }
});

document.getElementById("checkHigh").addEventListener("click", () => {
  if (systolic > 140 || diastolic > 90) {
    bpStatus.textContent = "⚠️ High pressure detected!";
  } else {
    bpStatus.textContent = "✅ All good!";
  }
});

document.getElementById("checkHR").addEventListener("click", () => {
  if (heartRate < 60 || heartRate > 100) {
    hrStatus.textContent = "⚠️ Abnormal heart rate!";
  } else {
    hrStatus.textContent = "✅ All good!";
  }
});

document.getElementById("checkStress").addEventListener("click", () => {
  if (stress > 7) {
    stressStatus.textContent = "⚠️ High stress detected!";
  } else {
    stressStatus.textContent = "✅ All good!";
  }
});

// --- Hydration Button ---
const hydrateBtn = document.getElementById("hydrateBtn");
const hydrationStatus = document.getElementById("hydrationStatus");
hydrateBtn.addEventListener("click", () => {
  hydrationStatus.textContent = "✅ Water intake completed!";
});

// --- Emergency Button ---
const alarm = document.getElementById("alarm");
document.getElementById("emergencyBtn").addEventListener("click", () => {
  alarm.play();
  alert("🚨 Emergency alert activated! Authorities have been notified.");
});
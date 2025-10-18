// Initialize Map
const map = L.map('map').setView([18.5, -69.9], 8); // Dominican Republic example
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Real-time location and hospitals
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

// Vital Signs Simulation & Alerts
const bpEl = document.getElementById("bp");
const hrEl = document.getElementById("hr");
const stressEl = document.getElementById("stress");
const healthySection = document.getElementById("healthyHabits");

function updateVitals() {
  const systolic = Math.floor(Math.random() * 40) + 90;
  const diastolic = Math.floor(Math.random() * 30) + 60;
  const heartRate = Math.floor(Math.random() * 40) + 60;
  const stress = Math.floor(Math.random() * 10) + 1;

  bpEl.textContent = `${systolic} / ${diastolic}`;
  hrEl.textContent = heartRate;
  stressEl.textContent = stress;

  // Dynamic Recommendations
  let foodAdvice = "";
  let exerciseAdvice = "";
  let alertMsg = "";

  // Blood Pressure
  if (systolic < 100 || diastolic < 60) {
    foodAdvice += "Eat bananas, spinach, oats, eggs. ";
    alertMsg += "⚠️ Low blood pressure detected! ";
  } else if (systolic > 140 || diastolic > 90) {
    foodAdvice += "Eat berries, beetroot, fish rich in omega-3. ";
    alertMsg += "⚠️ High blood pressure detected! ";
  }

  // Stress
  if (stress > 7) {
    exerciseAdvice += "Do deep breathing, short walks, yoga, or meditation. ";
    alertMsg += "⚠️ High stress detected! ";
  }

  healthySection.innerHTML = `
    <h2>🥗 Healthy Habits</h2>
    <div>
      <h3>Recommended Foods</h3>
      <p>${foodAdvice || "Balanced diet recommended."}</p>
    </div>
    <div>
      <h3>Stress Relief Exercises</h3>
      <p>${exerciseAdvice || "Keep a relaxed daily routine."}</p>
    </div>
    <div>
      <h3>Hydration Reminder</h3>
      <p>Press the button every time you drink water to keep track of hydration.</p>
      <button id="hydrateBtn">I Drank Water 💧</button>
      <p id="hydrationStatus">Not yet completed</p>
    </div>
  `;

  // Emergency Alerts
  if (alertMsg) alert(alertMsg);

  // Reassign hydration button listener
  const hydrateBtn = document.getElementById("hydrateBtn");
  const hydrationStatus = document.getElementById("hydrationStatus");
  hydrateBtn.addEventListener("click", () => {
    hydrationStatus.textContent = "✅ Water intake completed!";
  });
}
setInterval(updateVitals, 5000);

// Emergency Button
const alarm = document.getElementById("alarm");
document.getElementById("emergencyBtn").addEventListener("click", () => {
  alarm.play();
  alert("🚨 Emergency alert activated! Authorities have been notified.");
});
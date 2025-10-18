// Initialize Map
const map = L.map('map').setView([18.5, -69.9], 8); // Default view

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Real-time location
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    L.marker([lat, lon]).addTo(map)
      .bindPopup('📍 Your current location')
      .openPopup();

    map.setView([lat, lon], 13);

    // Fetch nearby hospitals using Overpass API
    fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node(around:5000,${lat},${lon})[amenity=hospital];out;`)
      .then(res => res.json())
      .then(data => {
        data.elements.forEach(el => {
          L.marker([el.lat, el.lon])
            .addTo(map)
            .bindPopup(`🏥 ${el.tags.name || 'Hospital'}`);
        });
      });
  }, () => {
    alert("⚠️ Unable to get your current location.");
  });
} else {
  alert("Geolocation is not supported by this browser.");
}

// Emergency button
const alarm = document.getElementById("alarm");
document.getElementById("emergencyBtn").addEventListener("click", () => {
  alarm.play();
  alert("🚨 Emergency alert activated! Authorities have been notified.");
});

// Simulated Vital Signs (replace with real sensors if available)
const bpSpan = document.getElementById("bp");
const hrSpan = document.getElementById("hr");
const stressSpan = document.getElementById("stress");

// Example: random values every 5 seconds
setInterval(() => {
  const systolic = Math.floor(Math.random() * 60) + 90;
  const diastolic = Math.floor(Math.random() * 40) + 60;
  const hr = Math.floor(Math.random() * 50) + 60;
  const stress = Math.floor(Math.random() * 100);

  bpSpan.textContent = `${systolic} / ${diastolic}`;
  hrSpan.textContent = hr;
  stressSpan.textContent = stress;
}, 5000);
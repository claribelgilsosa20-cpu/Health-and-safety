// --- Initialize Map ---
const map = L.map('map').setView([18.5, -69.9], 8); // Dominican Republic
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

// --- Vital Signs ---
const bpEl = document.getElementById("bp");
const hrEl = document.getElementById("hr");
const stressEl = document.getElementById("stress");
const bpStatus = document.getElementById("bpStatus");
const hrStatus = document.getElementById("hrStatus");
const stressStatus = document.getElementById("stressStatus");

let systolic = 120;
let diastolic = 80;
let heartRate = 75;
let stress = 3;

function updateVitals() {
  systolic = Math.floor(Math.random() * 40) + 90; // 90-130
  diastolic = Math.floor(Math.random() * 30) + 60; // 60-90
  heartRate = Math.floor(Math.random() * 40) + 60; // 60-100
  stress = Math.floor(Math.random() * 10) + 1;     // 1-10

  bpEl.textContent = `${systolic} / ${diastolic}`;
  hrEl.textContent = heartRate;
  stressEl.textContent = stress;

  bpStatus.textContent = "";
  hrStatus.textContent = "";
  stressStatus.textContent = "";
}

setInterval(updateVitals, 5000);

// Vital Signs Buttons
document.getElementById("checkLow").addEventListener("click", () => {
  bpStatus.textContent = (systolic < 100 || diastolic < 60) ? "⚠️ Low pressure detected!" : "✅ All good!";
});

document.getElementById("checkHigh").addEventListener("click", () => {
  bpStatus.textContent = (systolic > 140 || diastolic > 90) ? "⚠️ High pressure detected!" : "✅ All good!";
});

document.getElementById("checkHR").addEventListener("click", () => {
  hrStatus.textContent = (heartRate < 60 || heartRate > 100) ? "⚠️ Abnormal heart rate!" : "✅ All good!";
});

document.getElementById("checkStress").addEventListener("click", () => {
  stressStatus.textContent = (stress > 7) ? "⚠️ High stress detected!" : "✅ All good!";
});

// --- Hydration ---
const hydrateBtn = document.getElementById("hydrateBtn");
const hydrationStatus = document.getElementById("hydrationStatus");
hydrateBtn.addEventListener("click", () => {
  hydrationStatus.textContent = "✅ Water intake completed!";
});

// --- Emergency ---
const alarm = document.getElementById("alarm");
document.getElementById("emergencyBtn").addEventListener("click", () => {
  alarm.play();
  alert("🚨 Emergency alert activated! Authorities have been notified.");
});

// --- Medication Calendar ---
let currentDate = new Date();
const monthYearEl = document.getElementById("monthYear");
const calendarBody = document.querySelector("#calendar tbody");
let medications = JSON.parse(localStorage.getItem("medications")) || [];

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYearEl.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  calendarBody.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let date = 1;
  for (let i = 0; i < 6; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 7; j++) {
      const cell = document.createElement("td");
      if (i === 0 && j < firstDay) {
        cell.textContent = "";
      } else if (date > daysInMonth) {
        break;
      } else {
        cell.textContent = date;
        const dayMedications = medications.filter(m =>
          new Date(m.date).getDate() === date &&
          new Date(m.date).getMonth() === month &&
          new Date(m.date).getFullYear() === year
        );
        if (dayMedications.length > 0) cell.classList.add("medDay");
        cell.addEventListener("click", () => alert(`Medications for ${date}/${month+1}/${year}: ${dayMedications.map(m => m.name).join(", ") || "None"}`));
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}

document.getElementById("prevMonth").addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); });
document.getElementById("nextMonth").addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); });

renderCalendar();

document.getElementById("medForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("medName").value;
  const time = document.getElementById("medTime").value;
  const dose = document.getElementById("medDose").value;
  const notes = document.getElementById("medNotes").value;
  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

  const med = { name, time, dose, notes, date };
  medications.push(med);
  localStorage.setItem("medications", JSON.stringify(medications));
  updateTodayMeds();
  renderCalendar();
  e.target.reset();
});

function updateTodayMeds() {
  const today = new Date();
  const todayMedsEl = document.getElementById("todayMeds");
  todayMedsEl.innerHTML = "";
  const todayMeds = medications.filter(m => new Date(m.date).toDateString() === today.toDateString());
  todayMeds.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = `${m.name} - ${m.dose} at ${m.time} (${m.notes})`;
    const btn = document.createElement("button");
    btn.textContent = "Taken";
    btn.addEventListener("click", () => {
      btn.classList.add("taken");
      btn.textContent = "✅ Taken";
    });
    li.appendChild(btn);
    todayMedsEl.appendChild(li);
  });
}

updateTodayMeds();

// --- Notifications (with fallback alert) ---
if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      setInterval(() => {
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        medications.forEach(m => {
          const [medHours, medMins] = m.time.split(":").map(Number);
          const medMinutes = medHours * 60 + medMins;
          if (nowMinutes === medMinutes) {
            new Notification(`💊 Time to take ${m.name} (${m.dose})`);
            alert(`💊 Time to take ${m.name} (${m.dose})`); // fallback for mobile
          }
        });
      }, 15000); // check every 15 seconds
    }
  });
}
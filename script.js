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
});// Calendar setup
let currentDate = new Date();
const monthYearEl = document.getElementById("monthYear");
const calendarBody = document.querySelector("#calendar tbody");
let medications = JSON.parse(localStorage.getItem("medications")) || [];

// Render calendar
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYearEl.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  calendarBody.innerHTML = "";
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  let date = 1;
  for(let i=0; i<6; i++) {
    const row = document.createElement("tr");
    for(let j=0; j<7; j++) {
      const cell = document.createElement("td");
      if(i === 0 && j < firstDay) {
        cell.textContent = "";
      } else if(date > daysInMonth) {
        break;
      } else {
        cell.textContent = date;
        const dayMedications = medications.filter(m => new Date(m.date).getDate() === date && new Date(m.date).getMonth() === month && new Date(m.date).getFullYear() === year);
        if(dayMedications.length > 0) {
          cell.classList.add("medDay");
        }
        cell.addEventListener("click", () => alert(`Medications for ${date}/${month+1}/${year}: ${dayMedications.map(m=>m.name).join(", ") || "None"}`));
        date++;
      }
      row.appendChild(cell);
    }
    calendarBody.appendChild(row);
  }
}

// Navigation buttons
document.getElementById("prevMonth").addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(); });
document.getElementById("nextMonth").addEventListener("click", () => { currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(); });

renderCalendar();

// Add medication
document.getElementById("medForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("medName").value;
  const time = document.getElementById("medTime").value;
  const dose = document.getElementById("medDose").value;
  const notes = document.getElementById("medNotes").value;
  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
  const med = {name, time, dose, notes, date};
  medications.push(med);
  localStorage.setItem("medications", JSON.stringify(medications));
  updateTodayMeds();
  renderCalendar();
  e.target.reset();
});

// Display today's medications
function updateTodayMeds() {
  const today = new Date();
  const todayMedsEl = document.getElementById("todayMeds");
  todayMedsEl.innerHTML = "";
  const todayMeds = medications.filter(m => new Date(m.date).toDateString() === today.toDateString());
  todayMeds.forEach((m, index) => {
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

// Notifications
if("Notification" in window) {
  Notification.requestPermission();
  setInterval(()=>{
    const now = new Date();
    const nowTime = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');
    medications.forEach(m=>{
      const medTime = m.time;
      if(nowTime === medTime){
        new Notification(`💊 Time to take ${m.name} (${m.dose})`);
      }
    });
  }, 60000);
}
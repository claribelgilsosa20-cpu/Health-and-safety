# Health & Safety

## Inspiration
Health & Safety was born from the desire to make everyday safety and wellbeing accessible to everyone. We saw how stress, lack of preparation, and emergency confusion can cause real harm — so we built a simple, practical web tool that teaches, monitors, and helps in critical moments.

## What it does
Health & Safety is a web application that:
- Shows nearby hospitals on a live map (real-time location).
- Simulates and displays vital signs (blood pressure, heart rate, stress level).
- Offers first-aid guidance and short stress-relief exercises.
- Provides an AI chatbot for quick advice on emergencies, first-aid steps, and wellness tips.
- Includes hydration tracking and medication reminders.
- Lets users schedule and track health events (calendar/medication reminders).
- Contains an emergency button that triggers an audible alert and notifies contacts.

## Key features
- **Interactive map** with OpenStreetMap + Overpass API to find hospitals.
- **Real-time location tracking** using browser geolocation.
- **Simulated vital signs** and quick-check buttons for high/low pressure, heart rate, and stress.
- **Hydration tracker** — mark water intake as completed.
- **Medication calendar** with local storage and push notification reminders.
- **AI Health Assistant** (embed or API) to answer health & safety questions.
- **Emergency alarm** and quick call links for medical contacts.

## How we built it
- **Frontend:** HTML, CSS (modern responsive design), JavaScript, Leaflet (maps).
- **APIs / Tools:** OpenStreetMap tiles + Overpass API, Browser Geolocation, Web Notifications API.
- **Chatbot:** Hugging Face Space embed or any LLM endpoint (optional integration).
- **Persistence:** LocalStorage for user reminders and calendar entries.
- **Optional Backend:** small Node/Flask service if you want to proxy or secure AI keys.

## Challenges we ran into
- Making the UI calming, clear and accessible under stress.
- Handling geolocation permissions and varying browser support.
- Ensuring notifications and reminders behave consistently on mobile and desktop.
- Balancing simulated vitals (for demos) vs. real device integrations (future work).

## What we learned
- Design for clarity: in emergencies users need direct actions and minimal friction.
- Local notifications + calendar reminders improve adherence to medication and hydration routines.
- Small, well-scoped AI assistance (first-aid guidance, calming instructions) adds huge user value when carefully crafted.

## Accomplishments
- Functional prototype with live map and hospital lookup.
- Interactive medication calendar with local reminders and notifications.
- AI chatbot integrated (embeddable) to provide on-demand guidance.
- Modern, responsive UI suitable for mobile users.

## What’s next
- Multilingual support.
- Real device integration (Bluetooth health sensors / wearables).
- Server-side options for secure AI keys and telemetry (consent-first).
- Partnerships with local health providers and NGOs for deployment.

## How to use (quick)
1. Open the web app in a modern browser (Chrome/Edge/Firefox recommended).  
2. Allow location access so the map can show your position and nearby hospitals.  
3. Check your vitals panel and press the quick-check buttons to evaluate your status.  
4. Use the hydration button whenever you drink water — the app will mark it completed.  
5. Add medications or health reminders to the calendar; allow notifications so alerts arrive on time.  
6. If you feel unsafe or in an emergency, press the emergency button to sound the alarm and access quick-call options.  
7. Use the embedded AI Health Assistant to ask about first aid, stress relief exercises, or what to do next.

## Tech stack
- HTML, CSS, JavaScript
- Leaflet (maps)
- OpenStreetMap tiles & Overpass API
- Web Notifications API
- Optional: Node.js / Flask backend, Hugging Face or OpenAI for chatbot

## Demo & Links
- 🎥 **Demo video:** [https://youtu.be/iDDW3Z6S8hc?si=jPS-L5IeAAO9D9sK](https://youtu.be/iDDW3Z6S8hc?si=jPS-L5IeAAO9D9sK)  
- 💻 **Source code:** [https://github.com/claribelgilsosa20-cpu/Health-and-safety.git](https://github.com/claribelgilsosa20-cpu/Health-and-safety.git)  
- 🌐 **Live website:** [https://claribelgilsosa20-cpu.github.io/Health-and-safety/](https://claribelgilsosa20-cpu.github.io/Health-and-safety/)

## License
This project is released under the MIT License. See `LICENSE` for details.
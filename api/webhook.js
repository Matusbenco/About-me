export default function handler(req, res) {
  // Slovenské názvy
  const dni = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
  const mesiace = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
  
  // Bratislavský čas
  const now = new Date();
  const bratislava = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Bratislava' }));
  
  const den = dni[bratislava.getDay()];
  const datum = bratislava.getDate();
  const mesiac = mesiace[bratislava.getMonth()];
  const rok = bratislava.getFullYear();
  const hodina = bratislava.getHours();
  const minuty = bratislava.getMinutes().toString().padStart(2, '0');
  
  // Ordinačné hodiny
  const dayOfWeek = bratislava.getDay();
  let jeOtvorene = false;
  let ordinacneHodiny = '';
  
  if (dayOfWeek === 0) {
    ordinacneHodiny = 'zatvorené';
  } else if (dayOfWeek === 5) {
    ordinacneHodiny = '8:00-15:00';
    jeOtvorene = hodina >= 8 && hodina < 15;
  } else if (dayOfWeek === 6) {
    ordinacneHodiny = '9:00-12:00';
    jeOtvorene = hodina >= 9 && hodina < 12;
  } else if (dayOfWeek === 3) {
    ordinacneHodiny = '8:00-19:00';
    jeOtvorene = hodina >= 8 && hodina < 19;
  } else {
    ordinacneHodiny = '8:00-17:00';
    jeOtvorene = hodina >= 8 && hodina < 17;
  }

  const datumText = `Dnes je ${den}, ${datum}. ${mesiac} ${rok}. Aktuálny čas je ${hodina}:${minuty}. Klinika je ${jeOtvorene ? 'otvorená' : 'zatvorená'}.`;

  const assistant = {
    name: "Klára - Zubná klinika",
    firstMessage: "Dobrý deň, zubná klinika Úsmev. Som digitálna asistentka Klára. Ako vám môžem pomôcť?",
    voice: {
      provider: "11labs",
      voiceId: "i4CzbCVWoqvD0P1QJCUL",
      stability: 0.3,
      similarityBoost: 0.85,
      style: 0.6,
      useSpeakerBoost: true
    },
    transcriber: {
      provider: "deepgram",
      m

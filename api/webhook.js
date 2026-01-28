export default function handler(req, res) {
  // Povoľ CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Slovenské názvy
  const dni = ['nedela', 'pondelok', 'utorok', 'streda', 'stvrtok', 'piatok', 'sobota'];
  const mesiace = ['januara', 'februara', 'marca', 'aprila', 'maja', 'juna', 'julia', 'augusta', 'septembra', 'oktobra', 'novembra', 'decembra'];
  
  // Bratislavský čas
  const now = new Date();
  const options = { timeZone: 'Europe/Bratislava' };
  const bratislava = new Date(now.toLocaleString('en-US', options));
  
  const den = dni[bratislava.getDay()];
  const datum = bratislava.getDate();
  const mesiac = mesiace[bratislava.getMonth()];
  const rok = bratislava.getFullYear();
  const hodina = bratislava.getHours();
  const minuty = String(bratislava.getMinutes()).padStart(2, '0');
  
  const dayOfWeek = bratislava.getDay();
  let jeOtvorene = false;
  
  if (dayOfWeek === 0) {
    jeOtvorene = false;
  } else if (dayOfWeek === 5) {
    jeOtvorene = hodina >= 8 && hodina < 15;
  } else if (dayOfWeek === 6) {
    jeOtvorene = hodina >= 9 && hodina < 12;
  } else if (dayOfWeek === 3) {
    jeOtvorene = hodina >= 8 && hodina < 19;
  } else {
    jeOtvorene = hodina >= 8 && hodina < 17;
  }

  const datumText = "Dnes je " + den + ", " + datum + ". " + mesiac + " " + rok + ". Aktualny cas je " + hodina + ":" + minuty + ". Klinika je " + (jeOtvorene ? "otvorena" : "zatvorena") + ".";

  const assistant = {
    name: "Klara - Zubna klinika",
    firstMessage: "Dobry den, zubna klinika Usmev. Som digitalna asistentka Klara. Ako vam mozem pomoct?",
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
      model: "nova-3",
      language: "sk"
    },
    model: {
      provider: "openai",
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: "Si Klara, digitalna asistentka zubnej kliniky Usmev. Si mila, priatelska a optimisticka.\n\n=== AKTUALNY DATUM A CAS ===\n" + datumText + "\n\n=== ORDINACNE HODINY ===\nPo-St: 8:00-17:00, St: 8:00-19:00, Pi: 8:00-15:00, So: 9:00-12:00, Ne: zatvorene\n\n=== LOGIKA TERMINOV ===\n- Ak zatvorene: Momentalne mame zatvorene, mozem vas objednat na najblizsi volny termin.\n- VZDY skontroluj kalendar pred ponuknutim terminu!\n- Ak obsadene: ponukni najblizsi volny\n- NIKDY duplikat rezervacie\n\n=== AKO HOVORIT ===\n- Datumy SLOVNE: zajtra, v pondelok dvadsiateho deviateho\n- Casy SLOVNE: o deviatej hodine\n- MAX 1-2 terminy naraz\n\n=== POSTUP ===\n1. Zisti co pacient potrebuje\n2. Skontroluj kalendar, ponukni terminy\n3. Meno: over (Pan/pani [meno], spravne?)\n4. Telefon: over\n5. Vytvor rezervaciu\n\n=== FORMAT KALENDARA ===\nZubna klinika Usmev - [zakrok] - [meno]\n\n=== INFO ===\nDunajska 15, Bratislava | 02/555 12 34\nPrehliadka 25eur, Hygiena 55eur, Plomba 45-80eur, Extrakcia 50-120eur\nPoistovne: VsZP, Dovera, Union"
      }],
      toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
    },
    endCallPhrases: ["dovidenia", "do videnia", "zbohom", "majte sa", "cau", "ahoj"]
  };

  return res.status(200).json({ assistant });
}

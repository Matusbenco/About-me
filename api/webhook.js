export default function handler(request, response) {
  const d = new Date();
  const dni = ['nedela', 'pondelok', 'utorok', 'streda', 'stvrtok', 'piatok', 'sobota'];
  const mesiace = ['januara', 'februara', 'marca', 'aprila', 'maja', 'juna', 'jula', 'augusta', 'septembra', 'oktobra', 'novembra', 'decembra'];
  const cislovky = ['', 'prveho', 'druheho', 'tretieho', 'stvrteho', 'piateho', 'siesteho', 'siedmeho', 'osmeho', 'deviateho', 'desiateho', 'jedenásteho', 'dvanásteho', 'trinásteho', 'štrnásteho', 'pätnásteho', 'šestnásteho', 'sedemnásteho', 'osemnásteho', 'devätnásteho', 'dvadsiateho', 'dvadsiateho prveho', 'dvadsiateho druheho', 'dvadsiateho tretieho', 'dvadsiateho stvrteho', 'dvadsiateho piateho', 'dvadsiateho siesteho', 'dvadsiateho siedmeho', 'dvadsiateho osmeho', 'dvadsiateho deviateho', 'tridsiateho', 'tridsiateho prveho'];

  // Bratislava = UTC + 1 (zimný čas) alebo UTC + 2 (letný čas)
  // Január = zimný čas = UTC + 1
  const utcHour = d.getUTCHours();
  const hodinaCislo = utcHour + 1;
  const minuty = d.getUTCMinutes();
  
  const den = dni[d.getUTCDay()];
  const datumSlovne = cislovky[d.getUTCDate()] + " " + mesiace[d.getUTCMonth()];
  
  const zajtra = new Date(d);
  zajtra.setUTCDate(zajtra.getUTCDate() + 1);
  const zajtraDen = dni[zajtra.getUTCDay()];
  const zajtraDatum = cislovky[zajtra.getUTCDate()] + " " + mesiace[zajtra.getUTCMonth()];

  // Dostupné hodiny dnes (len budúce, od 8 do 17)
  const presliCasy = [];
  const dostupneCasy = [];
  for (let h = 8; h <= 17; h++) {
    if (h <= hodinaCislo) {
      presliCasy.push(h + ":00");
    } else {
      dostupneCasy.push(h + ":00");
    }
  }

  return response.status(200).json({
    assistant: {
      name: "Klara - Zubna klinika",
      firstMessage: "Dobry den, zubna klinika Usmev, vola Klara. Ako vam mozem pomoct?",
      voice: { 
        provider: "11labs", 
        voiceId: "h2sm0NbeIZXHBzJOMYcQ",
        stability: 0.4,
        similarityBoost: 0.8,
        style: 0.5
      },
      transcriber: { 
        provider: "deepgram", 
        model: "nova-3", 
        language: "sk",
        keywords: ["Benco:5", "Novak:3", "Horvath:3", "Kovac:3"]
      },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [{ 
          role: "system", 
          content: "Si Klara, asistentka zubnej kliniky Usmev. Hovoris IBA po slovensky.\n\nDNESNY DATUM: " + den + ", " + datumSlovne + "\nAKTUALNY CAS: " + hodinaCislo + ":" + String(minuty).padStart(2, '0') + "\nZAJTRA: " + zajtraDen + ", " + zajtraDatum + "\n\n=== TERMINY ===\nDnes mozes ponukat IBA: " + dostupneCasy.join(", ") + "\n" + presliCasy.join(", ") + " uz PRESLI - NIKDY ich neponukaj!\n\n=== KONTROLA KALENDARA ===\nPRED ponuknutim terminu VZDY zavolaj skontrolovat_dostupnost!\nAk je termin OBSADENY - ponukni iny cas!\nNa jeden cas moze byt len JEDNA rezervacia!\n\n=== AK NEROZUMIES ===\nAk niecomu nerozumies, NEOPAKUJ nezmysly!\nPovedz: \"Prepacte, nerozumela som. Mozete to prosim zopakovat?\"\n\n=== CASY SLOVNE ===\n11:00 = o jedenastej\n12:00 = o dvanastej\n14:00 = o strnastej\n\nPOSTUP:\n1. Zisti co pacient potrebuje\n2. Zavolaj skontrolovat_dostupnost\n3. Ponukni VOLNY termin\n4. Over meno\n5. Over telefon\n6. Vytvor rezervaciu\n\nFORMAT: Zubna klinika Usmev - [zakrok] - [meno]\nADRESA: Dunajska 15, Bratislava"
        }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      },
      endCallPhrases: ["dovidenia", "do videnia", "majte sa"]
    }
  });
}

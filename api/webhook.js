export default function handler(request, response) {
  const d = new Date();
  const dni = ['nedela', 'pondelok', 'utorok', 'streda', 'stvrtok', 'piatok', 'sobota'];
  const mesiace = ['januara', 'februara', 'marca', 'aprila', 'maja', 'juna', 'jula', 'augusta', 'septembra', 'oktobra', 'novembra', 'decembra'];
  const cislovky = ['', 'prveho', 'druheho', 'tretieho', 'stvrteho', 'piateho', 'siesteho', 'siedmeho', 'osmeho', 'deviateho', 'desiateho', 'jedenásteho', 'dvanásteho', 'trinásteho', 'štrnásteho', 'pätnásteho', 'šestnásteho', 'sedemnásteho', 'osemnásteho', 'devätnásteho', 'dvadsiateho', 'dvadsiateho prveho', 'dvadsiateho druheho', 'dvadsiateho tretieho', 'dvadsiateho stvrteho', 'dvadsiateho piateho', 'dvadsiateho siesteho', 'dvadsiateho siedmeho', 'dvadsiateho osmeho', 'dvadsiateho deviateho', 'tridsiateho', 'tridsiateho prveho'];

  const hodinaCislo = d.getUTCHours() + 1;
  const minuty = d.getUTCMinutes();
  const den = dni[d.getUTCDay()];
  const datumSlovne = cislovky[d.getUTCDate()] + " " + mesiace[d.getUTCMonth()];
  
  // Zajtra
  const zajtra = new Date(d);
  zajtra.setUTCDate(zajtra.getUTCDate() + 1);
  const zajtraDen = dni[zajtra.getUTCDay()];
  const zajtraDatum = cislovky[zajtra.getUTCDate()] + " " + mesiace[zajtra.getUTCMonth()];

  // Dostupné hodiny dnes (len budúce)
  const dostupneDnes = [];
  for (let h = hodinaCislo + 1; h <= 17; h++) {
    dostupneDnes.push(h + ":00");
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
          content: "Si Klara, asistentka zubnej kliniky Usmev. Hovoris IBA po slovensky.\n\nDNESNY DATUM: " + den + ", " + datumSlovne + "\nAKTUALNY CAS: " + hodinaCislo + ":" + String(minuty).padStart(2, '0') + "\nZAJTRA JE: " + zajtraDen + ", " + zajtraDatum + "\n\n=== PRAVIDLA PRE TERMINY - STRIKTNE DODRZUJ! ===\n\n1. MINULOST NEEXISTUJE:\n   - Aktualny cas je " + hodinaCislo + ":" + String(minuty).padStart(2, '0') + "\n   - NIKDY neponukaj terminy PRED aktualnym casom na dnes!\n   - Dnes mozes ponukat IBA: " + dostupneDnes.join(", ") + "\n   - Ak pacient chce skor, ponukni ZAJTRA\n\n2. KONTROLA KALENDARA - POVINNA!\n   - PRED KAZDYM ponuknutim terminu NAJPRV zavolaj skontrolovat_dostupnost!\n   - Ak je OBSADENE, ponukni INY cas\n   - NIKDY neponukaj obsadeny termin!\n   - Na jeden cas moze byt IBA JEDNA rezervacia!\n\n3. CASY HOVOR SLOVNE:\n   - 10:00 = o desiatej hodine\n   - 11:00 = o jedenastej hodine\n   - 14:00 = o strnastej hodine\n\nZAKAZANE:\n- Neponukaj casy ktore uz presli\n- Neponukaj obsadene terminy\n- Nepouzivaj anglicke slova\n\nPOSTUP:\n1. Zisti co pacient potrebuje\n2. ZAVOLAJ skontrolovat_dostupnost!\n3. Ponukni IBA VOLNE terminy v BUDUCNOSTI\n4. Spytaj sa meno, over ho\n5. Spytaj sa telefon, over ho\n6. Vytvor rezervaciu\n\nFORMAT KALENDARA: Zubna klinika Usmev - [zakrok] - [meno]\n\nORDINACNE HODINY: Po-St 8-17, St 8-19, Pi 8-15, So 9-12, Ne zatvorene\nCENNIK: Prehliadka 25 eur, Hygiena 55 eur\nADRESA: Dunajska 15, Bratislava"
        }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      },
      endCallPhrases: ["dovidenia", "do videnia", "zbohom", "majte sa"]
    }
  });
}

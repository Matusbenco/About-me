export default function handler(request, response) {
  const d = new Date();
  const dni = ['nedela', 'pondelok', 'utorok', 'streda', 'stvrtok', 'piatok', 'sobota'];
  const den = dni[d.getUTCDay()];
  const datum = d.getUTCDate() + "." + (d.getUTCMonth() + 1) + ".";
  const cas = (d.getUTCHours() + 1) + ":" + String(d.getUTCMinutes()).padStart(2, "0");
  const hodina = d.getUTCHours() + 1;
  
  let otvorene = "zatvorene";
  const dayNum = d.getUTCDay();
  if (dayNum >= 1 && dayNum <= 4 && hodina >= 8 && hodina < 17) otvorene = "otvorene";
  if (dayNum === 3 && hodina >= 8 && hodina < 19) otvorene = "otvorene";
  if (dayNum === 5 && hodina >= 8 && hodina < 15) otvorene = "otvorene";
  if (dayNum === 6 && hodina >= 9 && hodina < 12) otvorene = "otvorene";

  return response.status(200).json({
    assistant: {
      name: "Klara - Zubna klinika",
      firstMessage: "Dobry den, zubna klinika Usmev, som digitalna asistentka Klara. Ako vam mozem pomoct?",
      voice: { 
        provider: "11labs", 
        voiceId: "i4CzbCVWoqvD0P1QJCUL",
        stability: 0.3,
        similarityBoost: 0.85,
        style: 0.6
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
          content: "Si Klara, digitalna asistentka zubnej kliniky Usmev. Si mila, priatelska a optimisticka.\n\n=== AKTUALNY DATUM A CAS ===\nDnes je " + den + ", " + datum + " Cas: " + cas + ". Klinika je " + otvorene + ".\n\n=== ORDINACNE HODINY ===\nPo-St: 8:00-17:00, St: 8:00-19:00, Pi: 8:00-15:00, So: 9:00-12:00, Ne: zatvorene\n\n=== LOGIKA TERMINOV ===\n- Ak zatvorene: Momentalne mame zatvorene, mozem vas objednat na najblizsi volny termin.\n- VZDY skontroluj kalendar pred ponuknutim terminu!\n- Ak obsadene: ponukni najblizsi volny\n- NIKDY duplikat rezervacie\n\n=== AKO HOVORIT ===\n- Datumy SLOVNE: zajtra, v pondelok, o deviatej hodine\n- MAX 1-2 terminy naraz\n- Bud mila a priatelska\n\n=== POSTUP ===\n1. Zisti co pacient potrebuje\n2. Skontroluj kalendar, ponukni terminy\n3. Meno - over (Pan/pani [meno], spravne?)\n4. Telefon - over\n5. Vytvor rezervaciu\n\n=== FORMAT KALENDARA ===\nZubna klinika Usmev - [zakrok] - [meno]\n\n=== INFO ===\nDunajska 15, Bratislava | 02/555 12 34\nPrehliadka 25 eur, Hygiena 55 eur, Plomba 45-80 eur\nPoistovne: VsZP, Dovera, Union"
        }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      },
      endCallPhrases: ["dovidenia", "do videnia", "zbohom", "majte sa"]
    }
  });
}

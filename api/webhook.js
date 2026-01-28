module.exports = function handler(req, res) {
  const now = new Date();
  const dni = ['nedela', 'pondelok', 'utorok', 'streda', 'stvrtok', 'piatok', 'sobota'];
  const mesiace = ['januara', 'februara', 'marca', 'aprila', 'maja', 'juna', 'julia', 'augusta', 'septembra', 'oktobra', 'novembra', 'decembra'];
  
  const den = dni[now.getUTCDay()];
  const datum = now.getUTCDate();
  const mesiac = mesiace[now.getUTCMonth()];
  const hodina = now.getUTCHours() + 1;
  const minuty = String(now.getUTCMinutes()).padStart(2, '0');

  const datumText = "Dnes je " + den + ", " + datum + ". " + mesiac + ". Cas je " + hodina + ":" + minuty + ".";

  res.json({
    assistant: {
      name: "Klara",
      firstMessage: "Dobry den, zubna klinika Usmev, som Klara. Ako vam mozem pomoct?",
      voice: {
        provider: "11labs",
        voiceId: "i4CzbCVWoqvD0P1QJCUL"
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
          content: "Si Klara, asistentka zubnej kliniky Usmev.\n\nAKTUALNY DATUM: " + datumText + "\n\nOrdinacne hodiny: Po-St 8-17, St 8-19, Pi 8-15, So 9-12, Ne zatvorene.\n\nPostup: 1) Zisti co treba 2) Ponukni termin 3) Over meno 4) Over telefon 5) Rezervuj.\n\nFormat kalendara: Zubna klinika Usmev - [zakrok] - [meno]\n\nCennik: Prehliadka 25eur, Hygiena 55eur, Plomba 45-80eur."
        }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      }
    }
  });
};

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const now = new Date();
  const hodina = now.getUTCHours() + 1;
  const minuty = String(now.getUTCMinutes()).padStart(2, '0');
  const den = now.getUTCDate();
  const mesiac = now.getUTCMonth() + 1;

  const datumText = den + "." + mesiac + ". o " + hodina + ":" + minuty;

  return res.json({
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
          content: "Si Klara, asistentka zubnej kliniky Usmev. DNES JE: " + datumText + ". Ordinacne hodiny: Po-St 8-17, St 8-19, Pi 8-15, So 9-12, Ne zatvorene."
        }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      }
    }
  });
}

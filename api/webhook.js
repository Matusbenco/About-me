export default function(req, res) {
  const now = new Date();
  const hodina = now.getUTCHours() + 1;
  const minuty = String(now.getUTCMinutes()).padStart(2, '0');
  const den = now.getUTCDate();
  const mesiac = now.getUTCMonth() + 1;

  res.status(200).json({
    assistant: {
      name: "Klara",
      firstMessage: "Dobry den, zubna klinika Usmev, som Klara.",
      voice: { provider: "11labs", voiceId: "i4CzbCVWoqvD0P1QJCUL" },
      transcriber: { provider: "deepgram", model: "nova-3", language: "sk" },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [ role: "system", content: "Si Klara. DNES JE " + den + "." + mesiac + ". CAS " + hodina + ":" + minuty }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      }
    }
  });
}

export default function handler(request, response) {
  const d = new Date();
  const datum = d.getUTCDate() + "." + (d.getUTCMonth() + 1) + ".";
  const cas = (d.getUTCHours() + 1) + ":" + String(d.getUTCMinutes()).padStart(2, "0");

  return response.status(200).json({
    assistant: {
      name: "Klara",
      firstMessage: "Dobry den, zubna klinika Usmev, som Klara.",
      voice: { provider: "11labs", voiceId: "i4CzbCVWoqvD0P1QJCUL" },
      transcriber: { provider: "deepgram", model: "nova-3", language: "sk" },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [{ role: "system", content: "Si Klara. DNES JE " + datum + " CAS " + cas }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      }
    }
  });
}

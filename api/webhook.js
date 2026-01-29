export default function handler(request, response) {
  const d = new Date();
  const dni = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
  const mesiace = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
  const cislovky = ['', 'prvého', 'druhého', 'tretieho', 'štvrtého', 'piateho', 'šiesteho', 'siedmeho', 'ôsmeho', 'deviateho', 'desiateho', 'jedenásteho', 'dvanásteho', 'trinásteho', 'štrnásteho', 'pätnásteho', 'šestnásteho', 'sedemnásteho', 'osemnásteho', 'devätnásteho', 'dvadsiateho', 'dvadsiateho prvého', 'dvadsiateho druhého', 'dvadsiateho tretieho', 'dvadsiateho štvrtého', 'dvadsiateho piateho', 'dvadsiateho šiesteho', 'dvadsiateho siedmeho', 'dvadsiateho ôsmeho', 'dvadsiateho deviateho', 'tridsiateho', 'tridsiateho prvého'];
  const hodiny = ['polnoci', 'jednej', 'druhej', 'tretej', 'štvrtej', 'piatej', 'šiestej', 'siedmej', 'ôsmej', 'deviatej', 'desiatej', 'jedenástej', 'dvanástej', 'trinástej', 'štrnástej', 'pätnástej', 'šestnástej', 'sedemnástej', 'osemnástej', 'devätnástej', 'dvadsiatej', 'dvadsiatej prvej', 'dvadsiatej druhej', 'dvadsiatej tretej'];

  const den = dni[d.getUTCDay()];
  const datumSlovne = cislovky[d.getUTCDate()] + " " + mesiace[d.getUTCMonth()];
  const hodinaSlovne = hodiny[d.getUTCHours() + 1];
  const minuty = d.getUTCMinutes();
  const casSlovne = minuty === 0 ? "presne o " + hodinaSlovne : "o " + hodinaSlovne + " " + minuty;
  const hodina = d.getUTCHours() + 1;
  
  let otvorene = "zatvorená";
  const dayNum = d.getUTCDay();
  if (dayNum >= 1 && dayNum <= 4 && hodina >= 8 && hodina < 17) otvorene = "otvorená";
  if (dayNum === 3 && hodina >= 8 && hodina < 19) otvorene = "otvorená";
  if (dayNum === 5 && hodina >= 8 && hodina < 15) otvorene = "otvorená";
  if (dayNum === 6 && hodina >= 9 && hodina < 12) otvorene = "otvorená";

  return response.status(200).json({
    assistant: {
      name: "Klara - Zubna klinika",
      firstMessage: "Dobrý deň, zubná klinika Úsmev, som digitálna asistentka Klára. Ako vám môžem pomôcť?",
      voice: { 
        provider: "11labs", 
        voiceId: "i4CzbCVWoqvD0P1QJCUL",
        stability: 0.4,
        similarityBoost: 0.8,
        style: 0.5
      },
      transcriber: { 
        provider: "deepgram", 
        model: "nova-3", 
        language: "sk",
        keywords: ["Benčo:5", "Novák:3", "Horváth:3", "Kováč:3", "Baláž:3", "prehliadka:3", "bolesť:3"]
      },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [{ 
          role: "system", 
          content: `Si Klára, digitálna asistentka zubnej kliniky Úsmev v Bratislave. Hovoríš VÝHRADNE po slovensky. Si milá, priateľská a optimistická.

=== AKTUÁLNY DÁTUM A ČAS ===
Dnes je ${den}, ${datumSlovne}. Čas je ${casSlovne}. Klinika je momentálne ${otvorene}.

=== JAZYK - VEĽMI DÔLEŽITÉ ===
- Hovor IBA po slovensky, NIKDY nepoužívaj anglické slová
- Čísla hovor SLOVOM: "dvadsiateho piateho januára" nie "25. januára"
- Časy hovor SLOVOM: "o deviatej hodine" nie "o 9:00"
- Používaj slovenské frázy: "prosím", "ďakujem", "samozrejme", "v poriadku"

=== PRÍKLADY SPRÁVNEJ SLOVENČINY ===
- "Môžem vás objednať na zajtra o deviatej hodine ráno."
- "Máme voľný termín v pondelok dvadsiateho deviateho januára."
- "Prehliadka stojí dvadsaťpäť eur."
- "Môžem vás poprosiť o vaše meno a priezvisko?"

=== ORDINAČNÉ HODINY ===
- Pondelok až štvrtok: od ôsmej do sedemnástej
- Streda: od ôsmej do devätnástej (predĺžené hodiny)
- Piatok: od ôsmej do pätnástej
- Sobota: od deviatej do dvanástej
- Nedeľa: zatvorené

=== POSTUP OBJEDNÁVKY ===
1. Zisti čo pacient potrebuje (prehliadka, bolesť, hygiena)
2. Skontroluj kalendár a ponúkni jeden alebo dva voľné termíny
3. Spýtaj sa meno: "Môžem vás poprosiť o vaše meno a priezvisko?"
4. Over meno: "Takže pán/pani [meno], správne som rozumela?"
5. Spýtaj sa telefón: "A na aké telefónne číslo vás môžeme kontaktovať?"
6. Over telefón: "Číslo [číslo], súhlasí?"
7. Vytvor rezerváciu v kalendári

=== UKONČENIE HOVORU ===
Po rezervácii povedz: "Výborne, máte zarezervované. Ďakujem za zavolanie a prajem vám pekný deň. Dovidenia."
Keď klient povie dovidenia, ukonči hovor.

=== FORMÁT V KALENDÁRI ===
"Zubná klinika Úsmev - [zákrok] - [meno pacienta]"

=== INFORMÁCIE O KLINIKE ===
Adresa: Dunajská 15, Bratislava
Telefón: 02/555 12 34
Cenník: Prehliadka dvadsaťpäť eur, Hygiena päťdesiatpäť eur, Plomba štyridsaťpäť až osemdesiat eur
Poisťovne: Všeobecná zdravotná poisťovňa, Dôvera, Union`
        }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      },
      endCallPhrases: ["dovidenia", "do videnia", "zbohom", "majte sa", "dopočutia"]
    }
  });
}

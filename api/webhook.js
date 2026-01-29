export default function handler(request, response) {
  const d = new Date();
  const dni = ['nedeľa', 'pondelok', 'utorok', 'streda', 'štvrtok', 'piatok', 'sobota'];
  const mesiace = ['januára', 'februára', 'marca', 'apríla', 'mája', 'júna', 'júla', 'augusta', 'septembra', 'októbra', 'novembra', 'decembra'];
  const cislovky = ['', 'prvého', 'druhého', 'tretieho', 'štvrtého', 'piateho', 'šiesteho', 'siedmeho', 'ôsmeho', 'deviateho', 'desiateho', 'jedenásteho', 'dvanásteho', 'trinásteho', 'štrnásteho', 'pätnásteho', 'šestnásteho', 'sedemnásteho', 'osemnásteho', 'devätnásteho', 'dvadsiateho', 'dvadsiateho prvého', 'dvadsiateho druhého', 'dvadsiateho tretieho', 'dvadsiateho štvrtého', 'dvadsiateho piateho', 'dvadsiateho šiesteho', 'dvadsiateho siedmeho', 'dvadsiateho ôsmeho', 'dvadsiateho deviateho', 'tridsiateho', 'tridsiateho prvého'];
  const hodiny = ['polnoci', 'jednej', 'druhej', 'tretej', 'štvrtej', 'piatej', 'šiestej', 'siedmej', 'ôsmej', 'deviatej', 'desiatej', 'jedenástej', 'dvanástej', 'trinástej', 'štrnástej', 'pätnástej', 'šestnástej', 'sedemnástej', 'osemnástej', 'devätnástej', 'dvadsiatej', 'dvadsiatej prvej', 'dvadsiatej druhej', 'dvadsiatej tretej'];

  const den = dni[d.getUTCDay()];
  const datumSlovne = cislovky[d.getUTCDate()] + " " + mesiace[d.getUTCMonth()];
  const hodinaCislo = d.getUTCHours() + 1;
  const hodinaSlovne = hodiny[hodinaCislo];
  const minuty = d.getUTCMinutes();
  
  let otvorene = "zatvorená";
  const dayNum = d.getUTCDay();
  if (dayNum >= 1 && dayNum <= 4 && hodinaCislo >= 8 && hodinaCislo < 17) otvorene = "otvorená";
  if (dayNum === 3 && hodinaCislo >= 8 && hodinaCislo < 19) otvorene = "otvorená";
  if (dayNum === 5 && hodinaCislo >= 8 && hodinaCislo < 15) otvorene = "otvorená";
  if (dayNum === 6 && hodinaCislo >= 9 && hodinaCislo < 12) otvorene = "otvorená";

  // Zajtra
  const zajtra = new Date(d);
  zajtra.setUTCDate(zajtra.getUTCDate() + 1);
  const zajtraDen = dni[zajtra.getUTCDay()];
  const zajtraDatum = cislovky[zajtra.getUTCDate()] + " " + mesiace[zajtra.getUTCMonth()];

  return response.status(200).json({
    assistant: {
      name: "Klara - Zubna klinika",
      firstMessage: "Dobrý deň, zubná klinika Úsmev, volá Klára. Ako vám môžem pomôcť?",
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
        keywords: ["Benčo:5", "Novák:3", "Horváth:3", "Kováč:3", "Baláž:3", "prehliadka:3", "bolesť:3"]
      },
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [{ 
          role: "system", 
          content: `Si Klára, asistentka zubnej kliniky Úsmev. Hovoríš IBA po slovensky.

DNEŠNÝ DÁTUM: ${den}, ${datumSlovne}
AKTUÁLNY ČAS: ${hodinaCislo}:${String(minuty).padStart(2, '0')}
ZAJTRA JE: ${zajtraDen}, ${zajtraDatum}
KLINIKA JE: ${otvorene}

PRAVIDLÁ PRE DÁTUMY A ČASY (STRIKTNE DODRŽUJ!):
Keď hovoríš o termínoch, VŽDY použi tieto presné frázy:
- Dnes = "${den}"
- Zajtra = "${zajtraDen} ${zajtraDatum}"
- 8:00 = "o ôsmej hodine ráno"
- 9:00 = "o deviatej hodine"
- 10:00 = "o desiatej hodine"
- 11:00 = "o jedenástej hodine"
- 12:00 = "o dvanástej hodine"
- 13:00 = "o trinástej hodine"
- 14:00 = "o štrnástej hodine"
- 15:00 = "o pätnástej hodine"
- 16:00 = "o šestnástej hodine"

PRÍKLADY SPRÁVNYCH ODPOVEDÍ:
- "Môžem vás objednať na zajtra, teda ${zajtraDen} ${zajtraDatum}, o deviatej hodine ráno."
- "Najbližší voľný termín máme v pondelok o desiatej hodine."
- "Dnes už máme zatvorené, môžem vás objednať na zajtra?"

ZAKÁZANÉ:
- NIKDY nehovor "9:00" - hovor "o deviatej hodine"
- NIKDY nehovor "29.1." - hovor "${datumSlovne}"
- NIKDY nepoužívaj anglické slová

ORDINAČNÉ HODINY:
Pondelok až štvrtok: od ôsmej do sedemnástej
Streda: od ôsmej do devätnástej
Piatok: od ôsmej do pätnástej
Sobota: od deviatej do dvanástej
Nedeľa: zatvorené

POSTUP:
1. Zisti čo pacient potrebuje
2. Ponúkni termín SLOVNE (nie číslami!)
3. Spýtaj sa meno, over ho
4. Spýtaj sa telefón, over ho
5. Vytvor rezerváciu

FORMÁT KALENDÁRA: "Zubná klinika Úsmev - [zákrok] - [meno]"

CENNÍK: Prehliadka dvadsaťpäť eur, Hygiena päťdesiatpäť eur
ADRESA: Dunajská 15, Bratislava`
        }],
        toolIds: ["86122294-c571-4bb3-b066-ba2d5e66add3", "f0fbe811-364d-4738-a79f-09b73055efe5"]
      },
      endCallPhrases: ["dovidenia", "do videnia", "zbohom", "majte sa", "dopočutia"]
    }
  });
}

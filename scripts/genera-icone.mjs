// Rigenera le icone dell'app/sito a partire da public/icona-512.png rendendole
// FULL-BLEED: il blu navy riempie tutto il quadrato, senza padding trasparente
// (che su Google e sulla home del telefono appariva come bordi bianchi) e senza la
// cornice arrotondata chiara (keyline). Così funzionano bene anche come icona "maskable"
// della PWA, dove il sistema operativo ritaglia l'icona in cerchio/squircle: dietro c'è
// sempre blu, fino agli angoli.
//
// Come: la sorgente è una "tessera" blu arrotondata con una sottile cornice chiara ai
// bordi. Non si può rimuovere quella cornice riempiendo dietro (sono pixel chiari, non
// trasparenza) e tagliarla tutta mangerebbe la bilancia. Quindi prendiamo SOLO la parte
// CENTRALE della tessera (blu pieno + bilancia, senza la cornice) e la incolliamo al
// centro di un quadrato blu pieno, dello stesso navy campionato dalla tessera.
//
// Uso (sharp installato anche solo con `npm install --no-save sharp`):
//   node scripts/genera-icone.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');
const SORGENTE = join(PUBLIC, 'icona-512.png');

// quanta tessera scartare per lato per eliminare la cornice chiara arrotondata
const MARGINE_CORNICE = 0.085;
// quanto della larghezza dell'icona occupa la bilancia (resta nel centro 80% = maskable safe)
const CONTENUTO = 0.9;

const USCITE = [
  { nome: 'icona-512.png', size: 512 },
  { nome: 'icona-192.png', size: 192 },
  { nome: 'apple-touch-icon.png', size: 180 },
  { nome: 'favicon.png', size: 48 }
];

async function main() {
  // 1) togliamo il padding trasparente asimmetrico: resta la tessera blu
  const tessera = await sharp(SORGENTE).trim().png().toBuffer();
  const meta = await sharp(tessera).metadata();

  // 2) campioniamo il navy reale in alto al centro (sopra la bilancia, blu pieno)
  const camp = await sharp(tessera)
    .extract({ left: Math.floor(meta.width / 2) - 3, top: Math.floor(meta.height * 0.06), width: 6, height: 6 })
    .raw().toBuffer({ resolveWithObject: true });
  let r = 0, g = 0, b = 0;
  const n = camp.data.length / camp.info.channels;
  for (let i = 0; i < camp.data.length; i += camp.info.channels) {
    r += camp.data[i]; g += camp.data[i + 1]; b += camp.data[i + 2];
  }
  const navy = { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
  console.log(`Navy campionato: rgb(${navy.r}, ${navy.g}, ${navy.b})`);

  // 3) ritagliamo la parte CENTRALE della tessera (blu + bilancia, senza cornice)
  const ml = Math.round(meta.width * MARGINE_CORNICE);
  const mt = Math.round(meta.height * MARGINE_CORNICE);
  const centro = await sharp(tessera)
    .extract({ left: ml, top: mt, width: meta.width - 2 * ml, height: meta.height - 2 * mt })
    .toBuffer();

  // 4) per ogni dimensione: quadrato blu pieno + bilancia centrata
  for (const { nome, size } of USCITE) {
    const lato = Math.round(size * CONTENUTO);
    const off = Math.round((size - lato) / 2);
    const contenuto = await sharp(centro).resize(lato, lato, { fit: 'cover', position: 'centre' }).toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: { ...navy, alpha: 1 } } })
      .composite([{ input: contenuto, left: off, top: off }])
      .png()
      .toFile(join(PUBLIC, nome));
    console.log(`Scritta ${nome} (${size}x${size})`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

import { z } from 'zod';
import { SchemaLegge, SchemaUrlSicuro } from './schema';
import type { Ambito } from './types';

export const SchemaNovita = z.object({
  id: z.string().min(1),
  titolo: z.string().min(5),
  tipo: z.enum(['gazzetta', 'camera', 'senato']),
  stato: z.enum(['vigore', 'approvata', 'discussione', 'bozza', 'referendum']),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  url: SchemaUrlSicuro
});
export type Novita = z.infer<typeof SchemaNovita>;

export const SchemaNovitaFile = z.object({
  generatoIl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  voci: z.array(SchemaNovita).max(20)
});
export type NovitaFile = z.infer<typeof SchemaNovitaFile>;

export const SchemaCatalogoRemoto = z.object({
  versione: z.number().int().positive(),
  generatoIl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  leggi: z.array(SchemaLegge).min(1)
});

// Le novità non sono ancora modellate (niente regole/ambiti nel dato), quindi qui
// classifichiamo l'argomento dal TITOLO con parole chiave, così la sezione "Novità"
// può rispondere agli stessi filtri della scelta legge. Una voce può finire in più
// ambiti; se non corrisponde a nessuno, comparirà solo sotto "Tutte".
const PAROLE_AMBITO: { ambito: Ambito; re: RegExp }[] = [
  { ambito: 'fisco-lavoro', re: /lavor|salari|retribuzion|occupazion|contratt|\bimpres|artigian|fiscal|tribut|\btass|irpef|\biva\b|caporalato|partita iva|microimpres/i },
  { ambito: 'pensioni-welfare', re: /pension|previdenz|welfare|assegn|inclusion|asili nido|reddito di|invalidit|non autosufficien|usurant/i },
  { ambito: 'casa', re: /\bcasa\b|abitazion|affitt|edilizi|immobil|locazion|\bmutu[oi]\b|condomin/i },
  { ambito: 'diritti-salute', re: /salut|sanit|malatti|disabilit|\bLEA\b|\bcure\b|ospedal|farmac|cadaveri|scompars|affidamento famil|\bminori\b/i },
  { ambito: 'sicurezza-privacy', re: /sicurezz|privacy|dati personali|sorveglian|ordine pubblico|persone giuridich/i },
  { ambito: 'scuola-universita-ricerca', re: /scuol|universit|ricerc|student|istruzion|educant|formazion/i },
  { ambito: 'politica-voto', re: /elezion|elettoral|premierat|costituzion|cittadinanz|referendum|parlament|\bvoto\b/i },
  { ambito: 'ambiente', re: /ambient|\benergi|nuclear|rifiut|inquinament|\bclima|emission|cavità sotterrane|geologic/i },
  { ambito: 'turismo', re: /turism|terma|ospitalit|alberghier|zone franche urbane/i },
  { ambito: 'arte', re: /beni cultural|\bcultur|\barte\b|artistic|paesagg|\bmusei|spettacol|patrimonio/i },
  { ambito: 'doveri', re: /codice della strada|\bobblig|\bdover|\bpatente|\bguida\b|estradizion|trattat/i }
];

export function ambitiNovita(titolo: string): Ambito[] {
  return PAROLE_AMBITO.filter((p) => p.re.test(titolo)).map((p) => p.ambito);
}

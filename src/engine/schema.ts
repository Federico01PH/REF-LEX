import { z } from 'zod';

const CAMPI_PROFILO = [
  'eta', 'genere', 'identitaGenere', 'orientamento', 'statoCivile', 'regione',
  'condizioneLavorativa', 'fasciaReddito', 'fasciaIsee', 'figli', 'abitazione',
  'disabilita', 'cittadinanza', 'religione'
] as const;
// campi su cui hanno senso i confronti ordinali (almeno/alPiu)
const CAMPI_ORDINALI: readonly string[] = ['eta', 'fasciaReddito', 'fasciaIsee', 'figli'];
// campi il cui valore nel profilo è un array: gli autori devono usare 'in', mai 'eq'
const CAMPI_ARRAY: readonly string[] = ['disabilita'];

// solo http/https: z.url() da solo accetterebbe anche schemi pericolosi come javascript:
export const SchemaUrlSicuro = z.string().url().refine((u) => /^https?:\/\//i.test(u), 'solo URL http o https');

const SchemaFonte = z.object({ etichetta: z.string().min(1), url: SchemaUrlSicuro });

const SchemaCondizione = z.object({
  campo: z.enum(CAMPI_PROFILO),
  op: z.enum(['eq', 'in', 'almeno', 'alPiu']),
  valore: z.unknown()
}).superRefine((c, ctx) => {
  if (c.op === 'in' && !Array.isArray(c.valore)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `op 'in' richiede un array come valore (campo ${c.campo})` });
  }
  if ((c.op === 'almeno' || c.op === 'alPiu') && !CAMPI_ORDINALI.includes(c.campo)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `op '${c.op}' è valido solo su campi ordinali (${CAMPI_ORDINALI.join(', ')}), non su ${c.campo}` });
  }
  if (c.op === 'eq' && CAMPI_ARRAY.includes(c.campo)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `il campo ${c.campo} è una lista: usa l'operatore 'in' invece di 'eq'` });
  }
});

const SchemaEffetto = z.object({
  tipo: z.enum(['economico', 'diritto', 'dovere', 'servizio', 'qualita-vita']),
  importoMese: z.object({ min: z.number(), max: z.number() })
    .refine((i) => i.min <= i.max, 'min deve essere <= max').optional(),
  descrizione: z.string().min(1),
  direzione: z.enum(['positivo', 'negativo', 'neutro', 'misto'])
}).superRefine((e, ctx) => {
  if (e.importoMese && e.tipo !== 'economico') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'importoMese è consentito solo per effetti di tipo economico' });
  }
  if (e.importoMese && e.direzione !== 'positivo' && e.direzione !== 'negativo') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'un effetto con importoMese deve avere direzione positivo o negativo (gli importi misti/neutri non entrano nei totali)' });
  }
});

const SchemaRegola = z.object({
  id: z.string().min(1),
  // condizioni vuote = regola universale (si applica a tutti): scelta voluta
  condizioni: z.array(SchemaCondizione),
  campiNecessari: z.array(z.enum(CAMPI_PROFILO)),
  effetto: SchemaEffetto,
  timeline: z.object({
    anno1: z.enum(['attivo', 'nullo', 'incerto']), anno2: z.enum(['attivo', 'nullo', 'incerto']),
    anno5: z.enum(['attivo', 'nullo', 'incerto']), anno10: z.enum(['attivo', 'nullo', 'incerto'])
  }),
  confidenza: z.enum(['certa', 'probabile', 'dipende']),
  noteConfidenza: z.string().optional(),
  fonteRegola: SchemaFonte
});

export const SchemaLegge = z.object({
  id: z.string().min(1),
  titoloDivulgativo: z.string().min(1),
  titoloUfficiale: z.string().min(1),
  stato: z.enum(['vigore', 'approvata', 'discussione', 'bozza', 'referendum']),
  ambito: z.enum(['fisco-lavoro', 'pensioni-welfare', 'casa', 'diritti-salute', 'sicurezza-privacy', 'doveri']),
  origine: z.enum(['italiana', 'europea']).optional(),
  fonti: z.array(SchemaFonte).min(1),
  verificataIl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  riassunto: z.string().min(10),
  regole: z.array(SchemaRegola).min(1)
});

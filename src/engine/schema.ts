import { z } from 'zod';
import { ORDINE_REDDITO, ORDINE_ISEE, ORDINE_TITOLO } from './conditions';

const CAMPI_PROFILO = [
  'eta', 'genere', 'identitaGenere', 'orientamento', 'statoCivile', 'regione',
  'condizioneLavorativa', 'fasciaReddito', 'fasciaIsee', 'figli', 'abitazione',
  'numeroProprieta', 'titoloStudio', 'disabilita', 'cittadinanza', 'permessoSoggiorno', 'religione'
] as const;
// campi su cui hanno senso i confronti ordinali (almeno/alPiu)
const CAMPI_ORDINALI: readonly string[] = ['eta', 'fasciaReddito', 'fasciaIsee', 'figli', 'numeroProprieta', 'titoloStudio'];
// campi il cui valore nel profilo è un array: gli autori devono usare 'in', mai 'eq'
const CAMPI_ARRAY: readonly string[] = ['disabilita', 'condizioneLavorativa'];
// campi a testo libero: il valore è una stringa qualsiasi (nessun enum da validare)
const CAMPI_TESTO: readonly string[] = ['regione'];
// campi numerici: il valore deve essere un numero (eta è libera; figli/numeroProprieta hanno anche un dominio sotto)
const CAMPI_NUMERICI: readonly string[] = ['eta', 'figli', 'numeroProprieta'];

// dominio completo dei valori ammessi per ogni campo (deve combaciare con i tipi in types.ts).
// Serve a intercettare i typo dell'autore (fascia/voce inesistente) invece di applicare la regola in silenzio.
const VALORI_CAMPO: Record<string, readonly (string | number)[]> = {
  genere: ['donna', 'uomo', 'non-binario', 'preferisco-non-dirlo'],
  identitaGenere: ['cisgender', 'transgender', 'preferisco-non-dirlo'],
  orientamento: ['eterosessuale', 'omosessuale', 'bisessuale', 'altro', 'preferisco-non-dirlo'],
  statoCivile: ['non-sposato', 'sposato', 'unione-civile', 'separato', 'vedovo'],
  condizioneLavorativa: ['dipendente-privato', 'dipendente-pubblico', 'autonomo-ordinario', 'forfettario', 'imprenditore', 'studente', 'pensionato', 'disoccupato', 'caregiver', 'casalingo', 'altro'],
  fasciaReddito: ORDINE_REDDITO,
  fasciaIsee: [...ORDINE_ISEE, 'nonLoSo'],
  figli: [0, 1, 2, 3],
  abitazione: ['proprieta', 'affitto', 'comodato', 'altro'],
  numeroProprieta: [0, 1, 2, 3],
  titoloStudio: ORDINE_TITOLO,
  disabilita: ['nessuna', 'motoria', 'visiva', 'uditiva', 'intellettiva', 'malattia-cronica', 'condizione-non-riconosciuta'],
  cittadinanza: ['italiana', 'ue', 'extra-ue'],
  permessoSoggiorno: ['si', 'no', 'preferisco-non-dirlo'],
  religione: ['nessuna', 'cattolica', 'altra-cristiana', 'musulmana', 'ebraica', 'altra', 'preferisco-non-dirlo']
};
// per i confronti ordinali su stringhe il valore deve stare nell'elenco ORDINATO,
// altrimenti conditions.ts ordinale() darebbe indexOf -1 e la regola si applicherebbe a casaccio
const ORDINE_CAMPO: Record<string, readonly (string | number)[]> = {
  fasciaReddito: ORDINE_REDDITO,
  fasciaIsee: ORDINE_ISEE,
  titoloStudio: ORDINE_TITOLO
};

// valida un singolo valore (di un 'eq', 'almeno', 'alPiu', o un elemento di 'in') contro il dominio del campo
function valoreNonValido(campo: string, op: string, v: unknown): string | null {
  if (CAMPI_TESTO.includes(campo)) {
    return typeof v === 'string' && v.length > 0 ? null : `il campo ${campo} vuole una stringa di testo`;
  }
  if (CAMPI_NUMERICI.includes(campo)) {
    if (typeof v !== 'number') return `il campo ${campo} vuole un numero, non ${JSON.stringify(v)}`;
    const dominio = VALORI_CAMPO[campo];
    return !dominio || dominio.includes(v) ? null : `valore ${v} fuori dai valori ammessi per ${campo} (${dominio.join(', ')})`;
  }
  // campi a enum: per almeno/alPiu il valore deve stare nell'elenco ordinato
  const dominio = (op === 'almeno' || op === 'alPiu') && ORDINE_CAMPO[campo] ? ORDINE_CAMPO[campo] : VALORI_CAMPO[campo];
  if (!dominio) return null;
  return dominio.includes(v as string) ? null : `valore ${JSON.stringify(v)} non valido per ${campo} (ammessi: ${dominio.join(', ')})`;
}

// solo http/https: z.url() da solo accetterebbe anche schemi pericolosi come javascript:
export const SchemaUrlSicuro = z.string().url().refine((u) => /^https?:\/\//i.test(u), 'solo URL http o https');

const SchemaFonte = z.object({ etichetta: z.string().min(1), url: SchemaUrlSicuro });

const SchemaCondizione = z.object({
  campo: z.enum(CAMPI_PROFILO),
  op: z.enum(['eq', 'in', 'nonContiene', 'almeno', 'alPiu']),
  valore: z.unknown()
}).superRefine((c, ctx) => {
  if ((c.op === 'in' || c.op === 'nonContiene') && !Array.isArray(c.valore)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `op '${c.op}' richiede un array come valore (campo ${c.campo})` });
  }
  if ((c.op === 'almeno' || c.op === 'alPiu') && !CAMPI_ORDINALI.includes(c.campo)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `op '${c.op}' è valido solo su campi ordinali (${CAMPI_ORDINALI.join(', ')}), non su ${c.campo}` });
  }
  if (c.op === 'eq' && CAMPI_ARRAY.includes(c.campo)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: `il campo ${c.campo} è una lista: usa l'operatore 'in' invece di 'eq'` });
  }
  // valida il valore contro il dominio del campo (intercetta i typo)
  if (c.op === 'in' || c.op === 'nonContiene') {
    if (Array.isArray(c.valore)) {
      for (const x of c.valore) {
        const errore = valoreNonValido(c.campo, c.op, x);
        if (errore) ctx.addIssue({ code: z.ZodIssueCode.custom, message: errore });
      }
    }
  } else {
    const errore = valoreNonValido(c.campo, c.op, c.valore);
    if (errore) ctx.addIssue({ code: z.ZodIssueCode.custom, message: errore });
  }
});

const SchemaDirittoToccato = z.object({
  carta: z.string().min(1),
  articolo: z.string().min(1),
  diritto: z.string().min(1),
  intensita: z.enum(['lieve', 'sensibile', 'grave']),
  url: SchemaUrlSicuro.optional()
});

const SchemaEffetto = z.object({
  tipo: z.enum(['economico', 'diritto', 'dovere', 'servizio', 'qualita-vita']),
  importoMese: z.object({ min: z.number(), max: z.number() })
    .refine((i) => i.min <= i.max, 'min deve essere <= max').optional(),
  descrizione: z.string().min(1),
  direzione: z.enum(['positivo', 'negativo', 'neutro', 'misto']),
  indiretto: z.boolean().optional(),
  dirittoToccato: SchemaDirittoToccato.optional()
}).superRefine((e, ctx) => {
  if (e.importoMese && e.tipo !== 'economico') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'importoMese è consentito solo per effetti di tipo economico' });
  }
  if (e.importoMese && e.direzione !== 'positivo' && e.direzione !== 'negativo') {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'un effetto con importoMese deve avere direzione positivo o negativo (gli importi misti/neutri non entrano nei totali)' });
  }
  if (e.dirittoToccato && e.indiretto !== true) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'dirittoToccato vive tra gli effetti indiretti: serve indiretto: true' });
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

// Valida il profilo salvato sul dispositivo: un localStorage corrotto o di una
// versione vecchia non deve far girare il motore con dati incoerenti.
export const SchemaProfilo = z.object({
  schemaVersion: z.literal(1),
  nome: z.string().optional(),
  eta: z.number().int().min(0).max(120),
  genere: z.enum(['donna', 'uomo', 'non-binario', 'preferisco-non-dirlo']).optional(),
  identitaGenere: z.enum(['cisgender', 'transgender', 'preferisco-non-dirlo']).optional(),
  orientamento: z.enum(['eterosessuale', 'omosessuale', 'bisessuale', 'altro', 'preferisco-non-dirlo']).optional(),
  statoCivile: z.enum(['non-sposato', 'sposato', 'unione-civile', 'separato', 'vedovo']).optional(),
  regione: z.string().optional(),
  // migrazione: i profili vecchi salvavano una sola occupazione come stringa; la avvolgiamo in un array
  condizioneLavorativa: z.preprocess(
    (v) => (typeof v === 'string' ? [v] : v),
    z.array(z.enum(['dipendente-privato', 'dipendente-pubblico', 'autonomo-ordinario', 'forfettario', 'imprenditore', 'studente', 'pensionato', 'disoccupato', 'caregiver', 'casalingo', 'altro'])).optional()
  ),
  fasciaReddito: z.enum(['nessuno', 'fino9k', 'da9a15k', 'da15a20k', 'da20a28k', 'da28a35k', 'da35a50k', 'oltre50k']).optional(),
  fasciaIsee: z.enum(['fino9360', 'da9360a15k', 'da15a25k', 'da25a40k', 'oltre40k', 'nonLoSo']).optional(),
  figli: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
  personeACarico: z.boolean().optional(),
  tipiACarico: z.array(z.enum(['figli-minorenni', 'figli-maggiorenni', 'familiare-disabile', 'genitori-anziani'])).optional(),
  abitazione: z.enum(['proprieta', 'affitto', 'comodato', 'altro']).optional(),
  numeroProprieta: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
  titoloStudio: z.enum(['nessuno', 'medie', 'diploma', 'laurea']).optional(),
  disabilita: z.array(z.enum(['nessuna', 'motoria', 'visiva', 'uditiva', 'intellettiva', 'malattia-cronica', 'condizione-non-riconosciuta'])).optional(),
  cittadinanza: z.enum(['italiana', 'ue', 'extra-ue']).optional(),
  permessoSoggiorno: z.enum(['si', 'no', 'preferisco-non-dirlo']).optional(),
  religione: z.enum(['nessuna', 'cattolica', 'altra-cristiana', 'musulmana', 'ebraica', 'altra', 'preferisco-non-dirlo']).optional()
});

export const SchemaLegge = z.object({
  id: z.string().min(1),
  titoloDivulgativo: z.string().min(1),
  titoloUfficiale: z.string().min(1),
  meseAnno: z.string().min(1).optional(),
  stato: z.enum(['vigore', 'approvata', 'discussione', 'bozza', 'referendum']),
  ambiti: z.array(z.enum(['fisco-lavoro', 'pensioni-welfare', 'casa', 'diritti-salute', 'sicurezza-privacy', 'doveri', 'scuola-universita-ricerca', 'politica-voto', 'ambiente', 'turismo', 'arte'])).min(1),
  origine: z.enum(['italiana', 'europea']).optional(),
  fonti: z.array(SchemaFonte).min(1),
  verificataIl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  riassunto: z.string().min(10),
  regole: z.array(SchemaRegola).min(1)
});

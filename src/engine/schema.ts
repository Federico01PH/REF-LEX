import { z } from 'zod';

const SchemaFonte = z.object({ etichetta: z.string().min(1), url: z.string().url() });

const SchemaEffetto = z.object({
  tipo: z.enum(['economico', 'diritto', 'dovere', 'servizio', 'qualita-vita']),
  importoMese: z.object({ min: z.number(), max: z.number() })
    .refine((i) => i.min <= i.max, 'min deve essere <= max').optional(),
  descrizione: z.string().min(1),
  direzione: z.enum(['positivo', 'negativo', 'neutro', 'misto'])
});

const SchemaRegola = z.object({
  id: z.string().min(1),
  condizioni: z.array(z.object({
    campo: z.string(), op: z.enum(['eq', 'in', 'almeno', 'alPiu']), valore: z.unknown()
  })),
  campiNecessari: z.array(z.string()),
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
  fonti: z.array(SchemaFonte).min(1),
  verificataIl: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  riassunto: z.string().min(10),
  regole: z.array(SchemaRegola).min(1)
});

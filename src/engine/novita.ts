import { z } from 'zod';
import { SchemaLegge, SchemaUrlSicuro } from './schema';

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

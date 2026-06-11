import { SchemaCatalogoRemoto, SchemaNovitaFile, type NovitaFile } from '../engine/novita';
import type { Legge } from '../engine/types';

const CHIAVE_CACHE = 'reflex.catalogo.cache';

export interface CatalogoRemoto { versione: number; generatoIl: string; leggi: Legge[]; }

async function scaricaJson(percorso: string): Promise<unknown | null> {
  try {
    const base = import.meta.env?.BASE_URL ?? '/';
    const risposta = await fetch(`${base}${percorso}`, { cache: 'no-store' });
    if (!risposta.ok) return null;
    return await risposta.json();
  } catch {
    return null;
  }
}

function leggiCache(versioneLocale: number): CatalogoRemoto | null {
  try {
    const grezzo = localStorage.getItem(CHIAVE_CACHE);
    if (!grezzo) return null;
    const esito = SchemaCatalogoRemoto.safeParse(JSON.parse(grezzo));
    if (!esito.success || esito.data.versione <= versioneLocale) return null;
    return esito.data as CatalogoRemoto;
  } catch {
    return null;
  }
}

export async function caricaCatalogoRemoto(versioneLocale: number): Promise<CatalogoRemoto | null> {
  const grezzo = await scaricaJson('dati/catalogo.json');
  if (grezzo !== null) {
    const esito = SchemaCatalogoRemoto.safeParse(grezzo);
    if (esito.success && esito.data.versione > versioneLocale) {
      try { localStorage.setItem(CHIAVE_CACHE, JSON.stringify(esito.data)); } catch { /* solo sessione */ }
      return esito.data as CatalogoRemoto;
    }
    if (esito.success) return null; // remoto valido ma non più nuovo
  }
  return leggiCache(versioneLocale);
}

export async function caricaNovita(): Promise<NovitaFile | null> {
  const grezzo = await scaricaJson('dati/novita.json');
  if (grezzo === null) return null;
  const esito = SchemaNovitaFile.safeParse(grezzo);
  return esito.success ? esito.data : null;
}

import type { Profilo } from '../engine/types';
import { SchemaProfilo } from '../engine/schema';

const CHIAVE = 'reflex.profilo.v1';

export function storageDisponibile(): boolean {
  try {
    localStorage.setItem('reflex.test', '1');
    localStorage.removeItem('reflex.test');
    return true;
  } catch {
    return false;
  }
}

export function caricaProfilo(): Profilo | null {
  try {
    const grezzo = localStorage.getItem(CHIAVE);
    if (!grezzo) return null;
    const esito = SchemaProfilo.safeParse(JSON.parse(grezzo));
    if (!esito.success) {
      localStorage.removeItem(CHIAVE);
      return null;
    }
    return esito.data as Profilo;
  } catch {
    try { localStorage.removeItem(CHIAVE); } catch { /* storage non disponibile */ }
    return null;
  }
}

export function salvaProfilo(profilo: Profilo): void {
  try { localStorage.setItem(CHIAVE, JSON.stringify(profilo)); } catch { /* modalità solo-sessione */ }
}

const CHIAVE_TEMA = 'reflex.tema';

export function caricaTema(): string {
  try { return localStorage.getItem(CHIAVE_TEMA) ?? 'auto'; } catch { return 'auto'; }
}

export function salvaTema(tema: string): void {
  try { localStorage.setItem(CHIAVE_TEMA, tema); } catch { /* modalità solo-sessione */ }
}

export function cancellaTutto(): void {
  try {
    for (const chiave of Object.keys(localStorage)) {
      if (chiave.startsWith('reflex.')) localStorage.removeItem(chiave);
    }
  } catch { /* storage non disponibile */ }
}

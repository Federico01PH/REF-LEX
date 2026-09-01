import { detenzioneDomiciliareDipendenze } from '../../src/data/laws/detenzione-domiciliare-dipendenze';
import { CATALOGO } from '../../src/data/laws';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import { settoriDaProfessione } from '../../src/engine/professioni';
import type { Profilo } from '../../src/engine/types';

const idEffetti = (p: Profilo) => simula(p, detenzioneDomiciliareDipendenze).effetti.map((e) => e.id);

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(detenzioneDomiciliareDipendenze);
  if (!esito.success) throw new Error(esito.error.message);
});

test('è nel catalogo', () => {
  expect(CATALOGO.map((l) => l.id)).toContain('legge-140-2026-detenzione-domiciliare');
});

// Verified: L. 5 agosto 2026, n. 140, GU n. 181 del 6/8/2026, in vigore dal 21/8/2026.
test('è una legge dello Stato già in vigore', () => {
  expect(detenzioneDomiciliareDipendenze.stato).toBe('vigore');
  expect(detenzioneDomiciliareDipendenze.meseAnno).toBe('agosto 2026');
  expect(detenzioneDomiciliareDipendenze.regole.every((r) => r.confidenza === 'certa')).toBe(true);
});

test('un maggiorenne qualsiasi vede la misura e il suo prezzo, non i compiti della sanità', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, settoriProfessionali: ['altro'] };
  const ids = idEffetti(p);
  expect(ids).toContain('l140-detenzione-domiciliare-terapeutica');
  expect(ids).toContain('l140-controlli-e-revoca');
  expect(ids).not.toContain('l140-lavoro-nella-sanita');
});

test('il minorenne non riceve la misura: ha un sistema penale suo', () => {
  const ids = idEffetti({ schemaVersion: 1, eta: 17, settoriProfessionali: ['altro'] });
  expect(ids).not.toContain('l140-detenzione-domiciliare-terapeutica');
  expect(ids).not.toContain('l140-controlli-e-revoca');
});

// Verified: i limiti di pena sono otto anni, quattro per i reati dell'art. 4-bis della
// L. 354/1975, ma restano otto per rapina ed estorsione aggravate.
test('la descrizione dice i limiti di pena veri: otto anni, quattro per i reati più gravi', () => {
  const r = detenzioneDomiciliareDipendenze.regole
    .find((x) => x.id === 'l140-detenzione-domiciliare-terapeutica')!;
  expect(r.effetto.descrizione).toContain('otto anni');
  expect(r.effetto.descrizione).toContain('quattro anni');
  expect(r.effetto.descrizione).toContain('4-bis');
  expect(r.effetto.direzione).toBe('positivo');
});

// Non è un diritto automatico: decide il tribunale di sorveglianza. E manca ancora il DPCM
// sulla commissione centrale, da adottare entro 120 giorni dall'entrata in vigore.
test('la nota dice che non è automatica e che manca ancora il decreto attuativo', () => {
  const r = detenzioneDomiciliareDipendenze.regole
    .find((x) => x.id === 'l140-detenzione-domiciliare-terapeutica')!;
  expect(r.noteConfidenza).toMatch(/centoventi giorni/i);
  expect(r.noteConfidenza).toMatch(/non è un diritto automatico/i);
});

test('il prezzo della misura è ancorato all\'art. 32 Cost. con intensità lieve', () => {
  const r = detenzioneDomiciliareDipendenze.regole.find((x) => x.id === 'l140-controlli-e-revoca')!;
  expect(r.effetto.indiretto).toBe(true);
  expect(r.effetto.direzione).toBe('misto');
  expect(r.effetto.dirittoToccato?.articolo).toBe('art. 32');
  expect(r.effetto.dirittoToccato?.intensita).toBe('lieve');
  // l'intensità è lieve perché nessuno è obbligato: la misura si chiede
  expect(r.noteConfidenza).toMatch(/nessuno viene obbligato/i);
});

test('chi lavora nella sanità riceve i compiti nuovi e il fondo', () => {
  const p: Profilo = { schemaVersion: 1, eta: 45, settoriProfessionali: ['sanita'] };
  const eff = simula(p, detenzioneDomiciliareDipendenze).effetti
    .find((e) => e.id === 'l140-lavoro-nella-sanita');
  expect(eff).toBeDefined();
  expect(eff!.effetto.direzione).toBe('misto');
  expect(eff!.effetto.descrizione).toContain('19.436.250');
});

// Il settore si ricava dal mestiere scritto in chiaro: verifichiamo che il percorso
// completo (professione -> settore -> regola) porti davvero all'effetto.
test('chi scrive "infermiere" come mestiere arriva alla regola sulla sanità', () => {
  const settori = settoriDaProfessione('infermiere');
  const p: Profilo = { schemaVersion: 1, eta: 45, professione: 'infermiere', settoriProfessionali: settori };
  expect(idEffetti(p)).toContain('l140-lavoro-nella-sanita');
});

// REF-LEX non chiede se hai una dipendenza né se hai una condanna: nessuna regola deve
// dipendere dal campo disabilita, altrimenti direbbe a chi ha una malattia cronica cose
// che non lo riguardano.
test('nessuna regola guarda il campo disabilità: la dipendenza non si deduce da lì', () => {
  for (const r of detenzioneDomiciliareDipendenze.regole) {
    expect(r.campiNecessari).not.toContain('disabilita');
    expect(r.condizioni.map((c) => c.campo)).not.toContain('disabilita');
  }
});

test('senza il settore professionale il motore lo chiede invece di indovinare', () => {
  const r = simula({ schemaVersion: 1, eta: 40 }, detenzioneDomiciliareDipendenze);
  expect(r.nonCalcolabili.map((x) => x.regola.id)).toEqual(['l140-lavoro-nella-sanita']);
});

test('non produce importi economici mensili', () => {
  const r = simula({ schemaVersion: 1, eta: 40, settoriProfessionali: ['sanita'] }, detenzioneDomiciliareDipendenze);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});

test('ogni effetto ha una frase breve entro i 120 caratteri', () => {
  for (const regola of detenzioneDomiciliareDipendenze.regole) {
    expect(regola.effetto.breve).toBeDefined();
    expect(regola.effetto.breve!.length).toBeLessThanOrEqual(120);
  }
});

test('le fonti sono istituzionali (Normattiva, Gazzetta Ufficiale, Senato)', () => {
  const ammessi = ['normattiva.it', 'gazzettaufficiale.it', 'senato.it'];
  for (const f of detenzioneDomiciliareDipendenze.fonti)
    expect(ammessi.some((d) => f.url.includes(d))).toBe(true);
});

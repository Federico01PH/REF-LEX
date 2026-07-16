import { trasparenzaProgrammi } from '../../src/data/laws/trasparenza-programmi-elettorali';
import { CATALOGO } from '../../src/data/laws';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const idEffetti = (p: Profilo) => simula(p, trasparenzaProgrammi).effetti.map((e) => e.id);

const ITALIANO_MAGGIORENNE: Profilo = { schemaVersion: 1, eta: 40, cittadinanza: 'italiana' };

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(trasparenzaProgrammi);
  if (!esito.success) throw new Error(esito.error.message);
});

test('è nel catalogo', () => {
  expect(CATALOGO.map((l) => l.id)).toContain('ddl-trasparenza-programmi-550');
});

test('è modellata come proposta, non come legge in vigore', () => {
  expect(trasparenzaProgrammi.stato).toBe('discussione');
  // meseAnno si mostra solo per le leggi già in vigore: questa è ferma dal 2023
  expect(trasparenzaProgrammi.meseAnno).toBeUndefined();
  // atto mai esaminato: nessun effetto può essere dato per certo o probabile
  expect(trasparenzaProgrammi.regole.every((r) => r.confidenza === 'dipende')).toBe(true);
  for (const r of trasparenzaProgrammi.regole)
    for (const o of ['anno1', 'anno2', 'anno5', 'anno10'] as const)
      expect(r.timeline[o]).toBe('incerto');
});

test("l'elettore italiano maggiorenne vota più informato: effetto positivo e indiretto", () => {
  const eff = simula(ITALIANO_MAGGIORENNE, trasparenzaProgrammi).effetti
    .find((e) => e.id === 'trasparenza-voto-informato');
  expect(eff).toBeDefined();
  expect(eff!.effetto.tipo).toBe('diritto');
  expect(eff!.effetto.direzione).toBe('positivo');
  // la legge parla ai partiti, al Viminale e all'UPB: raggiunge l'elettore di riflesso
  expect(eff!.effetto.indiretto).toBe(true);
});

test("il voto informato NON usa dirittoToccato: l'art. 48 qui è rafforzato, non compresso", () => {
  const r = trasparenzaProgrammi.regole.find((x) => x.id === 'trasparenza-voto-informato');
  expect(r!.effetto.dirittoToccato).toBeUndefined();
});

test('il minorenne non riceve il voto informato, perché alle politiche non vota', () => {
  const p: Profilo = { schemaVersion: 1, eta: 17, cittadinanza: 'italiana' };
  expect(idEffetti(p)).not.toContain('trasparenza-voto-informato');
});

test("il cittadino italiano vede la barriera tecnica per i partiti nuovi, ancorata all'art. 49 Cost.", () => {
  const eff = simula(ITALIANO_MAGGIORENNE, trasparenzaProgrammi).effetti
    .find((e) => e.id === 'trasparenza-barriera-partiti-nuovi');
  expect(eff).toBeDefined();
  expect(eff!.effetto.direzione).toBe('misto');
  expect(eff!.effetto.indiretto).toBe(true);
  expect(eff!.effetto.dirittoToccato?.carta).toBe('Costituzione italiana');
  expect(eff!.effetto.dirittoToccato?.articolo).toBe('art. 49');
  expect(eff!.effetto.dirittoToccato?.intensita).toBe('lieve');
});

test("la barriera sull'art. 49 vale a ogni età: associarsi in un partito non richiede 18 anni", () => {
  const p: Profilo = { schemaVersion: 1, eta: 16, cittadinanza: 'italiana' };
  expect(idEffetti(p)).toContain('trasparenza-barriera-partiti-nuovi');
});

test('la nota della barriera dichiara che è una lettura di REF-LEX e non il parere di un ente', () => {
  const r = trasparenzaProgrammi.regole.find((x) => x.id === 'trasparenza-barriera-partiti-nuovi');
  expect(r!.noteConfidenza).toMatch(/mai (stato )?esaminat/i);
});

test('chi non ha cittadinanza italiana non vota alle politiche: effetto neutro dedicato', () => {
  for (const cittadinanza of ['ue', 'extra-ue'] as const) {
    const p: Profilo = { schemaVersion: 1, eta: 35, cittadinanza };
    const ids = idEffetti(p);
    expect(ids).toContain('trasparenza-chi-non-vota');
    expect(ids).not.toContain('trasparenza-voto-informato');
    // l'art. 49 parla di "tutti i cittadini": la barriera non li riguarda
    expect(ids).not.toContain('trasparenza-barriera-partiti-nuovi');
  }
});

test("chi non vota non ha dirittoToccato: l'esclusione viene dall'art. 48 Cost., non da questo DDL", () => {
  const r = trasparenzaProgrammi.regole.find((x) => x.id === 'trasparenza-chi-non-vota');
  expect(r!.effetto.direzione).toBe('neutro');
  expect(r!.effetto.dirittoToccato).toBeUndefined();
});

test('il permesso di soggiorno non cambia nulla: né Karim né Omar votano alle politiche', () => {
  const karim: Profilo = { schemaVersion: 1, eta: 45, cittadinanza: 'extra-ue', permessoSoggiorno: 'si' };
  const omar: Profilo = { schemaVersion: 1, eta: 28, cittadinanza: 'extra-ue', permessoSoggiorno: 'no' };
  expect(idEffetti(karim)).toEqual(idEffetti(omar));
});

test('senza la cittadinanza il motore chiede il dato invece di indovinare', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40 };
  const r = simula(p, trasparenzaProgrammi);
  expect(r.effetti).toEqual([]);
  expect(r.nonCalcolabili.map((x) => x.regola.id).sort()).toEqual(
    ['trasparenza-barriera-partiti-nuovi', 'trasparenza-chi-non-vota', 'trasparenza-voto-informato']
  );
});

test('non produce importi economici mensili', () => {
  const r = simula(ITALIANO_MAGGIORENNE, trasparenzaProgrammi);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
  expect(r.totaleMese.anno10).toEqual({ min: 0, max: 0 });
});

test('ogni effetto ha una frase breve entro i 120 caratteri', () => {
  for (const regola of trasparenzaProgrammi.regole) {
    expect(regola.effetto.breve).toBeDefined();
    expect(regola.effetto.breve!.length).toBeLessThanOrEqual(120);
  }
});

test('le fonti sono istituzionali', () => {
  const ammessi = ['senato.it', 'normattiva.it', 'upbilancio.it'];
  for (const f of trasparenzaProgrammi.fonti)
    expect(ammessi.some((d) => f.url.includes(d))).toBe(true);
});

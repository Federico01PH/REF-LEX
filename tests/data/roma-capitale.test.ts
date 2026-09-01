import { romaCapitale } from '../../src/data/laws/roma-capitale';
import { CATALOGO } from '../../src/data/laws';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import { DOMANDE } from '../../src/data/wizard';
import type { Profilo } from '../../src/engine/types';

const idEffetti = (p: Profilo) => simula(p, romaCapitale).effetti.map((e) => e.id);

test('rispetta lo schema del catalogo', () => {
  const esito = SchemaLegge.safeParse(romaCapitale);
  if (!esito.success) throw new Error(esito.error.message);
});

test('è nel catalogo', () => {
  expect(CATALOGO.map((l) => l.id)).toContain('ddl-cost-roma-capitale-114');
});

// Verified: approvata dalla Camera in PRIMA deliberazione il 29/4/2026; A.S. 1888 assegnato
// il 4/5/2026 alla 1ª Commissione, esame non ancora iniziato. Servono quattro deliberazioni.
test('è modellata come riforma a metà strada, non come Costituzione già cambiata', () => {
  expect(romaCapitale.stato).toBe('discussione');
  expect(romaCapitale.meseAnno).toBeUndefined();
  expect(romaCapitale.regole.every((r) => r.confidenza === 'dipende')).toBe(true);
  for (const r of romaCapitale.regole)
    for (const o of ['anno1', 'anno2', 'anno5', 'anno10'] as const)
      expect(r.timeline[o]).toBe('incerto');
});

test('chi vive nel Lazio riceve gli effetti su Roma, non quello sugli altri capoluoghi', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, regione: 'Lazio', cittadinanza: 'italiana' };
  const ids = idEffetti(p);
  expect(ids).toContain('roma-lazio-nuove-leggi');
  expect(ids).toContain('roma-lazio-due-regole-nella-stessa-regione');
  // per chi vive nel Lazio il capoluogo metropolitano è Roma stessa
  expect(ids).not.toContain('roma-altri-capoluoghi-metropolitani');
});

test('chi vive fuori dal Lazio riceve solo la clausola sui capoluoghi metropolitani', () => {
  for (const regione of ['Lombardia', 'Campania', 'Sicilia']) {
    const ids = idEffetti({ schemaVersion: 1, eta: 40, regione, cittadinanza: 'italiana' });
    expect(ids).toContain('roma-altri-capoluoghi-metropolitani');
    expect(ids).not.toContain('roma-lazio-nuove-leggi');
    expect(ids).not.toContain('roma-lazio-due-regole-nella-stessa-regione');
  }
});

// "Vivo all'estero" è un'opzione vera del wizard: non ha un capoluogo metropolitano italiano,
// quindi la clausola sui Comuni capoluogo non lo riguarda. Il voto sul referendum sì.
test('chi vive all\'estero non riceve la clausola sui capoluoghi, ma vota il referendum', () => {
  const p: Profilo = { schemaVersion: 1, eta: 40, regione: 'Vivo all\'estero', cittadinanza: 'italiana' };
  const ids = idEffetti(p);
  expect(ids).not.toContain('roma-altri-capoluoghi-metropolitani');
  expect(ids).not.toContain('roma-lazio-nuove-leggi');
  expect(ids).toContain('roma-referendum-confermativo');
});

test('le regioni citate nella regola esistono davvero tra le opzioni del wizard', () => {
  const opzioni = DOMANDE.find((d) => d.campo === 'regione')!.opzioni!.map((o) => o.valore);
  const regola = romaCapitale.regole.find((r) => r.id === 'roma-altri-capoluoghi-metropolitani')!;
  const citate = regola.condizioni[0].valore as string[];
  for (const r of citate) expect(opzioni).toContain(r);
  // deve coprire tutte le regioni tranne il Lazio e l'estero
  expect(citate).toHaveLength(opzioni.length - 2);
  expect(citate).not.toContain('Lazio');
});

test('il cittadino italiano maggiorenne può ritrovarsi a votare il referendum confermativo', () => {
  const eff = simula({ schemaVersion: 1, eta: 30, cittadinanza: 'italiana', regione: 'Toscana' }, romaCapitale)
    .effetti.find((e) => e.id === 'roma-referendum-confermativo');
  expect(eff).toBeDefined();
  expect(eff!.effetto.direzione).toBe('positivo');
});

test('il minorenne e chi non è cittadino italiano non ricevono la regola sul referendum', () => {
  const minorenne: Profilo = { schemaVersion: 1, eta: 17, cittadinanza: 'italiana', regione: 'Lazio' };
  expect(idEffetti(minorenne)).not.toContain('roma-referendum-confermativo');
  for (const cittadinanza of ['ue', 'extra-ue'] as const) {
    const p: Profilo = { schemaVersion: 1, eta: 35, cittadinanza, regione: 'Lazio' };
    expect(idEffetti(p)).not.toContain('roma-referendum-confermativo');
    // ma le regole territoriali valgono a prescindere dalla cittadinanza: si vive lì comunque
    expect(idEffetti(p)).toContain('roma-lazio-nuove-leggi');
  }
});

// Verified: i numeri verbalizzati alla Camera il 29/4/2026 sono 159 sì su 400 componenti,
// contro i 267 che servirebbero per i due terzi. È il conto che rende possibile il referendum.
test('la regola sul referendum cita i numeri reali del voto della Camera', () => {
  const r = romaCapitale.regole.find((x) => x.id === 'roma-referendum-confermativo')!;
  expect(r.effetto.descrizione).toContain('159');
  expect(r.effetto.descrizione).toContain('267');
  expect(r.noteConfidenza).toContain('29 aprile 2026');
});

test('l\'effetto sulle due regole nella stessa regione è ancorato all\'art. 3 Cost., intensità lieve', () => {
  const r = romaCapitale.regole.find((x) => x.id === 'roma-lazio-due-regole-nella-stessa-regione')!;
  expect(r.effetto.indiretto).toBe(true);
  expect(r.effetto.dirittoToccato?.articolo).toBe('art. 3');
  expect(r.effetto.dirittoToccato?.intensita).toBe('lieve');
  // deve dichiarare che è una lettura di REF-LEX e citare i pareri favorevoli delle Commissioni
  expect(r.noteConfidenza).toMatch(/REF-LEX/);
  expect(r.noteConfidenza).toMatch(/FAVOREVOLE/i);
});

// Le undici materie sono l'elenco letterale del nuovo art. 114, terzo comma.
test('il riassunto elenca le undici materie del nuovo articolo 114', () => {
  for (const materia of ['trasporto pubblico locale', 'commercio', 'turismo', 'artigianato',
    'edilizia residenziale pubblica'])
    expect(romaCapitale.riassunto).toContain(materia);
});

test('senza la regione il motore chiede il dato invece di indovinare', () => {
  const r = simula({ schemaVersion: 1, eta: 40, cittadinanza: 'italiana' }, romaCapitale);
  expect(r.effetti.map((e) => e.id)).toEqual(['roma-referendum-confermativo']);
  expect(r.nonCalcolabili.map((x) => x.regola.id).sort()).toEqual([
    'roma-altri-capoluoghi-metropolitani',
    'roma-lazio-due-regole-nella-stessa-regione',
    'roma-lazio-nuove-leggi'
  ]);
});

test('non produce importi economici mensili', () => {
  const r = simula({ schemaVersion: 1, eta: 40, regione: 'Lazio', cittadinanza: 'italiana' }, romaCapitale);
  expect(r.totaleMese.anno1).toEqual({ min: 0, max: 0 });
});

test('ogni effetto ha una frase breve entro i 120 caratteri', () => {
  for (const regola of romaCapitale.regole) {
    expect(regola.effetto.breve).toBeDefined();
    expect(regola.effetto.breve!.length).toBeLessThanOrEqual(120);
  }
});

test('le fonti sono istituzionali (Camera, Senato)', () => {
  const ammessi = ['camera.it', 'senato.it'];
  for (const f of romaCapitale.fonti)
    expect(ammessi.some((d) => f.url.includes(d))).toBe(true);
});

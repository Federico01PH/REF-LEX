import { leggeElettorale } from '../../src/data/laws/legge-elettorale-2026';
import { premierato } from '../../src/data/laws/premierato-2026';
import { SchemaLegge } from '../../src/engine/schema';
import { simula } from '../../src/engine/simulate';
import type { Profilo } from '../../src/engine/types';

const ids = (p: Profilo) => simula(p, leggeElettorale).effetti.map((e) => e.id);
const effetto = (p: Profilo, id: string) => simula(p, leggeElettorale).effetti.find((e) => e.id === id);
const italiano = (extra: Partial<Profilo> = {}): Profilo => ({ schemaVersion: 1, eta: 40, cittadinanza: 'italiana', ...extra });

test('legge elettorale e premierato rispettano lo schema', () => {
  for (const legge of [leggeElettorale, premierato]) {
    const esito = SchemaLegge.safeParse(legge);
    if (!esito.success) throw new Error(`${legge.id}: ${esito.error.message}`);
  }
});

test('premierato: resta una proposta, tutto "dipende" e a orizzonte incerto', () => {
  expect(premierato.stato).toBe('discussione');
  expect(premierato.regole.every((r) => r.confidenza === 'dipende')).toBe(true);
  expect(premierato.regole.every((r) => Object.values(r.timeline).every((v) => v === 'incerto'))).toBe(true);
});

// Al 6/10/2026: approvata dalla Camera (16/7) e, con modifiche, dal Senato (15/9); il testo
// A.C. 2822-B è blindato dalla fiducia ma manca il voto finale della Camera (previsto l'8/10).
// Quindi non è ancora legge: niente "certa", niente meseAnno.
test('legge elettorale: testo A.C. 2822-B modificato dal Senato, manca il voto finale della Camera', () => {
  expect(leggeElettorale.stato).toBe('discussione');
  expect(leggeElettorale.meseAnno).toBeUndefined();
  expect(leggeElettorale.titoloUfficiale).toContain('2822-B');
  expect(leggeElettorale.riassunto).toContain('15 settembre 2026');
  expect(leggeElettorale.riassunto).toContain('8 ottobre');
  expect(leggeElettorale.regole.every((r) => r.confidenza !== 'certa')).toBe(true);
  expect(leggeElettorale.regole.every((r) => !!r.effetto.breve)).toBe(true);
});

test('un italiano maggiorenne vede come si vota, il premio e le firme per i partiti nuovi', () => {
  expect(ids(italiano({ genere: 'uomo' }))).toEqual(
    ['elettorale-come-voti', 'elettorale-premio-governabilita', 'elettorale-firme-nuovi-partiti']
  );
});

test('chi non vota alle politiche (minorenne, cittadino UE o extra-UE) non ha effetti', () => {
  expect(ids(italiano({ eta: 16 }))).toHaveLength(0);
  expect(ids({ schemaVersion: 1, eta: 40, cittadinanza: 'ue' })).toHaveLength(0);
  expect(ids({ schemaVersion: 1, eta: 40, cittadinanza: 'extra-ue' })).toHaveLength(0);
});

test('come si vota: tornano le preferenze (fino a tre), ma il capolista resta bloccato', () => {
  const r = effetto(italiano(), 'elettorale-come-voti');
  expect(r?.effetto.descrizione).toContain('tre preferenze');
  expect(r?.effetto.descrizione).toContain('capolista');
  expect(r?.confidenza).toBe('probabile');
  // le prossime politiche cadono a cavallo del primo anno: prima incerto, poi attivo
  expect(r?.timeline.anno1).toBe('incerto');
  expect(r?.timeline.anno2).toBe('attivo');
});

test('premio di governabilità: effetto indiretto sull\'eguaglianza del voto (art. 48), sensibile', () => {
  const premio = effetto(italiano(), 'elettorale-premio-governabilita');
  expect(premio?.effetto.indiretto).toBe(true);
  expect(premio?.effetto.dirittoToccato?.articolo).toBe('art. 48');
  expect(premio?.effetto.dirittoToccato?.intensita).toBe('sensibile');
  expect(premio?.effetto.descrizione).toContain('42%');
});

// il Senato ha tolto il tetto del 60% per genere sui capilista (art. 18-bis, c. 3.1, secondo periodo)
test('una donna vede l\'effetto indiretto sui capilista senza vincolo di genere (art. 51), lieve', () => {
  const r = effetto(italiano({ genere: 'donna' }), 'elettorale-capilista-genere');
  expect(r?.effetto.indiretto).toBe(true);
  expect(r?.effetto.dirittoToccato?.articolo).toBe('art. 51');
  expect(r?.effetto.dirittoToccato?.intensita).toBe('lieve');
  expect(ids(italiano({ genere: 'uomo' }))).not.toContain('elettorale-capilista-genere');
});

test('firme per i partiti nuovi: barriera d\'ingresso ancorata all\'art. 49, lieve', () => {
  const r = effetto(italiano(), 'elettorale-firme-nuovi-partiti');
  expect(r?.effetto.indiretto).toBe(true);
  expect(r?.effetto.dirittoToccato?.articolo).toBe('art. 49');
  expect(r?.effetto.dirittoToccato?.intensita).toBe('lieve');
  expect(r?.effetto.descrizione).toContain('6.000');
});

// art. 8: chi studia o lavora in un'altra regione per almeno nove mesi può votare lì
test('voto fuori sede: lo vede chi studia o lavora, non il pensionato; è "dipende"', () => {
  const studente = effetto(italiano({ eta: 21, condizioneLavorativa: ['studente'] }), 'elettorale-fuori-sede');
  expect(studente?.effetto.direzione).toBe('positivo');
  expect(studente?.confidenza).toBe('dipende');
  expect(studente?.effetto.descrizione).toContain('nove mesi');
  expect(ids(italiano({ condizioneLavorativa: ['dipendente-privato'] }))).toContain('elettorale-fuori-sede');
  expect(ids(italiano({ eta: 70, condizioneLavorativa: ['pensionato'] }))).not.toContain('elettorale-fuori-sede');
});

// il Senato ha esteso il voto fuori sede ai caregiver di chi è curato in un'altra regione
test('il caregiver vede il voto nel comune dove assiste un familiare in cura', () => {
  const r = effetto(italiano({ condizioneLavorativa: ['caregiver'] }), 'elettorale-fuori-sede-cura');
  expect(r?.effetto.direzione).toBe('positivo');
  expect(r?.confidenza).toBe('dipende');
});

test('chi vive all\'estero vede le novità del voto per corrispondenza', () => {
  const r = effetto(italiano({ regione: 'Vivo all\'estero' }), 'elettorale-estero');
  expect(r).toBeDefined();
  expect(r?.effetto.descrizione).toContain('raccomandata');
  expect(ids(italiano({ regione: 'Lazio' }))).not.toContain('elettorale-estero');
});

test('premierato: elezione diretta + effetto indiretto su equilibrio dei poteri (art. 1)', () => {
  const p: Profilo = { schemaVersion: 1, eta: 50 };
  const eff = simula(p, premierato).effetti;
  expect(eff.map((e) => e.id)).toContain('premierato-elezione-diretta');
  const poteri = eff.find((e) => e.id === 'premierato-equilibrio-poteri');
  expect(poteri?.effetto.indiretto).toBe(true);
  expect(poteri?.effetto.dirittoToccato?.articolo).toBe('art. 1');
});

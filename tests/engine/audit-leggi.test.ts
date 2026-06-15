import { CATALOGO } from '../../src/data/laws';
import { DOMANDE } from '../../src/data/wizard';
import { simula, rilevanza } from '../../src/engine/simulate';
import { valutaCondizioni, campiMancanti } from '../../src/engine/conditions';
import { SchemaProfilo } from '../../src/engine/schema';
import { ORIZZONTI } from '../../src/engine/types';
import type { Legge, Profilo } from '../../src/engine/types';

// AUDIT ESAUSTIVO: per ogni legge enumera TUTTI i soggetti possibili limitatamente
// ai campi che quella legge legge davvero (gli altri campi non possono cambiarne l'esito).
// Su tutto lo spazio verifica gli invarianti di correttezza e completezza del motore.

const CAMPI_ARRAY = new Set(['disabilita', 'condizioneLavorativa', 'tipiACarico']);

// valori che le risposte del wizard possono produrre per un campo (le "opzioni raccoglibili")
function opzioniWizard(campo: string): unknown[] | null {
  const d = DOMANDE.find((x) => x.campo === campo);
  return d?.opzioni ? d.opzioni.map((o) => o.valore) : null;
}

// tutte le età-soglia citate nelle condizioni, con i loro confini (n-1, n, n+1)
function soglieEta(): number[] {
  const s = new Set<number>([13, 18, 67, 120]);
  for (const legge of CATALOGO)
    for (const r of legge.regole)
      for (const c of r.condizioni)
        if (c.campo === 'eta' && typeof c.valore === 'number') {
          s.add(c.valore - 1); s.add(c.valore); s.add(c.valore + 1);
        }
  return [...s].filter((n) => n >= 0 && n <= 120);
}
const ETA = soglieEta();

// valori citati nelle condizioni di una legge per un campo (per 'in' è una lista → appiattita)
function valoriCitati(legge: Legge, campo: string): unknown[] {
  const out = new Set<unknown>();
  for (const r of legge.regole)
    for (const c of r.condizioni)
      if (c.campo === campo) {
        if (Array.isArray(c.valore)) for (const v of c.valore) out.add(v);
        else out.add(c.valore);
      }
  return [...out];
}

// dominio dei valori da provare per un campo, dentro una legge:
// "non risposto" (undefined) + opzioni del wizard + valori citati dalle condizioni.
// Per i campi-lista: undefined, lista vuota e ogni voce come singoletto.
function dominio(legge: Legge, campo: string): unknown[] {
  if (campo === 'eta') return ETA;
  const valori = new Set<unknown>();
  for (const v of opzioniWizard(campo) ?? []) valori.add(v);
  for (const v of valoriCitati(legge, campo)) valori.add(v);
  if (CAMPI_ARRAY.has(campo)) {
    const lista = [...valori];
    const dom: unknown[] = [undefined, []];
    for (const v of lista) dom.push([v]);                       // singole voci
    for (let i = 0; i < lista.length; i++)
      for (let j = i + 1; j < lista.length; j++) dom.push([lista[i], lista[j]]); // coppie (es. studente + dipendente)
    return dom;
  }
  return [undefined, ...valori];
}

function campiRilevanti(legge: Legge): string[] {
  const s = new Set<string>();
  for (const r of legge.regole) {
    for (const c of r.condizioni) s.add(c.campo);
    for (const f of r.campiNecessari) s.add(f);
  }
  return [...s];
}

// enumera (mixed-radix) il prodotto dei domini; campiona a caso oltre il limite
function* soggetti(legge: Legge, cap: number): Generator<Profilo> {
  const campi = campiRilevanti(legge);
  const domini = campi.map((c) => dominio(legge, c));
  const totale = domini.reduce((a, d) => a * d.length, 1);

  const costruisci = (scelte: number[]): Profilo => {
    const p: Record<string, unknown> = { schemaVersion: 1, eta: 40 };
    campi.forEach((c, i) => { const v = domini[i][scelte[i]]; if (v !== undefined) p[c] = v; });
    return p as unknown as Profilo;
  };

  if (totale <= cap) {
    const idx = domini.map(() => 0);
    for (let k = 0; k < totale; k++) {
      yield costruisci(idx);
      for (let i = domini.length - 1; i >= 0; i--) { if (++idx[i] < domini[i].length) break; idx[i] = 0; }
    }
  } else {
    for (let k = 0; k < cap; k++) {
      yield costruisci(domini.map((d) => Math.floor(Math.random() * d.length)));
    }
  }
}

// ricalcolo indipendente del totale mensile, identico alla formula di simulate.ts
function totaleAtteso(effetti: ReturnType<typeof simula>['effetti']) {
  const tot = Object.fromEntries(ORIZZONTI.map((o) => [o, { min: 0, max: 0 }])) as Record<string, { min: number; max: number }>;
  for (const o of ORIZZONTI)
    for (const r of effetti) {
      if (r.confidenza === 'dipende') continue;
      if (r.effetto.direzione !== 'positivo' && r.effetto.direzione !== 'negativo') continue;
      if (r.timeline[o] !== 'attivo') continue;
      const imp = r.effetto.importoMese;
      if (!imp) continue;
      const segno = r.effetto.direzione === 'negativo' ? -1 : 1;
      tot[o].min += segno * (segno < 0 ? imp.max : imp.min);
      tot[o].max += segno * (segno < 0 ? imp.min : imp.max);
    }
  return tot;
}

const CAP = 60000;

test('le condizioni di ogni regola usano solo campi dichiarati in campiNecessari (il motore può chiederli)', () => {
  const violazioni: string[] = [];
  for (const legge of CATALOGO)
    for (const r of legge.regole)
      for (const c of r.condizioni)
        if (!r.campiNecessari.includes(c.campo))
          violazioni.push(`${legge.id}/${r.id}: condizione su '${String(c.campo)}' non in campiNecessari`);
  expect(violazioni).toEqual([]);
});

test('motore corretto e completo su tutti i soggetti possibili (per ogni legge, spazio dei campi rilevanti)', () => {
  let soggettiTotali = 0;
  const regoleMaiAttive: string[] = [];

  for (const legge of CATALOGO) {
    const attivate = new Set<string>();

    for (const p of soggetti(legge, CAP)) {
      soggettiTotali++;
      let r: ReturnType<typeof simula>;
      try {
        r = simula(p, legge);
      } catch (e) {
        throw new Error(`simula() ha lanciato su ${legge.id} con profilo ${JSON.stringify(p)}: ${String(e)}`);
      }

      const idEff = r.effetti.map((x) => x.id);
      const idNC = r.nonCalcolabili.map((x) => x.regola.id);

      // 1) un id non può stare in due stati contemporaneamente
      expect(idEff.filter((id) => idNC.includes(id))).toEqual([]);
      // 2) nessun duplicato
      expect(new Set(idEff).size).toBe(idEff.length);

      // 3) contratto preciso effetto / non-calcolabile per OGNI regola della legge
      for (const regola of legge.regole) {
        const mancanti = campiMancanti(p, regola.campiNecessari);
        if (mancanti.length === 0) {
          // tutti i dati ci sono: la regola è applicata SE e SOLO SE le condizioni sono vere
          expect(idEff.includes(regola.id)).toBe(valutaCondizioni(p, regola.condizioni));
          expect(idNC.includes(regola.id)).toBe(false);
        } else {
          // manca un dato: mai applicata; non-calcolabile SE i dati presenti non la escludono già
          expect(idEff.includes(regola.id)).toBe(false);
          const condPresenti = valutaCondizioni(p, regola.condizioni.filter((c) => !mancanti.includes(c.campo)));
          expect(idNC.includes(regola.id)).toBe(condPresenti);
        }
      }

      // 4) i totali rispettano la formula prudente (certa/probabile, pos/neg, attivo, con importo)
      expect(r.totaleMese).toEqual(totaleAtteso(r.effetti));

      // 5) NESSUN IMPATTO: se la legge non ti tocca, il risultato è pulito e coerente
      if (idEff.length === 0 && idNC.length === 0) {
        for (const o of ORIZZONTI) expect(r.totaleMese[o]).toEqual({ min: 0, max: 0 });
        expect(rilevanza(p, legge)).toBe('bassa');
      }

      idEff.forEach((id) => attivate.add(id));
    }

    for (const regola of legge.regole)
      if (!attivate.has(regola.id)) regoleMaiAttive.push(`${legge.id}/${regola.id}`);
  }

  // ogni regola scritta deve essere raggiungibile da almeno un soggetto (niente regole morte)
  expect(regoleMaiAttive).toEqual([]);
  expect(soggettiTotali).toBeGreaterThan(1000);
});

test('ogni opzione raccoglibile dal wizard è un soggetto valido per lo schema del profilo', () => {
  const rifiutate: string[] = [];
  for (const d of DOMANDE) {
    if (!d.opzioni) continue;
    for (const o of d.opzioni) {
      const valore = d.tipo === 'multi' ? [o.valore] : o.valore;
      const esito = SchemaProfilo.safeParse({ schemaVersion: 1, eta: 30, [d.campo]: valore });
      if (!esito.success) rifiutate.push(`${String(d.campo)}=${JSON.stringify(o.valore)}`);
    }
  }
  expect(rifiutate).toEqual([]);
});

test('la simulazione è deterministica (stesso soggetto → stesso risultato)', () => {
  for (const legge of CATALOGO) {
    let n = 0;
    for (const p of soggetti(legge, 200)) {
      if (n++ >= 200) break;
      expect(JSON.stringify(simula(p, legge))).toBe(JSON.stringify(simula(p, legge)));
    }
  }
});

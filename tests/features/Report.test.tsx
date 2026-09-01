import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Report } from '../../src/features/Report';
import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';
import { salarioMinimo } from '../../src/data/laws/salario-minimo';
import { decretoSicurezza } from '../../src/data/laws/decreto-sicurezza';
import { decretoLavoro } from '../../src/data/laws/decreto-lavoro-2026';
import { rottamazioneQuinquies } from '../../src/data/laws/rottamazione-quinquies';
import { pensioniRequisiti } from '../../src/data/laws/pensioni-requisiti';
import type { Legge, Profilo } from '../../src/engine/types';

const dipendente: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: ['dipendente-privato'], fasciaReddito: 'da15a20k' };

test('mostra il totale del primo anno, il badge di confidenza e la fonte', () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  // l'intervallo compare sia nel totale sia nella riga effetto
  expect(screen.getAllByText(/da \+60 a \+80 €/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/^sicuro$/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('link', { name: /normattiva/i })).toBeInTheDocument();
  expect(screen.getByText(/a parità di tutte le altre leggi/i)).toBeInTheDocument();
});

test('quando la legge evolve nel tempo la timeline c\'è e cambia orizzonte', async () => {
  const p: Profilo = { schemaVersion: 1, eta: 28, condizioneLavorativa: ['disoccupato'] };
  render(<Report profilo={p} legge={decretoLavoro} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /10 anni/i }));
  expect(screen.getByRole('button', { name: /10 anni/i })).toHaveAttribute('aria-pressed', 'true');
});

test('senza evoluzione nel tempo la timeline non compare', () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.queryByRole('button', { name: /10 anni/i })).not.toBeInTheDocument();
});

test('legge non in vigore (delega in attuazione): avviso ben visibile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: ['dipendente-privato'], fasciaReddito: 'fino9k' };
  render(<Report profilo={p} legge={salarioMinimo} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/effetti non ancora attivi/i)).toBeInTheDocument();
});

test('legge che non tocca il profilo: messaggio chiaro e invito a vedere gli altri', () => {
  const pensionato: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: ['pensionato'], fasciaReddito: 'da9a15k' };
  render(<Report profilo={pensionato} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/non cambia nulla per te/i)).toBeInTheDocument();
});

test('campo mancante: invito ad aggiungere il dato', () => {
  const senzaReddito: Profilo = { schemaVersion: 1, eta: 30, condizioneLavorativa: ['dipendente-privato'] };
  render(<Report profilo={senzaReddito} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/aggiungi questo dato al profilo/i)).toBeInTheDocument();
});

test('gli effetti indiretti hanno una sezione separata con spiegazione', () => {
  const extraUe: Profilo = { schemaVersion: 1, eta: 30, cittadinanza: 'extra-ue', abitazione: 'affitto' };
  render(<Report profilo={extraUe} legge={decretoSicurezza} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByRole('heading', { name: /effetti indiretti/i })).toBeInTheDocument();
  expect(screen.getByText(/ti tocca di riflesso/i)).toBeInTheDocument();
  // di default si vede la frase breve; la descrizione completa è dietro "Spiega meglio"
  expect(screen.getByText(/per la SIM basta un documento valido/i)).toBeInTheDocument();
});

test('un effetto con frase breve mostra "Spiega meglio" e apre la descrizione completa', async () => {
  const extraUe: Profilo = { schemaVersion: 1, eta: 30, cittadinanza: 'extra-ue', abitazione: 'affitto' };
  render(<Report profilo={extraUe} legge={decretoSicurezza} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  // collassato: si vede la frase breve, non la descrizione completa
  const card = screen.getByText(/per la SIM basta un documento valido/i).closest('.risultato') as HTMLElement;
  expect(within(card).queryByText(/Per comprare una SIM telefonica/i)).not.toBeInTheDocument();
  await userEvent.click(within(card).getByRole('button', { name: /spiega meglio/i }));
  // espanso: compare la descrizione completa
  expect(within(card).getByText(/Per comprare una SIM telefonica/i)).toBeInTheDocument();
});

test('senza effetti indiretti la sezione non compare', () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.queryByRole('heading', { name: /effetti indiretti/i })).not.toBeInTheDocument();
});

test('orizzonte con effetti incerti: avviso visibile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: ['dipendente-privato'], fasciaReddito: 'fino9k' };
  render(<Report profilo={p} legge={salarioMinimo} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/effetti sono incerti in questo orizzonte/i)).toBeInTheDocument();
});

// --- l'elenco degli effetti reagisce all'orizzonte scelto ---
// Prima il selettore 1/2/5/10 anni cambiava solo il totale in euro: per le dieci leggi
// senza importi cliccarlo non cambiava niente a schermo. Ora un effetto che in
// quell'anno ha timeline 'nullo' viene mostrato spento, con la ragione giusta:
// "è finito" se prima valeva, "non è ancora partito" se comincia più avanti.

const adulto: Profilo = { schemaVersion: 1, eta: 40, condizioneLavorativa: ['dipendente-privato'] };

test('effetto già finito nell\'orizzonte scelto: mostrato come non più valido', async () => {
  render(<Report profilo={adulto} legge={rottamazioneQuinquies} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  const finestra = () => screen.getByText(/cartelle 2000-2023/i).closest('.risultato') as HTMLElement;
  // al primo anno la finestra è ancora un fatto attuale: nessun avviso di effetto spento
  expect(within(finestra()).queryByText(/non vale più/i)).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /2 anni/i }));
  expect(within(finestra()).getByText(/non vale più/i)).toBeInTheDocument();
  expect(within(finestra()).getByText(/tra 2 anni questo effetto è finito/i)).toBeInTheDocument();
});

test('effetto che comincia più avanti: nell\'orizzonte di oggi è mostrato come non ancora partito', async () => {
  render(<Report profilo={adulto} legge={pensioniRequisiti} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  const eta = () => screen.getByText(/andrai in pensione un po/i).closest('.risultato') as HTMLElement;
  expect(within(eta()).getByText(/non ancora/i)).toBeInTheDocument();
  expect(within(eta()).getByText(/tra 1 anno questo effetto non è ancora partito/i)).toBeInTheDocument();
  // dal secondo anno l'aumento c'è davvero: l'avviso sparisce
  await userEvent.click(screen.getByRole('button', { name: /2 anni/i }));
  expect(within(eta()).queryByText(/non è ancora partito/i)).not.toBeInTheDocument();
});

test('un effetto ancora attivo nell\'orizzonte scelto non viene segnato come spento', async () => {
  render(<Report profilo={adulto} legge={rottamazioneQuinquies} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /10 anni/i }));
  const locali = screen.getByText(/una loro rottamazione/i).closest('.risultato') as HTMLElement;
  expect(within(locali).queryByText(/non vale più/i)).not.toBeInTheDocument();
  expect(within(locali).queryByText(/non ancora/i)).not.toBeInTheDocument();
  // mentre il piano a rate, che si chiude nel 2035, a dieci anni è spento
  const rate = screen.getByText(/anche non di fila/i).closest('.risultato') as HTMLElement;
  expect(within(rate).getByText(/tra 10 anni questo effetto è finito/i)).toBeInTheDocument();
});

test('un effetto spento non mostra più il suo importo in euro', async () => {
  const bonusATempo: Legge = {
    id: 'test-bonus-a-tempo', titoloDivulgativo: 'Bonus a tempo', titoloUfficiale: 'Bonus a tempo',
    stato: 'vigore', ambiti: ['fisco-lavoro'],
    fonti: [{ etichetta: 'test', url: 'https://example.org' }],
    verificataIl: '2026-09-01', riassunto: 'Un bonus che dura due anni.',
    regole: [{
      id: 'bonus-a-tempo', campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'economico', importoMese: { min: 100, max: 100 },
        descrizione: 'Un bonus da cento euro al mese, che però dura solo due anni.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'nullo', anno10: 'nullo' },
      confidenza: 'certa',
      fonteRegola: { etichetta: 'test', url: 'https://example.org' }
    }]
  };
  render(<Report profilo={adulto} legge={bonusATempo} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  const card = () => screen.getByText(/un bonus da cento euro/i).closest('.risultato') as HTMLElement;
  expect(within(card()).getByText(/\+100 €/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /5 anni/i }));
  expect(within(card()).queryByText(/\+100 €/)).not.toBeInTheDocument();
});

// --- due schede in cima: "te" e "gli altri" ---
// Il bottone "Vedi com'è per gli altri" stava in fondo, dopo le fonti, e non lo notava
// nessuno. Ora le due viste sono due schede sotto il titolo.

test('in cima ci sono due schede e quella degli altri apre la vista "per gli altri"', async () => {
  const onAltri = vi.fn();
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={onAltri} onIndietro={vi.fn()} />);
  expect(screen.getByRole('button', { name: /come tocca a te/i })).toHaveAttribute('aria-current', 'page');
  await userEvent.click(screen.getByRole('button', { name: /come tocca agli altri/i }));
  expect(onAltri).toHaveBeenCalled();
});

// --- legenda sempre visibile, con parole che si spiegano da sole ---

test('la legenda dei badge si legge subito, senza aprire niente', () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/è già legge/i)).toBeInTheDocument();
  expect(screen.getByText(/manca un passaggio/i)).toBeInTheDocument();
  expect(screen.getByText(/cambia secondo il tuo caso/i)).toBeInTheDocument();
});

test('la voce "Compressione" non compare se nessun effetto tocca un diritto', () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.queryByText(/limita un tuo diritto/i)).not.toBeInTheDocument();
});

test('la voce "Compressione" compare quando un effetto tocca un diritto', () => {
  const extraUe: Profilo = { schemaVersion: 1, eta: 30, cittadinanza: 'extra-ue', abitazione: 'affitto' };
  render(<Report profilo={extraUe} legge={decretoSicurezza} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/limita un tuo diritto/i)).toBeInTheDocument();
});

// --- tutti gli avvisi stanno SOTTO i risultati ---
// L'avviso "effetti non ancora attivi" stava in cima e allontanava i risultati:
// ora gli avvisi si leggono dopo aver visto cosa cambia.

test('l\'avviso "effetti non ancora attivi" viene dopo i risultati, non prima', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: ['dipendente-privato'], fasciaReddito: 'fino9k' };
  const { container } = render(<Report profilo={p} legge={salarioMinimo} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  const primoEffetto = container.querySelector('.risultato') as HTMLElement;
  const avviso = screen.getByText(/effetti non ancora attivi/i).closest('p') as HTMLElement;
  expect(primoEffetto).toBeTruthy();
  expect(primoEffetto.compareDocumentPosition(avviso) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test('l\'avviso resta visibile anche quando la legge non tocca il profilo', () => {
  const pensionato: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: ['pensionato'], fasciaReddito: 'da9a15k' };
  render(<Report profilo={pensionato} legge={salarioMinimo} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/non cambia nulla per te/i)).toBeInTheDocument();
  expect(screen.getByText(/effetti non ancora attivi/i)).toBeInTheDocument();
});

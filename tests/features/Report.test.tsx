import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Report } from '../../src/features/Report';
import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';
import { salarioMinimo } from '../../src/data/laws/salario-minimo';
import { decretoSicurezza } from '../../src/data/laws/decreto-sicurezza';
import type { Profilo } from '../../src/engine/types';

const dipendente: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };

test('mostra il totale del primo anno, il badge di confidenza e la fonte', () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  // l'intervallo compare sia nel totale sia nella riga effetto
  expect(screen.getAllByText(/da \+60 a \+80 €/i).length).toBeGreaterThan(0);
  expect(screen.getByText(/^certo$/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /normattiva/i })).toBeInTheDocument();
  expect(screen.getByText(/a parità di tutte le altre leggi/i)).toBeInTheDocument();
});

test('la timeline cambia orizzonte', async () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /10 anni/i }));
  expect(screen.getByRole('button', { name: /10 anni/i })).toHaveAttribute('aria-pressed', 'true');
});

test('legge non in vigore (delega in attuazione): avviso ben visibile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'fino9k' };
  render(<Report profilo={p} legge={salarioMinimo} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/effetti non ancora attivi/i)).toBeInTheDocument();
});

test('legge che non tocca il profilo: messaggio chiaro e invito a vedere gli altri', () => {
  const pensionato: Profilo = { schemaVersion: 1, eta: 70, condizioneLavorativa: 'pensionato', fasciaReddito: 'da9a15k' };
  render(<Report profilo={pensionato} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/non cambia nulla per te/i)).toBeInTheDocument();
});

test('campo mancante: invito ad aggiungere il dato', () => {
  const senzaReddito: Profilo = { schemaVersion: 1, eta: 30, condizioneLavorativa: 'dipendente-privato' };
  render(<Report profilo={senzaReddito} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/aggiungi questo dato al profilo/i)).toBeInTheDocument();
});

test('gli effetti indiretti hanno una sezione separata con spiegazione', () => {
  const extraUe: Profilo = { schemaVersion: 1, eta: 30, cittadinanza: 'extra-ue', abitazione: 'affitto' };
  render(<Report profilo={extraUe} legge={decretoSicurezza} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByRole('heading', { name: /effetti indiretti/i })).toBeInTheDocument();
  expect(screen.getByText(/ti tocca di riflesso/i)).toBeInTheDocument();
  expect(screen.getByText(/comprare una SIM/i)).toBeInTheDocument();
});

test('senza effetti indiretti la sezione non compare', () => {
  render(<Report profilo={dipendente} legge={cuneoFiscale} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.queryByRole('heading', { name: /effetti indiretti/i })).not.toBeInTheDocument();
});

test('orizzonte con effetti incerti: avviso visibile', () => {
  const p: Profilo = { schemaVersion: 1, eta: 22, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'fino9k' };
  render(<Report profilo={p} legge={salarioMinimo} esploratore={false} onAltri={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/effetti sono incerti in questo orizzonte/i)).toBeInTheDocument();
});

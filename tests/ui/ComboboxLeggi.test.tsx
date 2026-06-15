import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboboxLeggi } from '../../src/ui/ComboboxLeggi';
import type { Legge } from '../../src/engine/types';

function legge(id: string, titolo: string): Legge {
  return {
    id, titoloDivulgativo: titolo, titoloUfficiale: titolo, stato: 'vigore', ambiti: ['casa'],
    fonti: [{ etichetta: 'x', url: 'https://example.org' }],
    verificataIl: '2026-06-10', riassunto: 'prova prova',
    regole: [{
      id: 'r', condizioni: [], campiNecessari: [],
      effetto: { tipo: 'diritto', descrizione: 'd', direzione: 'neutro' },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa', fonteRegola: { etichetta: 'f', url: 'https://example.org' }
    }]
  };
}

const leggi = [
  legge('a', 'Affitti più giusti'),
  legge('b', 'Città a misura di anziani'),
  legge('c', 'Pensioni anticipate')
];

function rendi(onScegli = vi.fn()) {
  render(<ComboboxLeggi leggi={leggi} valoreId="" onScegli={onScegli} etichettaStato={() => 'In vigore'} />);
  return onScegli;
}

test('scrivendo lettere consecutive filtra i titoli', async () => {
  rendi();
  await userEvent.type(screen.getByRole('combobox'), 'pens');
  expect(screen.getByRole('option', { name: /pensioni/i })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: /affitti/i })).not.toBeInTheDocument();
});

test('la ricerca ignora gli accenti', async () => {
  rendi();
  await userEvent.type(screen.getByRole('combobox'), 'citta');
  expect(screen.getByRole('option', { name: /città/i })).toBeInTheDocument();
});

test('se nessun titolo combacia lo dice', async () => {
  rendi();
  await userEvent.type(screen.getByRole('combobox'), 'zzz');
  expect(screen.getByText(/nessuna legge con queste lettere/i)).toBeInTheDocument();
});

test('cliccando un\'opzione la sceglie', async () => {
  const onScegli = rendi();
  await userEvent.click(screen.getByRole('combobox'));
  await userEvent.click(screen.getByRole('option', { name: /affitti/i }));
  expect(onScegli).toHaveBeenCalledWith('a');
});

test('con la tastiera si scorre e si sceglie con Invio', async () => {
  const onScegli = rendi();
  const cb = screen.getByRole('combobox');
  await userEvent.click(cb);
  await userEvent.keyboard('{ArrowDown}{Enter}'); // dalla prima (indice 0) alla seconda
  expect(onScegli).toHaveBeenCalledWith('b');
});

test('End salta all\'ultima opzione', async () => {
  const onScegli = rendi();
  await userEvent.click(screen.getByRole('combobox'));
  await userEvent.keyboard('{End}{Enter}');
  expect(onScegli).toHaveBeenCalledWith('c');
});

test('Home torna alla prima opzione', async () => {
  const onScegli = rendi();
  await userEvent.click(screen.getByRole('combobox'));
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{Home}{Enter}');
  expect(onScegli).toHaveBeenCalledWith('a');
});

test('Tab chiude l\'elenco', async () => {
  rendi();
  await userEvent.click(screen.getByRole('combobox'));
  expect(screen.getByRole('listbox')).toBeInTheDocument();
  await userEvent.tab();
  expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
});

test('mostra il titolo ufficiale reale, non quello divulgativo', async () => {
  const l: Legge = { ...legge('x', 'Nome semplice'), titoloUfficiale: 'Legge 1 gennaio 2026, n. 1 — Nome ufficiale lungo' };
  render(<ComboboxLeggi leggi={[l]} valoreId="" onScegli={vi.fn()} etichettaStato={() => 'In vigore'} />);
  await userEvent.click(screen.getByRole('combobox'));
  expect(screen.getByRole('option', { name: /Legge 1 gennaio 2026, n\. 1/i })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: /Nome semplice/i })).not.toBeInTheDocument();
});

test('si può cercare anche col nome semplice (divulgativo), pur mostrando il titolo ufficiale', async () => {
  const l: Legge = { ...legge('x', 'Premierato'), titoloUfficiale: 'Disegno di legge costituzionale S. 935' };
  render(<ComboboxLeggi leggi={[l]} valoreId="" onScegli={vi.fn()} etichettaStato={() => 'In vigore'} />);
  await userEvent.type(screen.getByRole('combobox'), 'premier');
  expect(screen.getByRole('option', { name: /Disegno di legge costituzionale/i })).toBeInTheDocument();
});

test('scorrendo con le frecce l\'opzione attiva entra nella vista', async () => {
  const spy = vi.fn();
  Element.prototype.scrollIntoView = spy; // jsdom non lo implementa
  try {
    rendi();
    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.keyboard('{ArrowDown}');
    expect(spy).toHaveBeenCalled();
  } finally {
    delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView;
  }
});

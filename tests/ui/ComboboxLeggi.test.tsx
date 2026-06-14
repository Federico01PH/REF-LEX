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

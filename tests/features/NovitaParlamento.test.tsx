import { render, screen } from '@testing-library/react';
import { NovitaParlamento } from '../../src/features/NovitaParlamento';
import type { NovitaFile } from '../../src/engine/novita';

const novita: NovitaFile = {
  generatoIl: '2026-06-11',
  voci: [
    { id: 'gazzetta-1', titolo: 'Nuova legge sulla scuola', tipo: 'gazzetta', stato: 'approvata', data: '2026-06-10', url: 'https://www.gazzettaufficiale.it/x' },
    { id: 'camera-2', titolo: 'Proposta sul lavoro agile', tipo: 'camera', stato: 'discussione', data: '2026-06-09', url: 'https://www.camera.it/y' }
  ]
};

test('mostra titolo sezione, data aggiornamento e voci con stato', () => {
  render(<NovitaParlamento novita={novita} />);
  expect(screen.getByRole('heading', { name: /novità dal parlamento/i })).toBeInTheDocument();
  expect(screen.getByText(/aggiornato al 11 giugno 2026/i)).toBeInTheDocument();
  expect(screen.getByText(/nuova legge sulla scuola/i)).toBeInTheDocument();
  expect(screen.getByText(/appena approvata/i)).toBeInTheDocument();
  expect(screen.getByText(/in discussione/i)).toBeInTheDocument();
});

test('ogni voce ha badge "simulazione in preparazione" e link al testo ufficiale sicuro', () => {
  render(<NovitaParlamento novita={novita} />);
  expect(screen.getAllByText(/simulazione in preparazione/i)).toHaveLength(2);
  const link = screen.getAllByRole('link', { name: /leggi il testo ufficiale/i });
  expect(link).toHaveLength(2);
  expect(link[0]).toHaveAttribute('rel', 'noopener noreferrer');
  expect(link[0]).toHaveAttribute('target', '_blank');
});

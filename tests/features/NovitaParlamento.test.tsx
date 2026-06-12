import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

test('ogni voce dice chiaramente che non è ancora simulabile e ha il link al testo ufficiale sicuro', () => {
  render(<NovitaParlamento novita={novita} />);
  expect(screen.getAllByText(/non ancora simulabile/i)).toHaveLength(2);
  const link = screen.getAllByRole('link', { name: /leggi il testo ufficiale/i });
  expect(link).toHaveLength(2);
  expect(link[0]).toHaveAttribute('rel', 'noopener noreferrer');
  expect(link[0]).toHaveAttribute('target', '_blank');
});

test('con tante voci ne mostra solo 3 e un bottone per vederle tutte', async () => {
  const tante: NovitaFile = {
    generatoIl: '2026-06-11',
    voci: Array.from({ length: 5 }, (_, i) => ({
      id: `voce-${i}`, titolo: `Atto numero ${i}`, tipo: 'gazzetta' as const,
      stato: 'approvata' as const, data: '2026-06-10', url: `https://www.gazzettaufficiale.it/${i}`
    }))
  };
  render(<NovitaParlamento novita={tante} />);
  expect(screen.getAllByRole('article')).toHaveLength(3);
  await userEvent.click(screen.getByRole('button', { name: /mostra tutte le novità \(5\)/i }));
  expect(screen.getAllByRole('article')).toHaveLength(5);
  await userEvent.click(screen.getByRole('button', { name: /mostra meno/i }));
  expect(screen.getAllByRole('article')).toHaveLength(3);
});

test('il bottone di richiesta passa titolo e url della voce', async () => {
  const onRichiedi = vi.fn();
  render(<NovitaParlamento novita={novita} onRichiedi={onRichiedi} />);
  const bottoni = screen.getAllByRole('button', { name: /chiedila in simulazione/i });
  expect(bottoni).toHaveLength(2);
  await userEvent.click(bottoni[0]);
  expect(onRichiedi).toHaveBeenCalledWith('Nuova legge sulla scuola', 'https://www.gazzettaufficiale.it/x');
});

test('senza onRichiedi il bottone di richiesta non compare', () => {
  render(<NovitaParlamento novita={novita} />);
  expect(screen.queryByRole('button', { name: /chiedila in simulazione/i })).not.toBeInTheDocument();
});

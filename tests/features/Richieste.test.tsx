import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Richieste } from '../../src/features/Richieste';
import type { RichiestaSimulazione } from '../../src/storage/richieste';

const due: RichiestaSimulazione[] = [
  { id: 'r1', titolo: 'Nuova legge sulla scuola', url: 'https://www.gazzettaufficiale.it/x', creataIl: '2026-06-11' },
  { id: 'r2', titolo: 'Proposta sul lavoro agile', creataIl: '2026-06-11' }
];

test('si può scrivere una richiesta a mano e il bottone si attiva solo con del testo', async () => {
  const onAggiungi = vi.fn();
  render(<Richieste richieste={[]} onAggiungi={onAggiungi} onRimuovi={vi.fn()} />);
  const bottone = screen.getByRole('button', { name: /aggiungi alla lista/i });
  expect(bottone).toBeDisabled();
  await userEvent.type(screen.getByLabelText(/quale legge vuoi simulare/i), 'Legge sul caro affitti');
  expect(bottone).toBeEnabled();
  await userEvent.click(bottone);
  expect(onAggiungi).toHaveBeenCalledWith('Legge sul caro affitti');
});

test('mostra le richieste salvate e il link di invio le contiene tutte', () => {
  render(<Richieste richieste={due} onAggiungi={vi.fn()} onRimuovi={vi.fn()} />);
  expect(screen.getByText('Nuova legge sulla scuola')).toBeInTheDocument();
  const invio = screen.getByRole('link', { name: /invia le 2 richieste/i });
  const href = invio.getAttribute('href') ?? '';
  expect(href.startsWith('mailto:')).toBe(true);
  expect(href).toContain(encodeURIComponent('Nuova legge sulla scuola'));
  expect(href).toContain(encodeURIComponent('Proposta sul lavoro agile'));
  expect(href).toContain(encodeURIComponent('https://www.gazzettaufficiale.it/x'));
});

test('ogni richiesta si può togliere', async () => {
  const onRimuovi = vi.fn();
  render(<Richieste richieste={due} onAggiungi={vi.fn()} onRimuovi={onRimuovi} />);
  await userEvent.click(screen.getByRole('button', { name: /togli la richiesta: nuova legge sulla scuola/i }));
  expect(onRimuovi).toHaveBeenCalledWith('r1');
});

test('senza richieste niente lista e niente bottone di invio', () => {
  render(<Richieste richieste={[]} onAggiungi={vi.fn()} onRimuovi={vi.fn()} />);
  expect(screen.queryByRole('link', { name: /invia/i })).not.toBeInTheDocument();
});

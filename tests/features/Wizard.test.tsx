import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Wizard } from '../../src/features/Wizard';

test('percorso minimo: età obbligatoria, poi salto delle facoltative fino alla fine', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);

  expect(screen.getByRole('heading', { name: /quanti anni hai/i })).toBeInTheDocument();
  // senza età non si avanza: la domanda obbligatoria non ha "Salta"
  expect(screen.queryByRole('button', { name: /salta/i })).not.toBeInTheDocument();
  await userEvent.type(screen.getByRole('spinbutton'), '34');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));

  // tutte le successive sono facoltative: si possono saltare (13 domande)
  for (let i = 0; i < 13; i++) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({ schemaVersion: 1, eta: 34 }));
});

test('risposta a scelta: la pillola selezionata finisce nel profilo', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);
  await userEvent.type(screen.getByRole('spinbutton'), '70');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  await userEvent.click(screen.getByRole('button', { name: /in pensione/i }));
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  for (let i = 0; i < 12; i++) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({ eta: 70, condizioneLavorativa: 'pensionato' }));
});

test('mostra il "perché lo chiediamo" e la barra di progresso', () => {
  render(<Wizard iniziale={null} esploratore={false} onFine={vi.fn()} onAnnulla={vi.fn()} />);
  expect(screen.getByText(/perché lo chiediamo/i)).toBeInTheDocument();
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('avanzando, il focus va sul titolo della nuova domanda', async () => {
  render(<Wizard iniziale={null} esploratore={false} onFine={vi.fn()} onAnnulla={vi.fn()} />);
  await userEvent.type(screen.getByRole('spinbutton'), '34');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  expect(screen.getByRole('heading', { name: /di cosa ti occupi/i })).toHaveFocus();
});

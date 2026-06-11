import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Privacy } from '../../src/features/Privacy';

test('spiega dove sono i dati e cosa non facciamo', () => {
  render(<Privacy tema="auto" onCambiaTema={vi.fn()} onCancellaTutto={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/restano solo su questo dispositivo/i)).toBeInTheDocument();
  expect(screen.getByText(/non li vendiamo/i)).toBeInTheDocument();
});

test('alla richiesta di conferma il focus va sull\'opzione sicura', async () => {
  render(<Privacy tema="auto" onCambiaTema={vi.fn()} onCancellaTutto={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /cancella tutti i miei dati/i }));
  expect(screen.getByRole('button', { name: /no, tienili/i })).toHaveFocus();
});

test('cancella tutto chiede conferma e poi svuota lo storage', async () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 34 }));
  const onCancella = vi.fn();
  render(<Privacy tema="auto" onCambiaTema={vi.fn()} onCancellaTutto={onCancella} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /cancella tutti i miei dati/i }));
  await userEvent.click(screen.getByRole('button', { name: /sì, cancella/i }));
  expect(localStorage.getItem('reflex.profilo.v1')).toBeNull();
  expect(onCancella).toHaveBeenCalled();
});

test('selettore tema chiama onCambiaTema', async () => {
  const onTema = vi.fn();
  render(<Privacy tema="auto" onCambiaTema={onTema} onCancellaTutto={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /scuro/i }));
  expect(onTema).toHaveBeenCalledWith('dark');
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from '../../src/features/Home';

test('mostra marchio, missione, garanzia privacy e bottone Inizia senza profilo', async () => {
  const onAvanti = vi.fn();
  render(<Home haProfilo={false} onAvanti={onAvanti} onPrivacy={vi.fn()} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ref-lex/i);
  expect(screen.getByText(/le traduce in parole semplici/i)).toBeInTheDocument();
  expect(screen.getByText(/nessun tuo dato personale viene inviato/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /inizia/i }));
  expect(onAvanti).toHaveBeenCalled();
});

test('con un profilo salvato il bottone porta alle simulazioni', async () => {
  const onAvanti = vi.fn();
  render(<Home haProfilo={true} onAvanti={onAvanti} onPrivacy={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /vai alle simulazioni/i }));
  expect(onAvanti).toHaveBeenCalled();
});

test('il collegamento alla privacy funziona', async () => {
  const onPrivacy = vi.fn();
  render(<Home haProfilo={false} onAvanti={vi.fn()} onPrivacy={onPrivacy} />);
  await userEvent.click(screen.getByRole('button', { name: /come funziona la privacy/i }));
  expect(onPrivacy).toHaveBeenCalled();
});

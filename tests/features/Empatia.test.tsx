import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Empatia } from '../../src/features/Empatia';
import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';

test('mostra gli 8 personaggi con il loro esito', () => {
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  expect(screen.getByText(/anna, 74 anni/i)).toBeInTheDocument();
  expect(screen.getByText(/luca, 22 anni/i)).toBeInTheDocument();
  // Anna è pensionata: per lei il cuneo non cambia nulla
  const cardAnna = screen.getByText(/anna, 74 anni/i).closest('article')!;
  expect(cardAnna).toHaveTextContent(/nessun effetto/i);
  // Luca è dipendente a basso reddito: per lui c'è un effetto positivo
  const cardLuca = screen.getByText(/luca, 22 anni/i).closest('article')!;
  expect(cardLuca).toHaveTextContent(/€/);
});

test('il bottone crea profilo ipotetico chiama onCreaIpotetico', async () => {
  const onCrea = vi.fn();
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={onCrea} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /crea un profilo ipotetico/i }));
  expect(onCrea).toHaveBeenCalled();
});

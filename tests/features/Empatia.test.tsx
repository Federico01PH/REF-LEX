import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Empatia } from '../../src/features/Empatia';
import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';
import { salarioMinimo } from '../../src/data/laws/salario-minimo';

test('mostra solo i profili a cui la legge cambia qualcosa', () => {
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  // Luca è dipendente a basso reddito: il cuneo lo tocca, c'è
  expect(screen.getByText(/luca, 22 anni/i)).toBeInTheDocument();
  // Anna è pensionata: il cuneo non la tocca, non compare
  expect(screen.queryByText(/anna, 74 anni/i)).not.toBeInTheDocument();
});

test('di base i profili mostrano solo nome e caratteristiche; il report appare al clic', async () => {
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  // chiuso: nessun importo visibile
  expect(screen.queryByText(/stima al 1° anno/i)).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /luca, 22 anni/i }));
  expect(screen.getByText(/stima al 1° anno/i)).toBeInTheDocument();
  expect(screen.getByText(/€/)).toBeInTheDocument();
});

test('aprendo un profilo gli effetti non economici hanno il badge di confidenza', async () => {
  render(<Empatia legge={salarioMinimo} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /luca, 22 anni/i }));
  const cardLuca = screen.getByText(/luca, 22 anni/i).closest('li')!;
  expect(cardLuca).toHaveTextContent(/dipende/i);
});

test('il bottone crea profilo ipotetico chiama onCreaIpotetico', async () => {
  const onCrea = vi.fn();
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={onCrea} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /crea un profilo ipotetico/i }));
  expect(onCrea).toHaveBeenCalled();
});

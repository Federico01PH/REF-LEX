import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Catalogo } from '../../src/features/Catalogo';
import { CATALOGO } from '../../src/data/laws';
import type { Profilo } from '../../src/engine/types';

const dipendente: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };

test('mostra le leggi con stato e badge di rilevanza', () => {
  render(<Catalogo profilo={dipendente} esploratore={false} leggi={CATALOGO} novita={null}
    infoCatalogo={{ fonte: 'locale' }} onScegli={vi.fn()}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} />);
  expect(screen.getByText(/taglio del cuneo fiscale/i)).toBeInTheDocument();
  expect(screen.getByText(/in vigore/i)).toBeInTheDocument();
  expect(screen.getByText(/salario minimo/i)).toBeInTheDocument();
  expect(screen.getByText(/appena approvata/i)).toBeInTheDocument();
  expect(screen.getAllByText(/ti riguarda quasi sicuramente/i).length).toBeGreaterThan(0);
});

test('scegliere una legge chiama onScegli con il suo id', async () => {
  const onScegli = vi.fn();
  render(<Catalogo profilo={dipendente} esploratore={false} leggi={CATALOGO} novita={null}
    infoCatalogo={{ fonte: 'locale' }} onScegli={onScegli}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /taglio del cuneo fiscale/i }));
  expect(onScegli).toHaveBeenCalledWith('cuneo-fiscale-2025');
});

test('il filtro per ambito nasconde le leggi degli altri ambiti', async () => {
  render(<Catalogo profilo={dipendente} esploratore={false} leggi={CATALOGO} novita={null}
    infoCatalogo={{ fonte: 'locale' }} onScegli={vi.fn()}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /^casa$/i }));
  expect(screen.queryByText(/taglio del cuneo/i)).not.toBeInTheDocument();
});

test('mostra la nota sulla fonte del catalogo', () => {
  render(<Catalogo profilo={dipendente} esploratore={false} leggi={CATALOGO} novita={null}
    infoCatalogo={{ fonte: 'locale' }} onScegli={vi.fn()}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} />);
  expect(screen.getByText(/catalogo locale/i)).toBeInTheDocument();
});

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Catalogo } from '../../src/features/Catalogo';
import { CATALOGO } from '../../src/data/laws';
import type { Profilo } from '../../src/engine/types';

const dipendente: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };

function renderCatalogo(extra: Partial<Parameters<typeof Catalogo>[0]> = {}) {
  return render(<Catalogo profilo={dipendente} esploratore={false} leggi={CATALOGO} novita={null}
    infoCatalogo={{ fonte: 'locale' }} onScegli={vi.fn()}
    onModificaProfilo={vi.fn()} onPrivacy={vi.fn()} onEsciEsploratore={vi.fn()} {...extra} />);
}

test('le leggi stanno in un menu a tendina, con titolo semplice e stato', () => {
  renderCatalogo();
  const tendina = screen.getByRole('combobox', { name: /scegli la legge/i });
  expect(within(tendina).getByRole('option', { name: /taglio del cuneo fiscale.*in vigore/i })).toBeInTheDocument();
  expect(within(tendina).getByRole('option', { name: /salario minimo.*appena approvata/i })).toBeInTheDocument();
});

test('scegliendo dalla tendina compare la scheda con nome ufficiale, spiegazione e rilevanza', async () => {
  renderCatalogo();
  await userEvent.selectOptions(screen.getByRole('combobox', { name: /scegli la legge/i }), 'cuneo-fiscale-2025');
  expect(screen.getByText(/nome ufficiale/i)).toBeInTheDocument();
  expect(screen.getByText(/ti riguarda quasi sicuramente/i)).toBeInTheDocument();
});

test('il bottone della scheda apre il report con l\'id giusto', async () => {
  const onScegli = vi.fn();
  renderCatalogo({ onScegli });
  await userEvent.selectOptions(screen.getByRole('combobox', { name: /scegli la legge/i }), 'cuneo-fiscale-2025');
  await userEvent.click(screen.getByRole('button', { name: /vedi come ti tocca/i }));
  expect(onScegli).toHaveBeenCalledWith('cuneo-fiscale-2025');
});

test('il filtro per ambito toglie dalla tendina le leggi degli altri ambiti', async () => {
  renderCatalogo();
  await userEvent.click(screen.getByRole('button', { name: /^casa$/i }));
  expect(screen.queryByRole('option', { name: /taglio del cuneo/i })).not.toBeInTheDocument();
});

test('cambiare ambito chiude la scheda della legge non più visibile', async () => {
  renderCatalogo();
  await userEvent.selectOptions(screen.getByRole('combobox', { name: /scegli la legge/i }), 'cuneo-fiscale-2025');
  await userEvent.click(screen.getByRole('button', { name: /^casa$/i }));
  expect(screen.queryByText(/nome ufficiale/i)).not.toBeInTheDocument();
});

test('mostra la nota sulla fonte del catalogo', () => {
  renderCatalogo();
  expect(screen.getByText(/catalogo locale/i)).toBeInTheDocument();
});

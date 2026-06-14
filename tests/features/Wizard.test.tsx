import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Wizard } from '../../src/features/Wizard';

test('percorso minimo: si salta il nome, l\'età è obbligatoria, poi si saltano le facoltative', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);

  // la prima domanda è il nome (facoltativo): si può saltare
  expect(screen.getByRole('heading', { name: /come ti chiami/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /salta/i }));

  // poi l'età: obbligatoria, niente "Salta"
  expect(screen.getByRole('heading', { name: /quanti anni hai/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /salta/i })).not.toBeInTheDocument();
  await userEvent.type(screen.getByRole('spinbutton'), '34');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));

  // 15 domande facoltative dopo l'età (il permesso di soggiorno non compare senza cittadinanza extra-UE)
  for (let i = 0; i < 15; i++) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({ schemaVersion: 1, eta: 34 }));
});

test('il nome (o nickname) scelto finisce nel profilo', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);
  await userEvent.type(screen.getByRole('textbox'), 'Giulia');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  await userEvent.type(screen.getByRole('spinbutton'), '40');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  for (let i = 0; i < 15; i++) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({ nome: 'Giulia', eta: 40 }));
});

test('risposta a scelta: la pillola selezionata finisce nel profilo', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /salta/i })); // salto il nome
  await userEvent.type(screen.getByRole('spinbutton'), '70');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  await userEvent.click(screen.getByRole('button', { name: /in pensione/i }));
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  for (let i = 0; i < 14; i++) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({ eta: 70, condizioneLavorativa: 'pensionato' }));
});

test('la domanda sul permesso di soggiorno compare solo con cittadinanza fuori dall\'UE', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /salta/i })); // salto il nome
  await userEvent.type(screen.getByRole('spinbutton'), '30');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  // salto fino alla domanda sulla cittadinanza
  while (!screen.queryByRole('heading', { name: /qual è la tua cittadinanza/i })) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  await userEvent.click(screen.getByRole('button', { name: /fuori dall'ue/i }));
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  expect(screen.getByRole('heading', { name: /permesso di soggiorno/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'No' }));
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  // restano genere, transgender, orientamento, religione
  for (let i = 0; i < 4; i++) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({ cittadinanza: 'extra-ue', permessoSoggiorno: 'no' }));
});

test('si può tornare indietro alla domanda precedente senza perdere le risposte', async () => {
  render(<Wizard iniziale={null} esploratore={false} onFine={vi.fn()} onAnnulla={vi.fn()} />);
  await userEvent.type(screen.getByRole('textbox'), 'Marco');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  expect(screen.getByRole('heading', { name: /quanti anni hai/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /indietro/i }));
  expect(screen.getByRole('heading', { name: /come ti chiami/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox')).toHaveValue('Marco');
});

test('alla prima domanda c\'è Annulla e non Indietro', () => {
  render(<Wizard iniziale={null} esploratore={false} onFine={vi.fn()} onAnnulla={vi.fn()} />);
  expect(screen.getByRole('button', { name: /annulla/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /indietro/i })).not.toBeInTheDocument();
});

test('mostra il "perché lo chiediamo" e la barra di progresso', () => {
  render(<Wizard iniziale={null} esploratore={false} onFine={vi.fn()} onAnnulla={vi.fn()} />);
  expect(screen.getByText(/perché lo chiediamo/i)).toBeInTheDocument();
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('avanzando, il focus va sul titolo della nuova domanda', async () => {
  render(<Wizard iniziale={null} esploratore={false} onFine={vi.fn()} onAnnulla={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /salta/i })); // salto il nome
  await userEvent.type(screen.getByRole('spinbutton'), '34');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  expect(screen.getByRole('heading', { name: /di cosa ti occupi/i })).toHaveFocus();
});

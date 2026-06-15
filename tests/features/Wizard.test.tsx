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

  // 16 domande facoltative dopo l'età (permesso di soggiorno e "chi dipende da te"
  // non compaiono finché non si risponde, rispettivamente, extra-UE e "ho persone a carico")
  for (let i = 0; i < 16; i++) {
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
  for (let i = 0; i < 16; i++) {
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
  for (let i = 0; i < 15; i++) {
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

test('la domanda "chi dipende da te" compare solo dopo aver detto di avere persone a carico', async () => {
  const onFine = vi.fn();
  render(<Wizard iniziale={null} esploratore={false} onFine={onFine} onAnnulla={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /salta/i })); // salto il nome
  await userEvent.type(screen.getByRole('spinbutton'), '38');
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  // salto fino al cancello "persone a carico"
  while (!screen.queryByRole('heading', { name: /persone a tuo carico/i })) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  // finché non rispondo, la domanda di dettaglio non c'è
  expect(screen.queryByRole('heading', { name: /chi dipende da te/i })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Sì' }));
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  // ora compare e posso scegliere le categorie
  expect(screen.getByRole('heading', { name: /chi dipende da te/i })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /figli minorenni/i }));
  await userEvent.click(screen.getByRole('button', { name: /genitori o anziani/i }));
  await userEvent.click(screen.getByRole('button', { name: /avanti/i }));
  // salto tutte le domande rimanenti fino alla fine
  while (onFine.mock.calls.length === 0) {
    await userEvent.click(screen.getByRole('button', { name: /salta/i }));
  }
  expect(onFine).toHaveBeenCalledWith(expect.objectContaining({
    personeACarico: true,
    tipiACarico: expect.arrayContaining(['figli-minorenni', 'genitori-anziani'])
  }));
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

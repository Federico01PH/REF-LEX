import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Empatia } from '../../src/features/Empatia';
import { cuneoFiscale } from '../../src/data/laws/cuneo-fiscale';
import { salarioMinimo } from '../../src/data/laws/salario-minimo';
import { pensioniRequisiti } from '../../src/data/laws/pensioni-requisiti';
import { remigrazione } from '../../src/data/laws/remigrazione';
import { aiAct } from '../../src/data/laws/ai-act';
import { pianoCasa } from '../../src/data/laws/piano-casa';
import type { Profilo } from '../../src/engine/types';

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

test('con un profilo, mostra solo chi cambia in modo DIVERSO dall\'utente, non chi cambia uguale', () => {
  // L'utente è un dipendente di 29 anni: sulla legge pensioni prende solo l'adeguamento.
  const io: Profilo = { schemaVersion: 1, eta: 29, condizioneLavorativa: ['dipendente-privato'] };
  render(<Empatia profilo={io} legge={pensioniRequisiti} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  // Elena (61, imprenditrice) prende anche la vecchiaia entro 10 anni: cambia DIVERSO → c'è
  expect(screen.getByText(/elena, 61 anni/i)).toBeInTheDocument();
  // Marco (52, dipendente) prende solo l'adeguamento, identico all'utente → non compare
  expect(screen.queryByText(/marco, 52 anni/i)).not.toBeInTheDocument();
  // Anna (74, pensionata) non è toccata da questa legge → non compare
  expect(screen.queryByText(/anna, 74 anni/i)).not.toBeInTheDocument();
});

test('gli effetti mostrano la frase corta con "Spiega meglio" che apre quella completa', async () => {
  render(<Empatia legge={remigrazione} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /karim/i }));
  const espandi = screen.getAllByRole('button', { name: /spiega meglio/i });
  expect(espandi.length).toBeGreaterThan(0);
  await userEvent.click(espandi[0]);
  expect(screen.getByRole('button', { name: /mostra meno/i })).toBeInTheDocument();
});

test('i profili con lo stesso identico report diventano una scheda sola', () => {
  render(<Empatia legge={aiAct} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  // Anna, Karim, Elena, Pavel, Omar, Martina, Bruno e Gianni hanno lo stesso identico report:
  // una scheda sola, intestata alla prima del gruppo.
  expect(screen.getByRole('button', { name: /anna, 74 anni/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /karim/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /gianni/i })).not.toBeInTheDocument();
});

test('la scheda di gruppo dice a quali altre categorie di persone la legge fa lo stesso', () => {
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  // Giulia intesta il gruppo; Daniela e Miriam sono nominate per categoria, non per nome
  const cardGiulia = screen.getByText(/giulia, 38 anni/i).closest('li')!;
  expect(cardGiulia).toHaveTextContent(
    /Stesso effetto anche per un'insegnante e un'impiegata di religione ebraica\./i
  );
});

test('chi non ha nessun altro con lo stesso report non ha la riga di gruppo', () => {
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  // Luca è l'unico con il suo report: niente riga "Stesso effetto anche per"
  const cardLuca = screen.getByText(/luca, 22 anni/i).closest('li')!;
  expect(cardLuca).not.toHaveTextContent(/stesso effetto anche per/i);
});

test('fino a quattro categorie la riga le elenca tutte', () => {
  render(<Empatia legge={pianoCasa} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  // Sara intesta un gruppo di 5: le altre 4 categorie ci stanno tutte, senza "e altre N persone"
  const cardSara = screen.getByText(/sara, 29 anni/i).closest('li')!;
  expect(cardSara).toHaveTextContent(
    /Stesso effetto anche per un caregiver, una persona transgender, una libera professionista e un'impiegata di religione ebraica\./i
  );
  expect(cardSara).not.toHaveTextContent(/altre \d+ persone/i);
});

test('nei gruppi grandi la riga si ferma a tre categorie e "Chi sono?" apre le altre', async () => {
  render(<Empatia legge={aiAct} onCreaIpotetico={vi.fn()} onIndietro={vi.fn()} />);
  const cardAnna = screen.getByText(/anna, 74 anni/i).closest('li')!;
  // 7 altri: tre nominati, gli altri quattro contati
  expect(cardAnna).toHaveTextContent(/e altre 4 persone\./i);
  // la categoria dice il mestiere e la condizione, non il nome proprio
  expect(cardAnna).toHaveTextContent(/un artigiano con permesso di soggiorno/i);
  expect(cardAnna).not.toHaveTextContent(/karim/i);
  expect(cardAnna).not.toHaveTextContent(/un cacciatore in pensione/i);
  await userEvent.click(screen.getAllByRole('button', { name: /chi sono/i })[0]);
  // aperta, la riga elenca tutte e sette le categorie
  expect(cardAnna).toHaveTextContent(/un cacciatore in pensione/i);
  expect(cardAnna).not.toHaveTextContent(/e altre 4 persone/i);
});

test('il bottone crea profilo ipotetico chiama onCreaIpotetico', async () => {
  const onCrea = vi.fn();
  render(<Empatia legge={cuneoFiscale} onCreaIpotetico={onCrea} onIndietro={vi.fn()} />);
  await userEvent.click(screen.getByRole('button', { name: /crea un profilo ipotetico/i }));
  expect(onCrea).toHaveBeenCalled();
});

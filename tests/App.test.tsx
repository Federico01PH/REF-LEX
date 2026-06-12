import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('niente rete nei test'); }) as unknown as typeof fetch);
});
afterEach(() => vi.unstubAllGlobals());

test('si apre sempre dalla home: marchio e bottone di ingresso', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ref-lex/i);
  expect(screen.getByRole('button', { name: /inizia/i })).toBeInTheDocument();
});

test('senza profilo il bottone della home apre il wizard', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /inizia/i }));
  expect(screen.getByRole('heading', { name: /quanti anni hai/i })).toBeInTheDocument();
});

test('con profilo salvato il bottone della home porta alle simulazioni', async () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 34, condizioneLavorativa: 'studente' }));
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /vai alle simulazioni/i }));
  expect(screen.getByRole('combobox', { name: /scegli la legge/i })).toBeInTheDocument();
});

test('dalle simulazioni si torna alla home', async () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 34, condizioneLavorativa: 'studente' }));
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: /vai alle simulazioni/i }));
  await userEvent.click(screen.getByRole('button', { name: /^home$/i }));
  expect(screen.getByRole('button', { name: /vai alle simulazioni/i })).toBeInTheDocument();
});

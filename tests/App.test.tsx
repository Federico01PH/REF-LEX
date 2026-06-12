import { render, screen } from '@testing-library/react';
import App from '../src/App';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('niente rete nei test'); }) as unknown as typeof fetch);
});
afterEach(() => vi.unstubAllGlobals());

test('senza profilo salvato parte dal benvenuto', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ref-lex/i);
  expect(screen.getByRole('button', { name: /inizia/i })).toBeInTheDocument();
});

test('con profilo salvato parte dal catalogo', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 34, condizioneLavorativa: 'studente' }));
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ref-lex/i);
  expect(screen.getByRole('combobox', { name: /scegli la legge/i })).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import App from '../src/App';

beforeEach(() => localStorage.clear());

test('senza profilo salvato parte dal benvenuto', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/le leggi cambiano la tua vita/i);
});

test('con profilo salvato parte dal catalogo', () => {
  localStorage.setItem('reflex.profilo.v1', JSON.stringify({ schemaVersion: 1, eta: 34, condizioneLavorativa: 'studente' }));
  render(<App />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/scegli una legge/i);
});

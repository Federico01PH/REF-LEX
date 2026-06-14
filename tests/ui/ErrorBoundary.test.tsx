import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../../src/ui/ErrorBoundary';

function Esplode(): never {
  throw new Error('boom');
}

test('mostra i figli quando non ci sono errori', () => {
  render(<ErrorBoundary><p>contenuto ok</p></ErrorBoundary>);
  expect(screen.getByText('contenuto ok')).toBeInTheDocument();
});

test('mostra un messaggio invece dello schermo bianco quando un figlio va in errore', () => {
  // React stampa l'errore in console anche se intercettato: lo silenziamo nel test
  const spia = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<ErrorBoundary><Esplode /></ErrorBoundary>);
  expect(screen.getByText(/qualcosa è andato storto/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /ricarica/i })).toBeInTheDocument();
  spia.mockRestore();
});

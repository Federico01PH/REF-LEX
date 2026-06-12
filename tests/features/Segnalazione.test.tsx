import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Segnalazione } from '../../src/features/Segnalazione';

test('senza testo il bottone di invio è spento', () => {
  render(<Segnalazione />);
  expect(screen.getByRole('button', { name: /invia la segnalazione/i })).toBeDisabled();
  expect(screen.queryByRole('link', { name: /invia la segnalazione/i })).not.toBeInTheDocument();
});

test('scrivendo il problema compare il link di invio con il testo dentro', async () => {
  render(<Segnalazione />);
  await userEvent.type(screen.getByLabelText(/descrivi il problema/i), 'Il totale del cuneo fiscale non torna');
  const invio = screen.getByRole('link', { name: /invia la segnalazione/i });
  const href = invio.getAttribute('href') ?? '';
  expect(href.startsWith('mailto:')).toBe(true);
  expect(href).toContain(encodeURIComponent('Il totale del cuneo fiscale non torna'));
  expect(href).toContain(encodeURIComponent('REF-LEX: segnalazione'));
});

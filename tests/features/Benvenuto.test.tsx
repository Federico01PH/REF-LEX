import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Benvenuto } from '../../src/features/Benvenuto';

test('mostra titolo, missione, garanzia privacy e bottone Inizia', async () => {
  const onInizia = vi.fn();
  render(<Benvenuto onInizia={onInizia} onPrivacy={vi.fn()} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ref-lex/i);
  expect(screen.getByText(/cosa cambiano nella tua vita/i)).toBeInTheDocument();
  expect(screen.getByText(/zero dati inviati/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /inizia/i }));
  expect(onInizia).toHaveBeenCalled();
});

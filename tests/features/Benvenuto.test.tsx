import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Benvenuto } from '../../src/features/Benvenuto';

test('mostra promessa, garanzia privacy e bottone Inizia', async () => {
  const onInizia = vi.fn();
  render(<Benvenuto onInizia={onInizia} onPrivacy={vi.fn()} />);
  expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/le leggi cambiano la tua vita/i);
  expect(screen.getByText(/zero dati inviati/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /inizia/i }));
  expect(onInizia).toHaveBeenCalled();
});

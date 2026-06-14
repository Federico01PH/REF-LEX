import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvvisoLeggeMancante } from '../../src/ui/AvvisoLeggeMancante';

test('avvisa che la legge non è disponibile e offre il ritorno al catalogo', async () => {
  const onIndietro = vi.fn();
  render(<AvvisoLeggeMancante onIndietro={onIndietro} />);
  expect(screen.getByText(/legge non.*disponibile/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /torna al catalogo/i }));
  expect(onIndietro).toHaveBeenCalledOnce();
});

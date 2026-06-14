import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BannerAggiornamento } from '../../src/ui/BannerAggiornamento';

test('non mostra nulla quando non c\'è un aggiornamento pronto', () => {
  const { container } = render(<BannerAggiornamento pronto={false} onAggiorna={() => {}} />);
  expect(container).toBeEmptyDOMElement();
});

test('quando un aggiornamento è pronto avvisa e il bottone aggiorna', async () => {
  const onAggiorna = vi.fn();
  render(<BannerAggiornamento pronto={true} onAggiorna={onAggiorna} />);
  expect(screen.getByText(/nuova versione/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /aggiorna/i }));
  expect(onAggiorna).toHaveBeenCalledOnce();
});

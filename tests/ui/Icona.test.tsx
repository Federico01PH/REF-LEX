import { render, screen } from '@testing-library/react';
import { Icona } from '../../src/ui/Icona';

test('Icona renderizza un SVG decorativo nascosto agli screen reader', () => {
  render(<Icona nome="lucchetto" />);
  const svg = screen.getByTestId('icona-lucchetto');
  expect(svg).toHaveAttribute('aria-hidden', 'true');
});

test('Icona con etichetta è annunciata', () => {
  render(<Icona nome="info" etichetta="maggiori informazioni" />);
  expect(screen.getByRole('img', { name: 'maggiori informazioni' })).toBeInTheDocument();
});

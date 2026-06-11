import { decodificaEntita, tronca } from '../../scripts/fonti/testo';

test('decodifica entita nominate e numeriche', () => {
  expect(decodificaEntita('citt&agrave; &rsquo; &#8217; &#x2019;')).toBe('città ’ ’ ’');
});

test('tronca a fine parola con ellissi solo se serve', () => {
  expect(tronca('breve', 160)).toBe('breve');
  const lungo = 'parola '.repeat(40).trim();
  const t = tronca(lungo, 50);
  expect(t.length).toBeLessThanOrEqual(51);
  expect(t.endsWith('…')).toBe(true);
  // nessuno spazio prima dell'ellissi
  expect(t).not.toMatch(/ …$/);
});

test('tronca non taglia a meta parola', () => {
  const testo = 'una frase abbastanza lunga che supera il limite fissato per il test';
  const risultato = tronca(testo, 30);
  // deve terminare con ellissi e non contenere una parola tagliata
  expect(risultato.endsWith('…')).toBe(true);
  const senzaEllissi = risultato.slice(0, -1);
  // l'ultima "parola" non deve essere un frammento: deve coincidere con una parola del testo
  const parole = testo.split(' ');
  const ultimaParola = senzaEllissi.trim().split(' ').pop() ?? '';
  expect(parole).toContain(ultimaParola);
});

test('tronca con taglio duro se nessuno spazio entro il limite', () => {
  const senzaSpazi = 'abcdefghijklmnopqrstuvwxyz';
  const risultato = tronca(senzaSpazi, 10);
  expect(risultato).toBe('abcdefghij…');
});

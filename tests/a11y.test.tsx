import { render } from '@testing-library/react';
import axe from 'axe-core';
import { Home } from '../src/features/Home';
import { Wizard } from '../src/features/Wizard';
import { Catalogo } from '../src/features/Catalogo';
import { Report } from '../src/features/Report';
import { Empatia } from '../src/features/Empatia';
import { Privacy } from '../src/features/Privacy';
import { cuneoFiscale } from '../src/data/laws/cuneo-fiscale';
import { CATALOGO } from '../src/data/laws';
import type { Profilo } from '../src/engine/types';

const profilo: Profilo = { schemaVersion: 1, eta: 34, condizioneLavorativa: 'dipendente-privato', fasciaReddito: 'da15a20k' };

async function verificaAccessibilita(elemento: React.ReactElement, nome: string) {
  const { container } = render(elemento);
  const risultato = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } }); // jsdom non calcola i colori reali
  const violazioni = risultato.violations.map((v) => `${nome}: ${v.id} — ${v.help} — nodi: ${v.nodes.map((n) => n.target.join(' ')).join('; ')}`);
  expect(violazioni).toEqual([]);
}

test('Home è accessibile', () =>
  verificaAccessibilita(<Home haProfilo={false} onAvanti={() => {}} onPrivacy={() => {}} />, 'Home'), { timeout: 15000 });
test('Wizard è accessibile', () =>
  verificaAccessibilita(<Wizard iniziale={null} esploratore={false} onFine={() => {}} onAnnulla={() => {}} />, 'Wizard'), { timeout: 15000 });
test('Catalogo è accessibile', () =>
  verificaAccessibilita(<Catalogo profilo={profilo} esploratore={false} leggi={CATALOGO} novita={null}
    infoCatalogo={{ fonte: 'locale' }} onScegli={() => {}}
    onModificaProfilo={() => {}} onPrivacy={() => {}} onHome={() => {}} onEsciEsploratore={() => {}} />, 'Catalogo'), { timeout: 15000 });
test('Report è accessibile', () =>
  verificaAccessibilita(<Report profilo={profilo} legge={cuneoFiscale} esploratore={false}
    onAltri={() => {}} onIndietro={() => {}} />, 'Report'), { timeout: 15000 });
test('Empatia è accessibile', () =>
  verificaAccessibilita(<Empatia legge={cuneoFiscale} onCreaIpotetico={() => {}} onIndietro={() => {}} />, 'Empatia'), { timeout: 15000 });
test('Privacy è accessibile', () =>
  verificaAccessibilita(<Privacy tema="auto" onCambiaTema={() => {}} onCancellaTutto={() => {}} onIndietro={() => {}} />, 'Privacy'), { timeout: 15000 });

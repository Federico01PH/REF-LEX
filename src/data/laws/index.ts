import type { Legge } from '../../engine/types';
import { cuneoFiscale } from './cuneo-fiscale';
import { salarioMinimo } from './salario-minimo';
import { pensioniRequisiti } from './pensioni-requisiti';
import { assegnoInclusione } from './assegno-inclusione';
import { caseGreen } from './case-green';
import { bonusEdilizi } from './bonus-edilizi';
import { riformaDisabilita } from './riforma-disabilita';
import { fibromialgiaLea } from './fibromialgia-lea';
import { aiAct } from './ai-act';
import { decretoSicurezza } from './decreto-sicurezza';
import { codiceStrada } from './codice-strada';
import { iusItaliae } from './ius-italiae';

export const CATALOGO: Legge[] = [
  cuneoFiscale, salarioMinimo, pensioniRequisiti, assegnoInclusione,
  caseGreen, bonusEdilizi, riformaDisabilita, fibromialgiaLea, aiAct, decretoSicurezza,
  codiceStrada, iusItaliae
];

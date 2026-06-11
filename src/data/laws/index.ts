import type { Legge } from '../../engine/types';
import { cuneoFiscale } from './cuneo-fiscale';
import { salarioMinimo } from './salario-minimo';
import { pensioniRequisiti } from './pensioni-requisiti';
import { assegnoInclusione } from './assegno-inclusione';
import { caseGreen } from './case-green';
import { bonusEdilizi } from './bonus-edilizi';

export const CATALOGO: Legge[] = [cuneoFiscale, salarioMinimo, pensioniRequisiti, assegnoInclusione, caseGreen, bonusEdilizi];

import type { Legge } from '../../engine/types';
import { cuneoFiscale } from './cuneo-fiscale';
import { salarioMinimo } from './salario-minimo';
import { pensioniRequisiti } from './pensioni-requisiti';

export const CATALOGO: Legge[] = [cuneoFiscale, salarioMinimo, pensioniRequisiti];

import type { Legge } from '../../engine/types';
import { cuneoFiscale } from './cuneo-fiscale';
import { salarioMinimo } from './salario-minimo';

export const CATALOGO: Legge[] = [cuneoFiscale, salarioMinimo];

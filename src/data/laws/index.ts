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
import { decretoLavoro } from './decreto-lavoro-2026';
import { leggeElettorale } from './legge-elettorale-2026';
import { premierato } from './premierato-2026';
import { remigrazione } from './remigrazione';
import { dlMigrazioneAsilo } from './dl-migrazione-asilo-2026';

export const CATALOGO: Legge[] = [
  cuneoFiscale, salarioMinimo, pensioniRequisiti, assegnoInclusione,
  caseGreen, bonusEdilizi, riformaDisabilita, fibromialgiaLea, aiAct, decretoSicurezza,
  codiceStrada, iusItaliae, decretoLavoro, leggeElettorale, premierato, remigrazione,
  dlMigrazioneAsilo
];

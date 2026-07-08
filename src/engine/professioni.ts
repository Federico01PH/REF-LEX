import type { Profilo, SettoreProfessionale } from './types';

// Classificatore deterministico del mestiere scritto in chiaro: nessuna API, solo
// parole chiave (radici di parola). Serve a capire se una legge tocca proprio il
// mestiere della persona (es. agricoltori per la caccia). Se il testo c'è ma non
// corrisponde a nessun settore, restituiamo ['altro'] (campo presente → "non ti tocca"
// pulito, non "dato mancante"). Se il testo manca, [] (dato non indicato).

type SettoreMappato = Exclude<SettoreProfessionale, 'altro'>;

// radici cercate come sottostringa nel testo normalizzato. Scelte per evitare i falsi
// positivi classici: niente 'caccia' nudo (→ cacciavite), niente 'profess' nudo
// (→ libero professionista), niente 'oss' nudo (→ grossista).
const RADICI: Record<SettoreMappato, string[]> = {
  agricoltura: [
    'agricol', 'contadin', 'coltivator', 'coltivatric', 'allevator', 'allevatric',
    'bracciante', 'azienda agricola', 'fattoria', 'viticol', 'vitivinicol', 'vignaiol',
    'apicol', 'florovivaist', 'ortofrutt', 'pastore', 'pastoriz', 'mungitor', 'contadini'
  ],
  caccia: ['cacciator', 'cacciatric', 'guardiacaccia', 'guardia venatoria', 'venator'],
  sanita: [
    'infermier', 'medic', 'sanitar', 'ostetric', 'fisioterap', 'farmacist', 'radiolog',
    'chirurg', 'pediatr', 'dentist', 'odontoiatr', 'operatore socio', 'operatrice socio', 'caposala'
  ],
  scuola: [
    'insegnant', 'docent', 'maestr', 'professore', 'professoress', 'professor',
    'educator', 'educatric', 'ricercator', 'ricercatric', 'preside'
  ],
  'forze-ordine': [
    'polizi', 'carabinier', 'guardia di finanza', 'finanzier', 'vigile del fuoco',
    'vigil del fuoc', 'pompier', 'militar', 'esercito', 'marina militar',
    'aeronautica militar', 'guardia costiera', 'agente di polizia', 'vigile urban'
  ]
};

function normalizza(testo: string): string {
  return testo
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // toglie gli accenti (segni diacritici combinanti)
    .replace(/\s+/g, ' ')
    .trim();
}

export function settoriDaProfessione(professione?: string): SettoreProfessionale[] {
  if (!professione) return [];
  const t = normalizza(professione);
  if (!t) return [];
  const trovati: SettoreProfessionale[] = [];
  for (const settore of Object.keys(RADICI) as SettoreMappato[]) {
    if (RADICI[settore].some((r) => t.includes(r))) trovati.push(settore);
  }
  return trovati.length > 0 ? trovati : ['altro'];
}

// Restituisce una copia del profilo con settoriProfessionali SEMPRE valorizzato:
// il settore ricavato dal mestiere, oppure ['altro'] se non c'è (o non è riconosciuto).
// Così le regole legate al mestiere non producono mai un "dato mancante" fuorviante
// (in particolare per chi non lavora e a cui il campo non viene nemmeno chiesto):
// semplicemente non si applicano. Da chiamare quando il profilo viene finalizzato
// (wizard) o ricaricato (storage).
export function conSettoriProfessionali(profilo: Profilo): Profilo {
  const settori = settoriDaProfessione(profilo.professione);
  return { ...profilo, settoriProfessionali: settori.length > 0 ? settori : ['altro'] };
}

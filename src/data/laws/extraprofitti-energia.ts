import type { Legge } from '../../engine/types';

// Verificato da: Legge 25 settembre 2026, n. 166 (GU Serie generale n. 223 del 25/9/2026),
// conversione con modificazioni del decreto-legge 27 luglio 2026, n. 133 ("prezzi petroliferi
// connessi alla ulteriore crisi dei mercati internazionali" e ILVA). L'art. 1, c. 2, della legge
// abroga i DL 139/2026 e 153/2026 facendone salvi gli effetti: il loro contenuto è confluito qui.
// Testo coordinato in GU (26A05124). Data verifica: 2026-10-06.
//
// È la misura che stampa e politica chiamano "tassa sugli extraprofitti". Dal testo:
// - art. 2-bis, c. 1-2: le società italiane controllanti di gruppi con ricavi consolidati
//   oltre 20 miliardi di euro, attive in petrolio, gas, altri prodotti energetici o energia
//   elettrica, versano ogni anno IN ANTICIPO un importo pari alle ritenute e imposte sostitutive
//   sui dividendi deliberati e pagati nell'esercizio successivo. Per il 2026 solo sui dividendi
//   deliberati prima del 27/8/2026 e pagati dopo il 31/12/2026.
// - c. 4: l'importo è il 39% di quelle ritenute; c. 6: entro il 30 novembre di ogni anno.
// - c. 7-10: le società recuperano TUTTO come credito d'imposta quando pagano i dividendi
//   (l'eccedenza si compensa o si fa rimborsare); c. 9: aliquote e modalità delle ritenute
//   restano le stesse; c. 14: per chi riceve i dividendi la tassazione non cambia.
// - c. 13 + art. 3-bis: lo stesso meccanismo entra nel nuovo testo unico su versamenti e
//   riscossione (d.lgs. 33/2025, art. 55-bis): è stabile, non una tantum.
// - art. 3, c. 2, lett. f: l'anticipo vale 130,3 milioni nel 2026, una delle coperture (in tutto
//   479,8 milioni nel 2026) dello sconto sul gasolio (art. 1, c. 1: dal 30/7 al 24/8 e dal 27/8
//   al 5/9/2026) e del credito all'autotrasporto (art. 1, c. 4); il resto viene da tagli e
//   fondi dei ministeri (lett. a-e).
// - art. 1, c. 4: credito d'imposta alle imprese di autotrasporto esteso ai mesi da marzo ad
//   agosto 2026, tetto 397,6 milioni (modifica l'art. 3 del DL 33/2026).
//
// NON è una tassa sugli utili "in più" come il contributo di solidarietà europeo del 2022:
// non cambia quanto le società pagano in tutto, cambia QUANDO lo pagano. La scheda lo dice.
// Nessun effetto sui diritti: è una misura di cassa, e la regola sugli effetti indiretti non
// inventa erosioni che non ci sono.

const FONTE_LEGGE = {
  etichetta: 'Gazzetta Ufficiale - Legge 25 settembre 2026, n. 166',
  url: 'https://www.gazzettaufficiale.it/eli/id/2026/09/25/26G00184/SG'
};
const FONTE_COORDINATO = {
  etichetta: 'Gazzetta Ufficiale - Testo coordinato del DL 133/2026 con la legge 166/2026',
  url: 'https://www.gazzettaufficiale.it/eli/id/2026/09/25/26A05124/SG'
};
const FONTE_NORMATTIVA = {
  etichetta: 'Normattiva - Decreto-legge 27 luglio 2026, n. 133',
  url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legge:2026-07-27;133'
};
const FONTE_DOSSIER_162 = {
  etichetta: 'Camera dei deputati - Dossier sul DL 162/2026 (autotrasporto fino a ottobre)',
  url: 'https://documenti.camera.it/leg19/dossier/testi/D26162.htm'
};

export const extraprofittiEnergia: Legge = {
  id: 'extraprofitti-energia-2026',
  titoloDivulgativo: 'Extraprofitti dell\'energia: l\'anticipo di tasse chiesto ai grandi gruppi',
  titoloUfficiale: 'Legge 25 settembre 2026, n. 166 - Conversione del decreto-legge 27 luglio 2026, n. 133 (prezzi petroliferi e ILVA), art. 2-bis: versamento anticipato di somme commisurate alle ritenute su utili deliberati da grandi gruppi energetici',
  meseAnno: 'settembre 2026',
  stato: 'vigore',
  ambiti: ['fisco-lavoro'],
  fonti: [FONTE_LEGGE, FONTE_COORDINATO, FONTE_NORMATTIVA, FONTE_DOSSIER_162],
  verificataIl: '2026-10-06',
  riassunto: 'La misura che sui giornali è chiamata "tassa sugli extraprofitti". In realtà non è una tassa nuova: i grandi gruppi italiani dell\'energia, con più di 20 miliardi di ricavi, devono anticipare ogni anno allo Stato il 39% delle tasse sui dividendi che pagheranno l\'anno dopo, e poi le recuperano tutte. Nel 2026 l\'anticipo porta 130,3 milioni che, con tagli ai fondi dei ministeri, pagano lo sconto sul gasolio dal 30 luglio al 5 settembre e un aiuto all\'autotrasporto.',
  regole: [
    {
      // vale per chiunque: è la notizia che serve a tutti, anche se il conto non arriva a nessuno
      id: 'extraprofitti-chi-paga',
      campiNecessari: [],
      condizioni: [],
      effetto: {
        tipo: 'economico',
        descrizione: 'Questa è la misura che i giornali chiamano "tassa sugli extraprofitti", ma non è una tassa in più e non la paghi tu. Riguarda solo i grandi gruppi italiani dell\'energia (petrolio, gas, elettricità) con più di 20 miliardi di euro di ricavi. Ogni anno, entro il 30 novembre, devono versare allo Stato in anticipo il 39% delle tasse sui dividendi già decisi, che verranno pagati agli azionisti l\'anno dopo. Quando pagano davvero i dividendi, quei soldi tornano a loro per intero come credito d\'imposta. Le aliquote non cambiano: se hai azioni di queste società, le tasse sul tuo dividendo restano le stesse. In pratica lo Stato incassa prima, non di più.',
        breve: 'Non è una tassa nuova e non la paghi tu: i grandi gruppi dell\'energia anticipano tasse che poi recuperano.',
        direzione: 'neutro'
      },
      timeline: { anno1: 'attivo', anno2: 'attivo', anno5: 'attivo', anno10: 'attivo' },
      confidenza: 'certa',
      noteConfidenza: 'Art. 2-bis del decreto-legge 133/2026, aggiunto dalla legge di conversione 166/2026: vale dal 2026 ed è un meccanismo stabile, ripreso dal nuovo testo unico su versamenti e riscossione (art. 55-bis). Il comma 9 dice che l\'anticipo non cambia aliquote e regole delle ritenute, il comma 14 che chi riceve i dividendi è tassato come sempre. Per il 2026 vale solo per i dividendi decisi prima del 27 agosto e pagati dopo il 31 dicembre 2026. È diverso dal contributo di solidarietà europeo del 2022 (regolamento UE 2022/1854), che tassava la parte di utili sopra la media degli anni precedenti.',
      fonteRegola: FONTE_COORDINATO
    },
    {
      // art. 1, c. 4: il credito va all'IMPRESA di autotrasporto, non a chi guida da dipendente
      id: 'extraprofitti-autotrasporto',
      campiNecessari: ['settoriProfessionali', 'condizioneLavorativa'],
      condizioni: [
        { campo: 'settoriProfessionali', op: 'in', valore: ['trasporti'] },
        { campo: 'condizioneLavorativa', op: 'in', valore: ['autonomo-ordinario', 'forfettario', 'imprenditore'] }
      ],
      effetto: {
        tipo: 'economico',
        descrizione: 'Se hai un\'impresa di autotrasporto, questa legge allunga fino ad agosto 2026 il credito d\'imposta sul gasolio: ti viene riconosciuta una parte di quanto hai speso in più rispetto al prezzo di febbraio 2026, mese per mese da marzo ad agosto. Vale per il trasporto di merci con mezzi pesanti, per il trasporto di persone e per il noleggio di autobus con conducente con mezzi Euro V o VI. I fondi hanno un tetto (397,6 milioni in tutto per il 2026), la domanda segue le regole del decreto del Ministero delle infrastrutture e dei trasporti e il credito si usa entro il 31 dicembre 2026. Decreti successivi lo hanno esteso anche a settembre e ottobre.',
        breve: 'Se hai un\'impresa di autotrasporto: credito d\'imposta sul gasolio pagato in più da marzo ad agosto 2026.',
        direzione: 'positivo'
      },
      timeline: { anno1: 'attivo', anno2: 'nullo', anno5: 'nullo', anno10: 'nullo' },
      confidenza: 'dipende',
      noteConfidenza: 'Quanto ricevi dipende dal gasolio che hai consumato e dalle regole su domande e importi del decreto del Ministero delle infrastrutture del 23 maggio 2026. Va all\'impresa, non a chi guida come dipendente. Art. 1, comma 4, del DL 133/2026 come convertito, che modifica l\'art. 3 del DL 33/2026; le estensioni a settembre e ottobre sono nei decreti-legge 157 e 162 del 2026.',
      fonteRegola: FONTE_COORDINATO
    }
  ]
};

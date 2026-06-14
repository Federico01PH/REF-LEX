import type { Legge } from '../../engine/types';

// Verified from: Senato della Repubblica, Atto Senato S. 935 (XIX legislatura) - "Modifiche
// alla parte seconda della Costituzione per l'elezione diretta del Presidente del Consiglio
// dei ministri, il rafforzamento della stabilita' del Governo e l'abolizione della nomina dei
// senatori a vita da parte del Presidente della Repubblica". Fonte istituzionale consultata il
// 13/06/2026: scheda e iter su senato.it (did=57694).
//
// Dati dell'iter (da senato.it):
// - iniziativa Governo Meloni (min. Casellati); presentato il 15/11/2023;
// - APPROVATO dal Senato il 18 giugno 2024 (testo modificato, assorbe S. 830);
// - trasmesso alla Camera: C. 1921, in esame in commissione dal 4/7/2024.
// Natura: legge costituzionale (prima deliberazione). Modifica gli artt. 59, 88, 92 e 94 Cost.
//
// Contenuto principale: elezione diretta del Presidente del Consiglio a suffragio universale,
// contestuale alle Camere, con mandato di 5 anni; premio (rinviato alla legge elettorale) per
// garantire una maggioranza alle liste collegate al premier; ridimensionamento dei poteri del
// Presidente della Repubblica (scioglimento delle Camere, nomina del Governo); abolizione dei
// senatori a vita di nomina presidenziale (art. 59).
//
// Trattandosi di riforma COSTITUZIONALE serve la doppia approvazione conforme di entrambe le
// Camere e, di norma, un referendum confermativo (che NON ha quorum). Quindi: stato "discussione",
// orizzonti incerti, confidenza "dipende". REF-LEX segnala il tema, non dice come votare.

const FONTE = {
  etichetta: 'Senato della Repubblica - DDL costituzionale S. 935 (premierato), scheda e iter',
  url: 'https://www.senato.it/leggi-e-documenti/disegni-di-legge/scheda-ddl?did=57694'
};
const ART1 = 'https://www.senato.it/istituzione/la-costituzione/principi-fondamentali/articolo-1';

export const premierato: Legge = {
  id: 'premierato-2026',
  titoloDivulgativo: 'Premierato: l\'elezione diretta del Presidente del Consiglio',
  titoloUfficiale: 'Disegno di legge costituzionale S. 935 (C. 1921) - Modifiche alla parte seconda della Costituzione per l\'elezione diretta del Presidente del Consiglio dei ministri',
  stato: 'discussione',
  ambiti: ['politica-voto'],
  fonti: [FONTE],
  verificataIl: '2026-06-13',
  riassunto: 'Una riforma della Costituzione (non ancora definitiva) per far eleggere direttamente dai cittadini il Presidente del Consiglio, insieme al Parlamento, con un mandato di 5 anni. Oggi invece il Presidente del Consiglio è nominato dal Presidente della Repubblica dopo le elezioni. La riforma rafforza la stabilità del governo e abolisce i senatori a vita nominati dal Capo dello Stato. Il Senato l\'ha approvata il 18 giugno 2024; ora è alla Camera. Per diventare legge servirà un referendum.',
  regole: [
    {
      id: 'premierato-elezione-diretta',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se la riforma viene approvata e confermata dal referendum, potrai eleggere direttamente il Presidente del Consiglio insieme alle Camere, con un mandato di 5 anni. Oggi invece il Presidente del Consiglio non lo scegli col voto: lo nomina il Presidente della Repubblica dopo le elezioni. Avresti quindi più voce diretta su chi guida il governo.',
        direzione: 'misto'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'Riforma costituzionale (DDL S. 935): approvata dal Senato il 18 giugno 2024, ora all\'esame della Camera (C. 1921). Per le riforme costituzionali serve la doppia approvazione conforme di entrambe le Camere e poi, di norma, un referendum confermativo, che NON ha bisogno di quorum.',
      fonteRegola: FONTE
    },
    {
      id: 'premierato-equilibrio-poteri',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sulle garanzie costituzionali: insieme all\'elezione diretta, la riforma dà al premier una maggioranza garantita, riduce i poteri del Presidente della Repubblica (per esempio sullo scioglimento delle Camere e sulla nomina del governo) e abolisce i senatori a vita di nomina presidenziale. Per chi la sostiene è più stabilità e una scelta più chiara; per chi la critica sono meno contrappesi a chi governa.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 1',
          diritto: 'sovranità popolare ed equilibrio tra i poteri',
          intensita: 'sensibile',
          url: ART1
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'La riforma modifica gli artt. 59, 88, 92 e 94 della Costituzione. Il punto più discusso è l\'equilibrio tra i poteri: meno margini per il Presidente della Repubblica come garante e una maggioranza assicurata al governo. È un giudizio politico, non tecnico: REF-LEX ti segnala il tema, non ti dice come votare. Riforma non ancora definitiva: servirà il referendum.',
      fonteRegola: FONTE
    }
  ]
};

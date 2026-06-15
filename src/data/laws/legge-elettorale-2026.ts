import type { Legge } from '../../engine/types';

// Verified from: Camera dei deputati, A.C. 2822 (Bignami) - "Disposizioni in materia di
// elezione della Camera dei deputati e del Senato della Repubblica", testo base detto
// "Bignami bis" / "Stabilicum". Fonti istituzionali consultate il 13/06/2026: scheda e iter
// su camera.it e focus del Servizio Studi della Camera (riscontro numeri sul testo base
// adottato in Commissione Affari costituzionali, in Aula dal 26/6/2026).
//
// Contenuto del testo base "Bignami bis":
// - sistema PROPORZIONALE; soppressi i collegi uninominali (salvo Valle d'Aosta e Trentino-AA),
//   i seggi vanno ai collegi plurinominali; NESSUN voto di preferenza;
// - "premio di governabilita": 70 seggi alla Camera e 35 al Senato alla lista/coalizione che
//   arriva prima, SOLO se supera il 42% dei voti validi in ENTRAMBE le Camere (nel "Bignami bis"
//   sparisce il ballottaggio della prima versione di febbraio, che era al 40%);
// - tetto: la maggioranza col premio non puo' superare ~60% (max 220 seggi Camera, 113 Senato);
// - soglia di sbarramento al 3% (invariata);
// - le coalizioni indicano il nome proposto come Presidente del Consiglio (trasparenza, senza
//   effetti vincolanti, nel rispetto delle prerogative del Presidente della Repubblica).
// La relazione richiama le sentenze della Corte costituzionale 1/2014 (Porcellum) e 35/2017
// (Italicum) sui limiti ai premi di maggioranza.
//
// E' una PROPOSTA non ancora legge: stato "discussione", orizzonti incerti, confidenza "dipende".

const FONTE = {
  etichetta: 'Camera dei deputati - A.C. 2822 (Bignami), iter e testo',
  url: 'https://www.camera.it/leg19/126?idDocumento=2822&leg=19'
};
const ART48 = 'https://www.senato.it/istituzione/la-costituzione/parte-i/titolo-iv/articolo-48';

export const leggeElettorale: Legge = {
  id: 'legge-elettorale-2026',
  titoloDivulgativo: 'Nuova legge elettorale: proporzionale con premio di maggioranza',
  titoloUfficiale: 'Proposta di legge A.C. 2822 (Bignami) - Disposizioni in materia di elezione della Camera dei deputati e del Senato della Repubblica ("Bignami bis"/"Stabilicum")',
  stato: 'discussione',
  ambiti: ['politica-voto'],
  fonti: [FONTE],
  verificataIl: '2026-06-13',
  riassunto: 'Una proposta di legge (non ancora approvata) per cambiare come si vota in Italia. Spariscono i collegi uninominali: si torna a un sistema proporzionale, senza voto di preferenza. Chi arriva primo, se supera il 42% in entrambe le Camere, riceve un premio di seggi (70 alla Camera, 35 al Senato) per avere una maggioranza stabile, con un tetto di circa il 60%. Le coalizioni indicano il nome del candidato premier. In discussione alla Camera dal 26 giugno 2026.',
  regole: [
    {
      id: 'elettorale-come-voti',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Se la proposta diventa legge, cambia come voti: niente più collegi uninominali (non scegli più un singolo candidato del tuo territorio), torna il sistema proporzionale e non ci sono voti di preferenza, quindi scegli la lista ma non la persona. Le coalizioni devono indicare in anticipo il nome che propongono come Presidente del Consiglio.',
        breve: 'Cambia come voti: sistema proporzionale, niente preferenze (scegli la lista, non la persona) né collegi uninominali.',
        direzione: 'misto'
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'È una proposta (A.C. 2822, testo base "Bignami bis"), non ancora legge: in discussione alla Camera dal 26 giugno 2026 e modificabile con gli emendamenti. Resta la soglia di sbarramento del 3% per entrare in Parlamento.',
      fonteRegola: FONTE
    },
    {
      id: 'elettorale-premio-governabilita',
      campiNecessari: ['eta'],
      condizioni: [{ campo: 'eta', op: 'almeno', valore: 18 }],
      effetto: {
        tipo: 'diritto',
        descrizione: 'Effetto indiretto sul peso del tuo voto: il "premio di governabilità" assegna 70 seggi in più alla Camera e 35 al Senato alla coalizione che arriva prima, se supera il 42% dei voti in entrambe le Camere. Serve a dare governi più stabili, ma vuol dire che chi vince ottiene molti più seggi della sua percentuale di voti, e chi vota per gli altri pesa di meno. C\'è un tetto: la maggioranza non può superare circa il 60% dei seggi.',
        breve: 'Effetto indiretto: il premio di governabilità dà più seggi a chi vince, così il voto per gli altri pesa di meno.',
        direzione: 'misto',
        indiretto: true,
        dirittoToccato: {
          carta: 'Costituzione italiana',
          articolo: 'art. 48',
          diritto: 'eguaglianza del voto',
          intensita: 'sensibile',
          url: ART48
        }
      },
      timeline: { anno1: 'incerto', anno2: 'incerto', anno5: 'incerto', anno10: 'incerto' },
      confidenza: 'dipende',
      noteConfidenza: 'La Corte costituzionale ha già bocciato premi di maggioranza troppo sproporzionati: sentenza 1/2014 sul "Porcellum" e 35/2017 sull\'"Italicum". Qui una soglia (42%) e un tetto ai seggi sono pensati per rispettarle, ma l\'eguaglianza del voto (art. 48 Cost.) resta al centro del dibattito; inoltre parte degli eletti col premio ("listone") potrebbe non essere riconoscibile sulla scheda. Proposta non ancora approvata.',
      fonteRegola: FONTE
    }
  ]
};

// Applica il tema scuro/chiaro PRIMA del primo paint, per evitare il lampo bianco
// all'avvio quando l'utente usa il tema scuro. Script esterno same-origin: passa
// la CSP (script-src 'self') senza bisogno di hash.
// La logica deve restare allineata a src/ui/temaIniziale.ts (risolviTema).
(function () {
  try {
    var salvato = localStorage.getItem('reflex.tema');
    var sistemaScuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var tema = salvato === 'dark' ? 'dark' : salvato === 'light' ? 'light' : (sistemaScuro ? 'dark' : 'light');
    document.documentElement.dataset.theme = tema;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();

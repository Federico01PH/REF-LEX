import { useEffect, useState } from 'react';
import type { Legge, Profilo } from './engine/types';
import type { NovitaFile } from './engine/novita';
import { CATALOGO } from './data/laws';
import { VERSIONE_CATALOGO } from './data/laws/versione';
import { caricaCatalogoRemoto, caricaNovita } from './storage/datiRemoti';
import { caricaProfilo, caricaTema, salvaProfilo, salvaTema } from './storage/profilo';
import { Benvenuto } from './features/Benvenuto';
import { Wizard } from './features/Wizard';
import { Catalogo } from './features/Catalogo';
import { Report } from './features/Report';
import { Empatia } from './features/Empatia';
import { Privacy } from './features/Privacy';

type Vista =
  | { nome: 'benvenuto' } | { nome: 'wizard'; esploratore: boolean }
  | { nome: 'catalogo' } | { nome: 'report'; leggeId: string }
  | { nome: 'empatia'; leggeId: string } | { nome: 'privacy' };

export default function App() {
  const [profilo, setProfilo] = useState<Profilo | null>(() => caricaProfilo());
  const [profiloEsploratore, setProfiloEsploratore] = useState<Profilo | null>(null);
  const [vista, setVista] = useState<Vista>(() => (caricaProfilo() ? { nome: 'catalogo' } : { nome: 'benvenuto' }));
  const [tema, setTema] = useState<string>(() => caricaTema());

  const [catalogo, setCatalogo] = useState<Legge[]>(CATALOGO);
  const [infoCatalogo, setInfoCatalogo] = useState<{ fonte: 'locale' | 'remoto'; generatoIl?: string }>({ fonte: 'locale' });
  const [novita, setNovita] = useState<NovitaFile | null>(null);

  useEffect(() => {
    const scuroSistema = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const scuro = tema === 'dark' || (tema === 'auto' && scuroSistema);
    document.documentElement.dataset.theme = scuro ? 'dark' : 'light';
  }, [tema]);

  useEffect(() => {
    let attivo = true;
    caricaCatalogoRemoto(VERSIONE_CATALOGO).then((r) => {
      if (attivo && r) { setCatalogo(r.leggi); setInfoCatalogo({ fonte: 'remoto', generatoIl: r.generatoIl }); }
    });
    caricaNovita().then((n) => { if (attivo) setNovita(n); });
    return () => { attivo = false; };
  }, []);

  // se il catalogo remoto arriva mentre l'utente è su un report, l'id potrebbe non esserci più: fallback al catalogo incorporato
  const legge = (id: string) => catalogo.find((l) => l.id === id) ?? CATALOGO.find((l) => l.id === id)!;

  return (
    <main>
      {vista.nome === 'benvenuto' && (
        <Benvenuto onInizia={() => setVista({ nome: 'wizard', esploratore: false })}
          onPrivacy={() => setVista({ nome: 'privacy' })} />
      )}
      {vista.nome === 'wizard' && (
        <Wizard
          iniziale={vista.esploratore ? null : profilo}
          esploratore={vista.esploratore}
          onFine={(p) => {
            if (vista.esploratore) { setProfiloEsploratore(p); }
            else { setProfilo(p); salvaProfilo(p); setProfiloEsploratore(null); }
            setVista({ nome: 'catalogo' });
          }}
          onAnnulla={() => setVista(profilo ? { nome: 'catalogo' } : { nome: 'benvenuto' })} />
      )}
      {vista.nome === 'catalogo' && (profilo || profiloEsploratore) && (
        <Catalogo profilo={profiloEsploratore ?? profilo!}
          esploratore={profiloEsploratore !== null}
          leggi={catalogo}
          novita={novita}
          infoCatalogo={infoCatalogo}
          onScegli={(leggeId) => setVista({ nome: 'report', leggeId })}
          onModificaProfilo={() => setVista({ nome: 'wizard', esploratore: profiloEsploratore !== null })}
          onPrivacy={() => setVista({ nome: 'privacy' })}
          onEsciEsploratore={() => setProfiloEsploratore(null)} />
      )}
      {vista.nome === 'report' && (profilo || profiloEsploratore) && (
        <Report profilo={profiloEsploratore ?? profilo!} legge={legge(vista.leggeId)}
          esploratore={profiloEsploratore !== null}
          onAltri={() => setVista({ nome: 'empatia', leggeId: vista.leggeId })}
          onIndietro={() => setVista({ nome: 'catalogo' })} />
      )}
      {vista.nome === 'empatia' && (
        <Empatia legge={legge(vista.leggeId)}
          onCreaIpotetico={() => setVista({ nome: 'wizard', esploratore: true })}
          onIndietro={() => setVista({ nome: 'report', leggeId: vista.leggeId })} />
      )}
      {vista.nome === 'privacy' && (
        <Privacy tema={tema}
          onCambiaTema={(t) => { setTema(t); salvaTema(t); }}
          onCancellaTutto={() => { setProfilo(null); setProfiloEsploratore(null); setVista({ nome: 'benvenuto' }); }}
          onIndietro={() => setVista(profilo ? { nome: 'catalogo' } : { nome: 'benvenuto' })} />
      )}
    </main>
  );
}

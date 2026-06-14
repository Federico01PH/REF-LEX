import { useEffect, useState } from 'react';
import type { Legge, Profilo } from './engine/types';
import type { NovitaFile } from './engine/novita';
import { CATALOGO } from './data/laws';
import { VERSIONE_CATALOGO } from './data/laws/versione';
import { caricaCatalogoRemoto, caricaNovita } from './storage/datiRemoti';
import { caricaProfilo, caricaTema, salvaProfilo, salvaTema } from './storage/profilo';
import { Home } from './features/Home';
import { Wizard } from './features/Wizard';
import { Catalogo } from './features/Catalogo';
import { Report } from './features/Report';
import { Empatia } from './features/Empatia';
import { Privacy } from './features/Privacy';
import { AvvisoLeggeMancante } from './ui/AvvisoLeggeMancante';
import { BannerAggiornamento } from './ui/BannerAggiornamento';
import { useAggiornamentoPwa } from './pwa/useAggiornamentoPwa';

type Vista =
  | { nome: 'home' } | { nome: 'wizard'; esploratore: boolean }
  | { nome: 'catalogo' } | { nome: 'report'; leggeId: string }
  | { nome: 'empatia'; leggeId: string } | { nome: 'privacy' };

export default function App() {
  const [profilo, setProfilo] = useState<Profilo | null>(() => caricaProfilo());
  const [profiloEsploratore, setProfiloEsploratore] = useState<Profilo | null>(null);
  // l'app si apre sempre dalla home: il marchio e la missione, poi un bottone porta alle simulazioni
  const [vista, setVista] = useState<Vista>({ nome: 'home' });
  const [tema, setTema] = useState<string>(() => caricaTema());

  const aggiornamento = useAggiornamentoPwa();

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

  // se il catalogo remoto arriva mentre l'utente è su un report, l'id potrebbe non esserci più:
  // prima fallback al catalogo incorporato, e se nemmeno lì esiste si torna al catalogo con un avviso (niente crash)
  const legge = (id: string): Legge | undefined => catalogo.find((l) => l.id === id) ?? CATALOGO.find((l) => l.id === id);

  return (
    <main>
      <BannerAggiornamento pronto={aggiornamento.pronto} onAggiorna={aggiornamento.aggiorna} />
      {vista.nome === 'home' && (
        <Home haProfilo={profilo !== null} nome={profilo?.nome}
          onAvanti={() => setVista(profilo ? { nome: 'catalogo' } : { nome: 'wizard', esploratore: false })}
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
          onAnnulla={() => setVista(profilo ? { nome: 'catalogo' } : { nome: 'home' })} />
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
          onHome={() => setVista({ nome: 'home' })}
          onEsciEsploratore={() => setProfiloEsploratore(null)} />
      )}
      {vista.nome === 'report' && (profilo || profiloEsploratore) && (() => {
        const l = legge(vista.leggeId);
        return l ? (
          <Report profilo={profiloEsploratore ?? profilo!} legge={l}
            esploratore={profiloEsploratore !== null}
            onAltri={() => setVista({ nome: 'empatia', leggeId: vista.leggeId })}
            onIndietro={() => setVista({ nome: 'catalogo' })} />
        ) : <AvvisoLeggeMancante onIndietro={() => setVista({ nome: 'catalogo' })} />;
      })()}
      {vista.nome === 'empatia' && (() => {
        const l = legge(vista.leggeId);
        return l ? (
          <Empatia legge={l}
            onCreaIpotetico={() => setVista({ nome: 'wizard', esploratore: true })}
            onIndietro={() => setVista({ nome: 'report', leggeId: vista.leggeId })} />
        ) : <AvvisoLeggeMancante onIndietro={() => setVista({ nome: 'catalogo' })} />;
      })()}
      {vista.nome === 'privacy' && (
        <Privacy tema={tema}
          onCambiaTema={(t) => { setTema(t); salvaTema(t); }}
          onCancellaTutto={() => { setProfilo(null); setProfiloEsploratore(null); setVista({ nome: 'home' }); }}
          onIndietro={() => setVista(profilo ? { nome: 'catalogo' } : { nome: 'home' })} />
      )}
    </main>
  );
}

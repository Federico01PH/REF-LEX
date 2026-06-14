import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface Stato { errore: boolean; }

// Rete di sicurezza: se un componente va in errore, mostra un messaggio
// invece di lasciare lo schermo bianco. I dati restano salvati sul dispositivo.
export class ErrorBoundary extends Component<Props, Stato> {
  state: Stato = { errore: false };

  static getDerivedStateFromError(): Stato {
    return { errore: true };
  }

  componentDidCatch(errore: Error, info: ErrorInfo) {
    // utile solo in sviluppo; in produzione resta nei log del browser dell'utente
    console.error('REF-LEX: errore non gestito', errore, info);
  }

  render() {
    if (this.state.errore) {
      return (
        <div className="home">
          <h2>Qualcosa è andato storto</h2>
          <p className="motto">
            Si è verificato un problema imprevisto. I tuoi dati restano salvati sul tuo dispositivo:
            prova a ricaricare la pagina.
          </p>
          <button className="btn" onClick={() => window.location.reload()}>Ricarica la pagina</button>
        </div>
      );
    }
    return this.props.children;
  }
}

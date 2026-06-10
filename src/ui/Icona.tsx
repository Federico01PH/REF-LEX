const TRACCIATI: Record<string, string> = {
  lucchetto: 'M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Z',
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 7h2v2h-2V9Zm0 4h2v6h-2v-6Z',
  freccia: 'M5 12h12m0 0-5-5m5 5-5 5',
  indietro: 'M19 12H7m0 0 5 5m-5-5 5-5',
  persona: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6Z',
  persone: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20v-1c0-2.5 3-4 6-4s6 1.5 6 4v1H2Zm14 0v-1c0-1.4-.6-2.5-1.5-3.4 1-.4 2.2-.6 3.5-.6 3 0 4 1.5 4 4v1h-6Z',
  spunta: 'M5 13l4 4L19 7',
  cestino: 'M9 3h6l1 2h4v2H4V5h4l1-2Zm-3 6h12l-1 12H7L6 9Z',
  occhio: 'M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z',
  documento: 'M6 2h9l5 5v15H6V2Zm8 1v5h5'
};

export function Icona({ nome, etichetta, dimensione = 20 }:
  { nome: keyof typeof TRACCIATI | string; etichetta?: string; dimensione?: number }) {
  return (
    <svg data-testid={`icona-${nome}`} width={dimensione} height={dimensione}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
      role={etichetta ? 'img' : undefined}
      aria-label={etichetta} aria-hidden={etichetta ? undefined : true}>
      <path d={TRACCIATI[nome] ?? ''} />
    </svg>
  );
}

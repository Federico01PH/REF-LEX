// Marchio di REF-LEX: una bilancia (il simbolo della legge) su una tessera
// con il gradiente dell'app, accanto al nome. La dimensione la decide il CSS
// del contenitore (.marchio-riga, .home).
export function Marchio() {
  return (
    <>
      <span className="marchio-logo" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4v16M8.5 20h7M5 7h14" />
          <path d="M5 7l-2.6 5.6a2.9 2.9 0 0 0 5.2 0L5 7Z" />
          <path d="M19 7l-2.6 5.6a2.9 2.9 0 0 0 5.2 0L19 7Z" />
        </svg>
      </span>
      <span className="marchio">REF<span className="marchio-trattino">-</span>LEX</span>
    </>
  );
}

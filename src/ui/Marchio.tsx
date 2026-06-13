// Marchio di REF-LEX: il logo dell'app (bilancia in oro su tessera blu notte)
// accanto al nome. La dimensione la decide il CSS del contenitore (.marchio-riga, .home).
export function Marchio() {
  return (
    <>
      <img className="marchio-logo" src={`${import.meta.env.BASE_URL}icona-512.png`} alt="" aria-hidden="true" width={512} height={512} />
      <span className="marchio">REF<span className="marchio-trattino">-</span>LEX</span>
    </>
  );
}

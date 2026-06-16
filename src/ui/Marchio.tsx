// Marchio di REF-LEX: il logo dell'app (bilancia in oro su tessera blu notte)
// accanto al nome. La dimensione la decide il CSS del contenitore (.marchio-riga, .home).
export function Marchio() {
  return (
    <>
      <span className="marchio-logo" aria-hidden="true">
        <img src={`${import.meta.env.BASE_URL}icona-512.png?v=2`} alt="" width={512} height={512} />
      </span>
      <span className="marchio">REF<span className="marchio-trattino">-</span>LEX</span>
    </>
  );
}

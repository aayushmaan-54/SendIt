import "./loader.css";

export default function Loader() {

  return (
    <>
      <div className="fixed inset-0 bg-black/75 flex flex-col items-center pt-70 z-50 overflow-hidden pb-32">
        <div className="loader"></div>
        <p className="text-xl font-black mt-3">Loading...</p>

        <span className="text-muted-text text-center font-semibold mt-20 max-w-2xl px-3">It may take some time depending on file(s) size</span>
      </div>
    </>
  );
}

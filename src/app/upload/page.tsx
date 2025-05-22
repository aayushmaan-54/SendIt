import FileUploader from "./components/file-uploader";


export default function UploadPage() {
  return (
    <>
      <main className="flex flex-col items-center justify-center mt-28">
        <h1 className="sm:text-5xl text-3xl font-black italic">Upload File</h1>

        <FileUploader />
      </main>
    </>
  );
}

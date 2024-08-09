import CreateCertificateForm from '@components/organisms/CreateCertificateForm';

export default function NewCertificate() {
  return (
    <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 px-4 py-4 xl:px-0">
      <h1 className="text-2xl font-semibold">Emitir novo certificado</h1>
      <CreateCertificateForm />
    </section>
  );
}

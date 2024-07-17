import CreateCertificateForm from '@components/organisms/CreateCertificateForm';

export default function NewCertificate() {
  return (
    <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 py-4">
      <h1>Emitir novo certificado</h1>
      <CreateCertificateForm />
    </section>
  );
}

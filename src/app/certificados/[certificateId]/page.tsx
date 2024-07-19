import { retrieveCertificateById } from './action';

export default async function Certificate({
  params,
}: {
  params: { certificateId: string };
}) {
  const [data] = await retrieveCertificateById({
    certificateId: params.certificateId,
  });

  if (!data?.certificate) {
    return;
  }

  return (
    <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 px-4 py-4 xl:px-0">
      <h1>
        Certificate -
        {`https://example.com/certificados/${params.certificateId}`}
        {/* TODO: replace with actual domain name in production environment */}
      </h1>
      <p>Cliente: {data.certificate?.clientName}</p>
      <p>Data: {new Date(data.certificate?.date).toLocaleDateString()}</p>
      <p>Empresa: {data.certificate?.companyName}</p>
      <p>Responsável técnico: {data.certificate?.technichalResponsible}</p>
    </section>
  );
}

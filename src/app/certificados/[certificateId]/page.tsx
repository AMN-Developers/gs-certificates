import { retrieveCertificateById } from './action';

export default async function Certificate({
  params,
}: {
  params: { certificateId: string };
}) {
  const [data, err] = await retrieveCertificateById({
    certificateId: params.certificateId,
  });

  console.log(data, err);

  return (
    <section className="mx-auto flex h-full max-w-screen-xl flex-col gap-4 px-4 py-4 xl:px-0">
      Certificate {params.certificateId}
    </section>
  );
}

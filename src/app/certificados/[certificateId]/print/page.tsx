import DynamicTemplate from '@/app/_components/templates/DynamicTemplate';
import { retrieveCertificateById } from '../action';

export default async function CertificatePrint({
  params,
}: {
  params: { certificateId: string };
}) {
  const [data] = await retrieveCertificateById({
    certificateId: params.certificateId,
  });

  if (!data?.certificate) {
    return null;
  }

  return (
    <DynamicTemplate
      certificate={data.certificate}
      certificateNumber={params.certificateId}
      type={data.certificate.type}
    />
  );
}

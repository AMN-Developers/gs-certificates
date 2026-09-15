import DynamicTemplate from '@/app/_components/templates/DynamicTemplate';
import { retrieveCertificateById } from '../action';

export default async function CertificatePrint({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const [data] = await retrieveCertificateById({
    certificateId,
  });

  if (!data?.certificate) {
    return null;
  }

  return (
    <DynamicTemplate
      certificate={data.certificate}
      certificateNumber={certificateId}
      type={data.certificate.type}
    />
  );
}

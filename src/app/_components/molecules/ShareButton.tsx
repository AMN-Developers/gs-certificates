'use client';

import { Button } from '@components/ui/button';

export default function ShareButton({
  clientName,
  certificateId,
}: {
  clientName: string;
  certificateId: string;
}) {
  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Certificado de Garantia de Higienização',
        text: `Certificado de Garantia de Higienização para ${clientName}`,
        url: `${window.location.origin}/certificados/${certificateId}`,
      });
    } catch (error) {
      console.error('Error sharing certificate:', error);
    }
  };

  return <Button onClick={() => handleShare()}>Enviar</Button>;
}

'use client';

import { Share } from 'lucide-react';
import { Button } from '@components/ui/button';
import { generateCertificatePDF } from '@/app/certificados/[certificateId]/action';
import { Dispatch, SetStateAction } from 'react';

export default function ShareButton({
  clientName,
  certificateId,
  setPdf,
  pdf,
  isGenerating,
  setIsGenerating,
}: {
  clientName: string;
  certificateId: string;
  // eslint-disable-next-line no-unused-vars
  setPdf: (pdf: Uint8Array) => void;
  pdf: Uint8Array | null;
  isGenerating: boolean;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;
}) {
  const handleShare = async () => {
    try {
      setIsGenerating(true);

      // If PDF doesn't exist yet, generate it first
      if (!pdf) {
        const [data, error] = await generateCertificatePDF({
          certificateId,
        });

        if (error || !data) {
          console.error('Error generating PDF:', error);
          setIsGenerating(false);
          return;
        }

        const uint8Array = new Uint8Array(data.pdf);
        setPdf(uint8Array);

        // Use the newly generated PDF
        const blob = new Blob([uint8Array], { type: 'application/pdf' });
        const file = new File([blob], `${clientName}-certificado.pdf`, {
          type: 'application/pdf',
        });

        try {
          await navigator.share({
            title: 'Certificado de Garantia de Higienização',
            text: `Certificado de Garantia de Higienização para ${clientName}`,
            files: [file],
          });
        } catch (shareError) {
          console.error('Error during share after PDF generation:', shareError);
        }
      } else {
        // PDF already exists, share it directly
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const file = new File([blob], `${clientName}-certificado.pdf`, {
          type: 'application/pdf',
        });

        try {
          await navigator.share({
            title: 'Certificado de Garantia de Higienização',
            text: `Certificado de Garantia de Higienização para ${clientName}`,
            files: [file],
          });
        } catch (shareError) {
          console.error('Error during share with existing PDF:', shareError);
        }
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleShare}
      disabled={isGenerating}
      size="sm"
      className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isGenerating ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <Share className="h-4 w-4" />
      )}
      Compartilhar
    </Button>
  );
}

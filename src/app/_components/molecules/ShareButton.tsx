/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Share } from 'lucide-react';
import { Button } from '@components/ui/button';
import { generateCertificatePDF } from '@/app/certificados/[certificateId]/action';
import { Dispatch, SetStateAction, useState } from 'react';

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
  setPdf: (image: Uint8Array) => void;
  pdf: Uint8Array | null;
  isGenerating: boolean;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;
}) {
  const [shareError, setShareError] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      setShareError(null);

      // Ensure we have the image data
      let imageData = pdf;
      if (!imageData) {
        const [data, error] = await generateCertificatePDF({
          certificateId,
        });

        if (error || !data) {
          console.error('Error generating certificate image:', error);
          setIsGenerating(false);
          return;
        }

        imageData = new Uint8Array(data.pdf);
        setPdf(imageData);
      }

      // Create blob with image/png MIME type
      const blob = new Blob([imageData], { type: 'image/png' });

      // Create file with .png extension
      const file = new File([blob], `${clientName}-certificado.png`, {
        type: 'image/png',
        lastModified: new Date().getTime(),
      });

      // Check if navigator.canShare is available and can share files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          // Try to share the image
          await navigator.share({
            files: [file],
            title: 'Certificado de Garantia de Higienização',
            text: `Certificado de Garantia de Higienização para ${clientName}`,
          });
        } catch (shareError: any) {
          console.error('Share failed:', shareError);

          if (shareError.name === 'NotAllowedError') {
            // User canceled - nothing to do
            console.log('User canceled share operation');
          } else {
            throw shareError;
          }
        }
      } else {
        // Fallback for browsers that don't support sharing files
        throw new Error("Your browser doesn't support sharing files directly.");
      }
    } catch (error: any) {
      console.error('Error sharing certificate:', error);
      setShareError(error.message || 'Error sharing certificate');

      // Fallback to download when sharing fails
      if (pdf) {
        const blob = new Blob([pdf], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${clientName}-certificado.png`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        setShareError(
          'Baixamos a imagem para você. Por favor, use-a para compartilhar manualmente.',
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col">
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

      {shareError && (
        <div className="mt-2 text-sm text-red-500">{shareError}</div>
      )}
    </div>
  );
}

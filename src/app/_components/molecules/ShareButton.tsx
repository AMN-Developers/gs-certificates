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
  setPdf: (pdf: Uint8Array) => void;
  pdf: Uint8Array | null;
  isGenerating: boolean;
  setIsGenerating: Dispatch<SetStateAction<boolean>>;
}) {
  const [shareError, setShareError] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      setShareError(null);

      // Ensure we have the PDF data
      let pdfData = pdf;
      if (!pdfData) {
        const [data, error] = await generateCertificatePDF({
          certificateId,
        });

        if (error || !data) {
          console.error('Error generating PDF:', error);
          setIsGenerating(false);
          return;
        }

        pdfData = new Uint8Array(data.pdf);
        setPdf(pdfData);
      }

      // Create blob
      const blob = new Blob([pdfData], { type: 'application/pdf' });

      // OPTIMIZATION: Try creating the file with a more specific MIME type
      // Some research suggests this might help compatibility
      const file = new File([blob], `${clientName}-certificado.pdf`, {
        type: 'application/pdf',
        lastModified: new Date().getTime(),
      });

      // Check if navigator.canShare is available and can share files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          // Try the standard Web Share API with a more limited payload
          // Some apps handle simpler sharing requests better
          await navigator.share({
            files: [file],
          });
        } catch (shareError: any) {
          console.error('Standard share failed:', shareError);

          // Try alternative share method
          if (shareError.name === 'NotAllowedError') {
            // User canceled - nothing to do
            console.log('User canceled share operation');
          } else {
            throw shareError; // Let the catch block handle it
          }
        }
      } else {
        // Fallback for browsers that don't support sharing files
        throw new Error("Your browser doesn't support sharing files directly.");
      }
    } catch (error: any) {
      console.error('Error sharing certificate:', error);
      setShareError(error.message || 'Error sharing certificate');

      // Create a fallback URL for sharing
      if (pdf) {
        const blob = new Blob([pdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${clientName}-certificado.pdf`;
        document.body.appendChild(a);
        a.click();

        // Clean up
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);

        setShareError(
          'Baixamos o PDF para você. Por favor, use-o para compartilhar manualmente.',
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

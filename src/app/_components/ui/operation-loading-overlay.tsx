'use client';

import { Loader2 } from 'lucide-react';

export function OperationLoadingOverlay({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[1px]"
      role="status"
      aria-live="assertive"
      aria-label={title}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <Loader2 className="mx-auto h-9 w-9 animate-spin text-brand" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

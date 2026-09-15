'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (newPassword !== confirmPassword) {
      setError('A confirmação precisa ser igual à nova senha.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await response.text();
      const data = body ? (JSON.parse(body) as { error?: string }) : {};

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível atualizar a senha.');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setNotice('Senha atualizada com sucesso.');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível atualizar a senha.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto max-w-xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm text-slate-600 hover:underline"
      >
        ← Voltar ao dashboard
      </Link>
      <form
        onSubmit={submit}
        className="mt-5 rounded-xl border bg-white p-6 shadow-sm"
      >
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <KeyRound className="h-6 w-6 text-blue-700" />
          Minha senha
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Use uma senha exclusiva, com pelo menos 12 caracteres.
        </p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            Senha atual
            <input
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 h-10 w-full rounded-md border px-3"
            />
          </label>
          <label className="block text-sm font-medium">
            Nova senha
            <input
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              className="mt-2 h-10 w-full rounded-md border px-3"
            />
          </label>
          <label className="block text-sm font-medium">
            Confirmar nova senha
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              className="mt-2 h-10 w-full rounded-md border px-3"
            />
          </label>
        </div>
        {error && (
          <p
            role="alert"
            className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {notice && (
          <p className="mt-4 rounded bg-emerald-50 p-3 text-sm text-emerald-700">
            {notice}
          </p>
        )}
        <button
          disabled={saving}
          className="mt-6 h-10 rounded-md bg-slate-900 px-4 font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Salvando…' : 'Atualizar senha'}
        </button>
      </form>
    </div>
  );
}

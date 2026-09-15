'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck,
} from 'lucide-react';

type Admin = {
  id: number;
  username: string;
  role: 'owner' | 'admin';
  active: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

async function readResponse(response: Response) {
  const body = await response.text();
  const data = body ? (JSON.parse(body) as { error?: string }) : {};

  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível concluir a operação.');
  }

  return data;
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetPassword, setResetPassword] = useState<Record<number, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = (await readResponse(response)) as { items: Admin[] };
      setAdmins(data.items);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível carregar os administradores.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await readResponse(
        await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }),
      );
      setUsername('');
      setPassword('');
      setNotice(
        'Administrador criado. Oriente a pessoa a trocar a senha no primeiro acesso.',
      );
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível criar o administrador.',
      );
    } finally {
      setSaving(false);
    }
  }

  async function update(
    id: number,
    action: 'reset_password' | 'set_active',
    payload: Record<string, unknown>,
  ) {
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await readResponse(
        await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, action, ...payload }),
        }),
      );
      setResetPassword((current) => ({ ...current, [id]: '' }));
      setNotice('Alteração salva com sucesso.');
      await load();
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível salvar a alteração.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/dashboard"
        className="text-sm text-slate-600 hover:underline"
      >
        ← Voltar ao dashboard
      </Link>
      <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
          <p className="mt-1 text-slate-600">
            Crie acessos separados, redefina senhas e desative contas sem tocar
            nos usuários clientes.
          </p>
        </div>
        <Link
          href="/dashboard/account"
          className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold"
        >
          <KeyRound className="h-4 w-4" />
          Minha senha
        </Link>
      </div>

      <form
        onSubmit={create}
        className="mt-7 rounded-xl border bg-white p-5 shadow-sm"
      >
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Plus className="h-5 w-5 text-emerald-700" />
          Criar administrador
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value.toLowerCase())}
            placeholder="Usuário, ex.: financeiro.gs"
            minLength={3}
            maxLength={80}
            pattern="[a-z0-9._-]+"
            required
            className="h-10 rounded-md border px-3"
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Senha temporária (mínimo 12)"
            type="password"
            minLength={12}
            maxLength={256}
            required
            className="h-10 rounded-md border px-3"
          />
          <button
            disabled={saving}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 font-semibold text-white disabled:opacity-60"
          >
            <UserRoundCheck className="h-4 w-4" />
            Criar acesso
          </button>
        </div>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {notice}
        </p>
      )}

      <section className="mt-6 overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="h-5 w-5 text-blue-700" />
            Acessos cadastrados
          </h2>
          <button
            onClick={() => void load()}
            disabled={loading}
            className="rounded border p-2"
            title="Atualizar lista"
          >
            <RefreshCw
              className={'h-4 w-4 ' + (loading ? 'animate-spin' : '')}
            />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-4">Usuário</th>
                <th className="p-4">Perfil</th>
                <th className="p-4">Status</th>
                <th className="p-4">Último acesso</th>
                <th className="p-4">Redefinir senha</th>
                <th className="p-4">Ação</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-t">
                  <td className="p-4 font-medium">{admin.username}</td>
                  <td className="p-4">
                    {admin.role === 'owner' ? 'Proprietário' : 'Administrador'}
                  </td>
                  <td className="p-4">
                    {admin.active ? 'Ativo' : 'Desativado'}
                  </td>
                  <td className="p-4">
                    {admin.lastLoginAt
                      ? new Date(admin.lastLoginAt).toLocaleString('pt-BR')
                      : 'Nunca'}
                  </td>
                  <td className="p-4">
                    {admin.role === 'owner' ? (
                      'Use Minha senha'
                    ) : (
                      <div className="flex gap-2">
                        <input
                          value={resetPassword[admin.id] || ''}
                          onChange={(event) =>
                            setResetPassword((current) => ({
                              ...current,
                              [admin.id]: event.target.value,
                            }))
                          }
                          placeholder="Nova temporária"
                          type="password"
                          minLength={12}
                          className="h-9 rounded border px-2"
                        />
                        <button
                          disabled={
                            saving ||
                            (resetPassword[admin.id] || '').length < 12
                          }
                          onClick={() =>
                            void update(admin.id, 'reset_password', {
                              password: resetPassword[admin.id],
                            })
                          }
                          className="rounded border px-3 disabled:opacity-50"
                        >
                          Redefinir
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {admin.role === 'owner' ? (
                      'Protegido'
                    ) : (
                      <button
                        disabled={saving}
                        onClick={() =>
                          void update(admin.id, 'set_active', {
                            active: !admin.active,
                          })
                        }
                        className="rounded border px-3 py-2 disabled:opacity-50"
                      >
                        {admin.active ? 'Desativar' : 'Ativar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && admins.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Nenhum administrador encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

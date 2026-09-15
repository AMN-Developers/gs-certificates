'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

type LogItem = {
  id: number;
  level: string;
  category: string;
  event: string;
  correlationId: string;
  actorType: string;
  actorId: number | null;
  actorLabel: string | null;
  resourceType: string | null;
  resourceId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
};

const categoryLabels: Record<string, string> = {
  authentication: 'Acessos administrativos',
  credits: 'Créditos de certificados',
  operational: 'Eventos operacionais',
};

export default function LogsPage() {
  const [items, setItems] = useState<LogItem[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [level, setLevel] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (level) params.set('level', level);
      if (category) params.set('category', category);
      if (appliedQuery) params.set('query', appliedQuery);
      const response = await fetch('/api/admin/logs?' + params.toString(), { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setItems(data.items);
      setPages(data.pages);
      setTotal(data.total);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível carregar os logs.');
    } finally {
      setLoading(false);
    }
  }, [page, level, category, appliedQuery]);

  useEffect(() => { void load(); }, [load]);

  function search(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setAppliedQuery(query.trim());
  }

  function levelClass(value: string) {
    if (value === 'error') return 'bg-red-100 text-red-800';
    if (value === 'warning') return 'bg-amber-100 text-amber-800';
    return 'bg-blue-100 text-blue-800';
  }

  function actorLabel(item: LogItem) {
    if (item.actorLabel) return item.actorLabel;
    return item.actorId ? item.actorType + ' #' + item.actorId : item.actorType;
  }

  return (
    <main className="container mx-auto space-y-6 px-4 py-8">
      <div>
        <Link href="/dashboard" className="text-sm text-slate-600 underline">← Voltar ao dashboard</Link>
        <h1 className="mt-4 text-3xl font-bold">Logs do sistema</h1>
        <p className="mt-2 text-sm text-slate-600">Auditoria administrativa e eventos relevantes. Senhas, tokens e dados sensíveis não são armazenados nos registros.</p>
      </div>

      <form onSubmit={search} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-[1fr_180px_220px_auto]">
        <input className="rounded-lg border px-3 py-2 text-sm" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Evento, recurso, código do cliente ou usuário" />
        <select className="rounded-lg border px-3 py-2 text-sm" value={level} onChange={(event) => { setLevel(event.target.value); setPage(1); }}>
          <option value="">Todos os níveis</option>
          <option value="info">Informação</option>
          <option value="warning">Aviso</option>
          <option value="error">Erro</option>
        </select>
        <select className="rounded-lg border px-3 py-2 text-sm" value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }}>
          <option value="">Todas as categorias</option>
          <option value="authentication">Acessos administrativos</option>
          <option value="credits">Créditos de certificados</option>
          <option value="operational">Eventos operacionais</option>
        </select>
        <button className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Filtrar</button>
      </form>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3 text-sm text-slate-600">{total.toLocaleString('pt-BR')} evento(s)</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-600"><tr><th className="p-4">Data</th><th className="p-4">Nível</th><th className="p-4">Categoria</th><th className="p-4">Evento</th><th className="p-4">Responsável</th><th className="p-4">Recurso</th><th className="p-4">Detalhes</th></tr></thead>
            <tbody className="divide-y">
              {!loading && items.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-500">Nenhum evento encontrado.</td></tr>}
              {items.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="whitespace-nowrap p-4">{new Date(item.createdAt).toLocaleString('pt-BR')}</td>
                  <td className="p-4"><span className={'rounded-full px-2 py-1 text-xs font-semibold ' + levelClass(item.level)}>{item.level}</span></td>
                  <td className="p-4 text-slate-600">{categoryLabels[item.category] ?? item.category}</td>
                  <td className="p-4 font-medium">{item.event}<div className="mt-1 font-mono text-[10px] text-slate-400">{item.correlationId}</div></td>
                  <td className="p-4">{actorLabel(item)}</td>
                  <td className="p-4">{item.resourceType || '—'}{item.resourceId ? <div className="max-w-48 truncate text-xs text-slate-500">{item.resourceId}</div> : null}</td>
                  <td className="max-w-sm p-4"><details><summary className="cursor-pointer text-slate-700">Visualizar</summary><pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify(item.details || {}, null, 2)}</pre></details></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t p-4 text-sm"><button className="rounded border px-3 py-2 disabled:opacity-40" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}>Anterior</button><span>Página {page} de {pages}</span><button className="rounded border px-3 py-2 disabled:opacity-40" disabled={page >= pages || loading} onClick={() => setPage((value) => value + 1)}>Próxima</button></div>
      </section>
    </main>
  );
}

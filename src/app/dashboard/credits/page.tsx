'use client';

import { FormEvent, useState } from 'react';
import { Loader2, Search } from 'lucide-react';

type Balance = { type: 'higienizacao' | 'impermeabilizacao'; balance: number };
type Adjustment = {
  id: number;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  adminActor: string;
  createdAt: string;
};

const typeLabels = {
  higienizacao: 'Higienização',
  impermeabilizacao: 'Impermeabilização',
};

export default function CreditsPage() {
  const [userId, setUserId] = useState('');
  const [balances, setBalances] = useState<Balance[]>([]);
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [type, setType] = useState<Balance['type']>('higienizacao');
  const [operation, setOperation] = useState<'add' | 'remove'>('add');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadBalances(event?: FormEvent) {
    event?.preventDefault();
    setMessage('');
    setBalances([]);
    setAdjustments([]);
    const parsedUserId = Number(userId);
    if (!Number.isInteger(parsedUserId) || parsedUserId <= 0) {
      setMessage('Informe um código de cliente válido.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/credits?userId=${parsedUserId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setBalances(data.balances);
      setAdjustments(data.adjustments);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível consultar o cliente.');
    } finally {
      setLoading(false);
    }
  }

  async function saveAdjustment(event: FormEvent) {
    event.preventDefault();
    const parsedUserId = Number(userId);
    const parsedAmount = Number(amount);
    if (!Number.isInteger(parsedUserId) || !Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      setMessage('Informe um cliente e uma quantidade inteira maior que zero.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: parsedUserId, type, operation, amount: parsedAmount, reason }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setAmount('');
      setReason('');
      setMessage('Créditos ajustados e registrados no histórico.');
      await loadBalances();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível salvar o ajuste.');
    } finally {
      setSaving(false);
    }
  }

  const balanceFor = (certificateType: Balance['type']) =>
    balances.find((item) => item.type === certificateType)?.balance ?? 0;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Créditos de certificados</h1>
        <p className="mt-2 text-sm text-slate-600">Consulte saldos, acrescente ou remova créditos com registro do motivo de cada alteração.</p>
      </div>

      <form onSubmit={loadBalances} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="block max-w-md text-sm font-medium">Código do cliente
          <div className="mt-2 flex gap-2">
            <input value={userId} onChange={(event) => setUserId(event.target.value)} inputMode="numeric" className="h-10 w-full rounded-md border border-slate-300 px-3" placeholder="Ex.: 540695" />
            <button disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-60"><Search className="h-4 w-4" />{loading ? 'Consultando…' : 'Consultar'}</button>
          </div>
        </label>
      </form>

      {message && <p role="status" className="mt-4 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p>}

      {balances.length > 0 && <>
        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {(Object.keys(typeLabels) as Balance['type'][]).map((item) => <div key={item} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm text-slate-500">{typeLabels[item]}</p><p className="mt-2 text-3xl font-bold">{balanceFor(item)}</p><p className="text-sm text-slate-500">créditos disponíveis</p></div>)}
        </section>

        <form onSubmit={saveAdjustment} className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold">Registrar ajuste</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <label className="text-sm font-medium">Tipo<select value={type} onChange={(event) => setType(event.target.value as Balance['type'])} className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3"><option value="higienizacao">Higienização</option><option value="impermeabilizacao">Impermeabilização</option></select></label>
            <label className="text-sm font-medium">Operação<select value={operation} onChange={(event) => setOperation(event.target.value as 'add' | 'remove')} className="mt-2 h-10 w-full rounded-md border border-slate-300 bg-white px-3"><option value="add">Acrescentar</option><option value="remove">Retirar</option></select></label>
            <label className="text-sm font-medium">Quantidade<input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="1" step="1" className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3" placeholder="Ex.: 30" /></label>
            <label className="text-sm font-medium">Motivo<input value={reason} onChange={(event) => setReason(event.target.value)} maxLength={300} className="mt-2 h-10 w-full rounded-md border border-slate-300 px-3" placeholder="Ex.: Solicitação comercial #123" /></label>
          </div>
          <button disabled={saving || !reason.trim()} className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? 'Salvando…' : 'Confirmar ajuste'}</button>
          <p className="mt-3 text-xs text-slate-500">A quantidade deve ser positiva. A operação escolhida define se os créditos serão acrescentados ou retirados; o saldo nunca pode ficar abaixo de zero.</p>
        </form>

        <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 p-5"><h2 className="text-lg font-semibold">Histórico do cliente</h2></div>
          {adjustments.length === 0 ? <p className="p-5 text-sm text-slate-500">Nenhum ajuste administrativo registrado.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Data</th><th className="px-5 py-3">Tipo</th><th className="px-5 py-3">Ajuste</th><th className="px-5 py-3">Saldo</th><th className="px-5 py-3">Motivo</th></tr></thead><tbody>{adjustments.map((item) => <tr key={item.id} className="border-t border-slate-100"><td className="px-5 py-3">{new Date(item.createdAt).toLocaleString('pt-BR')}</td><td className="px-5 py-3">{typeLabels[item.type as Balance['type']] ?? item.type}</td><td className={`px-5 py-3 font-semibold ${item.amount > 0 ? 'text-emerald-700' : 'text-red-700'}`}>{item.amount > 0 ? '+' : ''}{item.amount}</td><td className="px-5 py-3">{item.balanceBefore} → {item.balanceAfter}</td><td className="px-5 py-3">{item.reason}</td></tr>)}</tbody></table></div>}
        </section>
      </>}
    </div>
  );
}

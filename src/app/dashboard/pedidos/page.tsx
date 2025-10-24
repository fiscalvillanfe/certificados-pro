'use client';

import { useEffect, useMemo, useState } from 'react';

type Pedido = {
  id: string;
  tipo: string;
  documento: string; // CPF/CNPJ formatado
  nomeEmpresa?: string | null;
  representanteLegal?: string | null;
  valorTotal: number;
  valorRecebido: number;
  createdAt: string; // ISO
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const r = await fetch('/api/pedidos/list', { cache: 'no-store' });
        const data = await r.json();
        if (!alive) return;
        setPedidos(Array.isArray(data?.pedidos) ? data.pedidos : []);
      } catch {
        if (!alive) return;
        setPedidos([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  const total = pedidos.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = useMemo(() => pedidos.slice(start, start + pageSize), [pedidos, start, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pedidos</h1>

        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-400">Por página:</label>
          <select
            className="input"
            value={pageSize}
            onChange={(e) => setPageSize(Math.min(200, Math.max(1, Number(e.target.value) || 20)))}
          >
            {[10, 20, 50, 100, 200].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="py-10 text-center text-neutral-400">Carregando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-400">
              <tr>
                <th className="py-2 pr-3">Tipo</th>
                <th className="py-2 pr-3">Documento</th>
                <th className="py-2 pr-3">Empresa</th>
                <th className="py-2 pr-3">Resp. Legal</th>
                <th className="py-2 pr-3">Total</th>
                <th className="py-2 pr-3">Recebido</th>
                <th className="py-2 pr-3">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(p => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="py-2 pr-3">{p.tipo}</td>
                  <td className="py-2 pr-3">{p.documento}</td>
                  <td className="py-2 pr-3">{p.nomeEmpresa ?? '-'}</td>
                  <td className="py-2 pr-3">{p.representanteLegal ?? '-'}</td>
                  <td className="py-2 pr-3">R$ {p.valorTotal.toFixed(2)}</td>
                  <td className="py-2 pr-3">R$ {p.valorRecebido.toFixed(2)}</td>
                  <td className="py-2 pr-3">{new Date(p.createdAt).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td className="py-6 text-center text-neutral-400" colSpan={7}>Nenhum pedido.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-400">
            {total} registros • página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button className="btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Anterior</button>
            <button className="btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Próxima</button>
          </div>
        </div>
      )}
    </div>
  );
}

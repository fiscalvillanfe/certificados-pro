'use client';

import { useEffect, useState } from 'react';

type Resumo = { vendidos: number; recebidos: number; };

export default function RelatoriosPage() {
  const [resumo, setResumo] = useState<Resumo>({ vendidos: 0, recebidos: 0 });
  const [showGraficos, setShowGraficos] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const r = await fetch('/api/relatorios/resumo', { cache: 'no-store' });
        const data = await r.json();
        if (!alive) return;
        setResumo({
          vendidos: Number(data?.vendidos || 0),
          recebidos: Number(data?.recebidos || 0),
        });
      } catch {
        if (!alive) return;
        setResumo({ vendidos: 0, recebidos: 0 });
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Relatórios</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="text-sm text-neutral-400">Certificados vendidos</div>
          <div className="text-2xl font-semibold mt-1">
            {loading ? '...' : `R$ ${resumo.vendidos.toFixed(2)}`}
          </div>
        </div>
        <div className="card">
          <div className="text-sm text-neutral-400">Recebido (lucro)</div>
          <div className="text-2xl font-semibold mt-1">
            {loading ? '...' : `R$ ${resumo.recebidos.toFixed(2)}`}
          </div>
        </div>
      </div>

      <button className="btn" onClick={() => setShowGraficos(true)}>Ver gráficos</button>

      {showGraficos && (
        <div className="card">
          <p className="text-neutral-400 text-sm">
            Gráficos mensais/semanais/diários serão renderizados aqui. Placeholder temporário.
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import MiniCalendar from '../../../components/MiniCalendar';
import { Calendar, ChevronDown, LineChart, Loader2 } from 'lucide-react';
import { addNotif } from '../../../components/notifyStore';
import { useSearchParams } from 'next/navigation';
import SimpleLineChart, { Point } from '../../../components/SimpleLineChart';
import Modal from '../../../components/Modal';

// Tipos básicos do mock
type Pedido = {
  id: string;
  tipo: string;
  isA3: boolean;
  isCNPJ: boolean;
  cpfCnpj: string;
  nomePessoa?: string;
  curador?: string | null;
  nomeEmpresa?: string;
  representanteLegal?: string;
  tokenOpcao?: 'com-token' | 'sem-token' | null;
  valorTotal: number;
  valorRecebido: number;
  responsavel: 'FRANK GIOVANNI LOPES' | 'MATHEUS CARDOSO SOARES';
  createdAt: string;
};

const LS_KEY = 'pedidos_v1';
function formatDate(v: Date) { return v.toISOString().slice(0, 10); }
function parseYMD(s: string) { const [y, m, d] = s.split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); }
function money(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }

type Periodo = 'diario' | 'semanal' | 'mensal' | 'anual';

export default function RelatoriosPage() {
  const hoje = new Date();
  const [inicio, setInicio] = useState(formatDate(new Date(hoje.getFullYear(), hoje.getMonth(), 1)));
  const [fim, setFim] = useState(formatDate(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)));
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [openInicio, setOpenInicio] = useState(false);
  const [openFim, setOpenFim] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [periodo, setPeriodo] = useState<Periodo>('mensal');

  // modal de geração
  const [genOpen, setGenOpen] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [genDataUrl, setGenDataUrl] = useState<string | null>(null);
  const [genTipo, setGenTipo] = useState<'pdf' | 'excel'>('pdf');

  const wrapInicioRef = useRef<HTMLDivElement>(null);
  const wrapFimRef = useRef<HTMLDivElement>(null);
  const search = useSearchParams();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setPedidos(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    const si = search.get('inicio');
    const sf = search.get('fim');
    if (si) setInicio(si);
    if (sf) setFim(sf);
  }, [search]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (openInicio && wrapInicioRef.current && !wrapInicioRef.current.contains(e.target as Node)) setOpenInicio(false);
      if (openFim && wrapFimRef.current && !wrapFimRef.current.contains(e.target as Node)) setOpenFim(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [openInicio, openFim]);

  const pedidosPeriodo = useMemo(() => {
    const i = parseYMD(inicio); const f = parseYMD(fim); f.setHours(23, 59, 59, 999);
    return pedidos.filter((p) => { const d = new Date(p.createdAt); return d >= i && d <= f; });
  }, [pedidos, inicio, fim]);

  const totalVendido = useMemo(() => pedidosPeriodo.reduce((acc, p) => acc + (p.valorTotal || 0), 0), [pedidosPeriodo]);
  const totalRecebido = useMemo(() => pedidosPeriodo.reduce((acc, p) => acc + (p.valorRecebido || 0), 0), [pedidosPeriodo]);

  // Agregação para o gráfico (vendas = valorRecebido por período)
  const points: Point[] = useMemo(() => {
    const map = new Map<number, number>(); // key = bucket, val = soma
    const dayMs = 24 * 3600 * 1000;
    for (const p of pedidosPeriodo) {
      const d = new Date(p.createdAt);
      let key: number;
      if (periodo === 'diario') {
        key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      } else if (periodo === 'semanal') {
        const base = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dow = base.getDay(); // 0..6
        const start = new Date(base.getTime() - dow * dayMs);
        key = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
      } else if (periodo === 'mensal') {
        key = new Date(d.getFullYear(), d.getMonth(), 1).getTime();
      } else {
        key = new Date(d.getFullYear(), 0, 1).getTime();
      }
      map.set(key, (map.get(key) || 0) + (p.valorRecebido || 0));
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([x, y]) => ({ x, y }));
  }, [pedidosPeriodo, periodo]);

  function setMesAtual() {
    const h = new Date();
    setInicio(formatDate(new Date(h.getFullYear(), h.getMonth(), 1)));
    setFim(formatDate(new Date(h.getFullYear(), h.getMonth() + 1, 0)));
  }
  function setUltimos30() {
    const h = new Date(); const i = new Date(h); i.setDate(i.getDate() - 30);
    setInicio(formatDate(i)); setFim(formatDate(h));
  }

  function abrirGerar(tipo: 'pdf' | 'excel') {
    setGenTipo(tipo);
    setGenOpen(true);
    setGenLoading(false);
    setGenDataUrl(null);
  }

  function startGerar() {
    setGenLoading(true);
    // Simula geração
    setTimeout(() => {
      const resumo = { tipo: genTipo, inicio, fim, totalVendido, totalRecebido, geradoEm: new Date().toISOString() };
      const dataUrl = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(resumo, null, 2))));
      setGenDataUrl(dataUrl);
      setGenLoading(false);

      // Cria notificação também
      addNotif({
        type: 'relatorio:gerado',
        actor: 'MATHEUS CARDOSO SOARES',
        payload: { inicio, fim, formato: genTipo, downloadDataUrl: dataUrl },
      });
    }, 1200);
  }

  const periodoLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(parseYMD(inicio));

  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold">Relatórios</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="text-sm text-neutral-400">Certificados vendidos</div><div className="text-2xl font-semibold mt-1">{money(totalVendido)}</div></div>
        <div className="card"><div className="text-sm text-neutral-400">Valor recebido</div><div className="text-2xl font-semibold mt-1">{money(totalRecebido)}</div></div>
        <div className="card"><div className="text-sm text-neutral-400">Pedidos no período</div><div className="text-2xl font-semibold mt-1">{pedidosPeriodo.length}</div></div>
      </div>

      {/* Filtros + período */}
      <div className="card grid md:grid-cols-2 gap-4 relative">
        <div ref={wrapInicioRef} className="relative">
          <label className="block text-sm mb-1">Início</label>
          <button type="button" className="input w-full flex items-center justify-between" onClick={() => setOpenInicio(v => !v)}>
            <span>{inicio}</span><span className="flex items-center gap-1 text-neutral-400"><Calendar size={16} /><ChevronDown size={16} /></span>
          </button>
          {openInicio && <div className="absolute z-20 mt-2"><MiniCalendar value={inicio} onChange={(v: string) => setInicio(v)} max={fim} onClose={() => setOpenInicio(false)} /></div>}
        </div>

        <div ref={wrapFimRef} className="relative">
          <label className="block text-sm mb-1">Fim</label>
          <button type="button" className="input w-full flex items-center justify-between" onClick={() => setOpenFim(v => !v)}>
            <span>{fim}</span><span className="flex items-center gap-1 text-neutral-400"><Calendar size={16} /><ChevronDown size={16} /></span>
          </button>
          {openFim && <div className="absolute z-20 mt-2"><MiniCalendar value={fim} onChange={(v: string) => setFim(v)} min={inicio} onClose={() => setOpenFim(false)} /></div>}
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-2">
          <button onClick={setMesAtual} className="btn w-auto">Mês atual</button>
          <button onClick={setUltimos30} className="btn w-auto">Últimos 30 dias</button>
          <button onClick={() => setShowCharts(v => !v)} className="btn w-auto flex items-center gap-2">
            <LineChart size={16} /> {showCharts ? 'Ocultar gráficos' : 'Ver gráficos'}
          </button>
          {showCharts && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-neutral-400">Período:</span>
              <select className="input w-auto" value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)}>
                <option value="diario">Diário</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="anual">Anual</option>
              </select>
            </div>
          )}
        </div>

        <div className="md:col-span-2 text-sm text-neutral-400">Período: <span className="text-neutral-200 font-medium">{periodoLabel}</span></div>
      </div>

      {showCharts && (
        <div className="card">
          <div className="text-sm text-neutral-400 mb-2">Vendas (valor recebido) por {periodo}</div>
          <SimpleLineChart points={points} />
        </div>
      )}

      <div className="card flex items-center justify-end gap-3">
        <button onClick={() => abrirGerar('pdf')} className="btn w-auto">Gerar PDF</button>
        <button onClick={() => abrirGerar('excel')} className="btn w-auto">Gerar Excel</button>
      </div>

      {/* Modal de geração */}
      <Modal
        open={genOpen}
        onClose={() => setGenOpen(false)}
        title={`Gerar relatório (${genTipo.toUpperCase()})`}
        size="sm"
        footer={
          genLoading ? null : (
            <div className="flex justify-end gap-2">
              {!genDataUrl ? (
                <button className="btn w-auto" onClick={startGerar}>Iniciar geração</button>
              ) : (
                <>
                  <a className="btn w-auto" href={genDataUrl} download={`relatorio_${inicio}_${fim}.${genTipo === 'excel' ? 'xlsx' : 'pdf'}`}>Baixar</a>
                  <button className="btn w-auto bg-neutral-700 hover:bg-neutral-600" onClick={() => setGenOpen(false)}>Fechar</button>
                </>
              )}
            </div>
          )
        }
      >
        {genLoading ? (
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="animate-spin" size={16} /> Gerando relatório, aguarde...
          </div>
        ) : !genDataUrl ? (
          <div className="text-sm text-neutral-300">Clique em <b>Iniciar geração</b> para processar o relatório do período <b>{inicio}</b> a <b>{fim}</b>. Quando concluir, o botão de download aparecerá aqui.</div>
        ) : (
          <div className="text-sm text-neutral-300">Relatório pronto! Baixe agora ou feche esta janela. Uma cópia também foi registrada nas notificações.</div>
        )}
      </Modal>
    </div>
  );
}

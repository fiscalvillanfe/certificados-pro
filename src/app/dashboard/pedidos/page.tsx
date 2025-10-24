'use client';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

// src/app/dashboard/pedidos/page.tsx
import { useEffect, useMemo, useState } from 'react';
import { Edit2, Plus, Save, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { addNotif } from '../../../components/notifyStore';
import Modal from '../../../components/Modal';

type Responsavel = 'FRANK GIOVANNI LOPES' | 'MATHEUS CARDOSO SOARES';
const TIPOS = [
  'e-CPF A1 (1 ANO)',
  'e-CPF A3 (1 ANO)',
  'e-CPF A3 (3 ANOS)',
  'e-CPF A1 (2 ANOS)',
  'e-CNPJ A1 (1 ano)',
  'e-CNPJ A3 (3 anos)',
  'e-CNPJ A3 (1 ano)',
  'e-CNPJ A3 (2 ANOS)',
] as const;
type TipoProduto = typeof TIPOS[number];
type TokenOpcao = 'com-token' | 'sem-token';

type Pedido = {
  id: string;
  tipo: TipoProduto;
  isA3: boolean;
  isCNPJ: boolean;
  cpfCnpj: string;
  nomePessoa?: string | null;
  curador?: string | null;
  nomeEmpresa?: string | null;
  representanteLegal?: string | null;
  tokenOpcao?: TokenOpcao | null;
  valorTotal: number;
  valorRecebido: number;
  responsavel: Responsavel;
  createdAt: string;
};

function onlyDigits(s: string) { return (s || '').replace(/\D/g, ''); }
function formatCPF(cpf: string) {
  const d = onlyDigits(cpf).slice(0, 11);
  if (d.length <= 9) return d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_m, a, b, c) => [a, b, c].filter(Boolean).join('.'));
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_m, a, b, c, d2) => (d2 ? `${a}.${b}.${c}-${d2}` : `${a}.${b}.${c}`));
}
function formatCNPJ(cnpj: string) {
  const d = onlyDigits(cnpj).slice(0, 14);
  return d.replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}
function maskCpfCnpj(v: string, isCNPJ: boolean) {
  const d = onlyDigits(v);
  return isCNPJ ? formatCNPJ(d) : formatCPF(d);
}
function numberToMoney(n: number) { return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); }
function moneyToNumber(v: string) {
  if (!v) return 0;
  const n = Number(v.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
}
function tipoIsA3(tipo: TipoProduto) { return tipo.includes('A3'); }
function tipoIsCNPJ(tipo: TipoProduto) { return tipo.startsWith('e-CNPJ'); }

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/pedidos', { cache: 'no-store' });
      const data = await res.json();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setPedidos([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const search = useSearchParams();
  const focusId = search.get('focus') || '';
  const [hiId, setHiId] = useState<string>('');
  useEffect(() => {
    if (focusId) {
      setHiId(focusId);
      const t = setTimeout(() => setHiId(''), 3000);
      return () => clearTimeout(t);
    }
  }, [focusId]);

  const [pageSize, setPageSize] = useState<number>(20);
  const [page, setPage] = useState<number>(1);
  useEffect(() => { setPage(1); }, [pageSize, pedidos.length]);

  const safeList = Array.isArray(pedidos) ? pedidos : [];
  const pages = Math.max(1, Math.ceil(safeList.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return safeList.slice(start, start + pageSize);
  }, [safeList, page, pageSize]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [tipo, setTipo] = useState<TipoProduto>('e-CPF A1 (1 ANO)');
  const isA3 = useMemo(() => tipoIsA3(tipo), [tipo]);
  const isCNPJ = useMemo(() => tipoIsCNPJ(tipo), [tipo]);
  const [token, setToken] = useState<TokenOpcao>('com-token');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [nomePessoa, setNomePessoa] = useState('');
  const [curador, setCurador] = useState('');
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [representanteLegal, setRepresentanteLegal] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [valorRecebido, setValorRecebido] = useState('');
  const [responsavel, setResponsavel] = useState<Responsavel>('FRANK GIOVANNI LOPES');
  const [msg, setMsg] = useState('');

  function resetForm() {
    setTipo('e-CPF A1 (1 ANO)');
    setCpfCnpj('');
    setNomePessoa(''); setCurador('');
    setNomeEmpresa(''); setRepresentanteLegal('');
    setToken('com-token');
    setValorTotal(''); setValorRecebido('');
    setResponsavel('FRANK GIOVANNI LOPES');
    setMsg('');
  }

  function validar(): string | null {
    if (!cpfCnpj) return 'Informe CPF ou CNPJ.';
    if (isCNPJ) {
      if (!nomeEmpresa.trim()) return 'Informe o nome da empresa.';
      if (!representanteLegal.trim()) return 'Informe o representante legal.';
    } else {
      if (!nomePessoa.trim()) return 'Informe o nome da pessoa.';
    }
    return null;
  }

  function abrirCriar() {
    resetForm();
    setCreateOpen(true);
  }

  async function salvarNovo() {
    const erro = validar();
    if (erro) { setMsg(erro); return; }

    const body = {
      tipo,
      isA3,
      isCnpj: isCNPJ,
      cpfCnpj: onlyDigits(cpfCnpj),
      nomePessoa: isCNPJ ? null : nomePessoa.trim(),
      curador: isCNPJ ? null : (curador.trim() || null),
      nomeEmpresa: isCNPJ ? nomeEmpresa.trim() : null,
      representanteLegal: isCNPJ ? representanteLegal.trim() : null,
      tokenOpcao: isA3 ? token : null,
      valorTotal: moneyToNumber(valorTotal),
      valorRecebido: moneyToNumber(valorRecebido),
      responsavel,
    };

    const res = await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const r = await res.json().catch(() => ({}));
      alert(r.error || 'Erro ao criar pedido');
      return;
    }
    const created: Pedido = await res.json();
    setCreateOpen(false);
    await load();

    const docFmt = isCNPJ ? formatCNPJ(body.cpfCnpj) : formatCPF(body.cpfCnpj);
    addNotif({ type: 'pedido:create', actor: responsavel, payload: { pedidoId: created.id, pedidoTipo: created.tipo, doc: docFmt } });
  }

  function fillFormFrom(p: Pedido) {
    setTipo(p.tipo);
    setCpfCnpj(p.cpfCnpj);
    setNomePessoa(p.nomePessoa || '');
    setCurador(p.curador || '');
    setNomeEmpresa(p.nomeEmpresa || '');
    setRepresentanteLegal(p.representanteLegal || '');
    setToken((p.tokenOpcao || 'com-token') as TokenOpcao);
    setValorTotal(String(p.valorTotal).replace('.', ','));
    setValorRecebido(String(p.valorRecebido).replace('.', ','));
    setResponsavel(p.responsavel);
    setMsg('');
  }

  function abrirEditar(p: Pedido) {
    setEditId(p.id);
    fillFormFrom(p);
    setEditOpen(true);
  }

  async function salvarEdicao() {
    if (!editId) return;
    const erro = validar();
    if (erro) { setMsg(erro); return; }

    const body = {
      tipo,
      isA3,
      isCnpj: isCNPJ,
      cpfCnpj: onlyDigits(cpfCnpj),
      nomePessoa: isCNPJ ? null : nomePessoa.trim(),
      curador: isCNPJ ? null : (curador.trim() || null),
      nomeEmpresa: isCNPJ ? nomeEmpresa.trim() : null,
      representanteLegal: isCNPJ ? representanteLegal.trim() : null,
      tokenOpcao: isA3 ? token : null,
      valorTotal: moneyToNumber(valorTotal),
      valorRecebido: moneyToNumber(valorRecebido),
      responsavel,
    };

    const res = await fetch(`/api/pedidos/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const r = await res.json().catch(() => ({}));
      alert(r.error || 'Erro ao atualizar pedido');
      return;
    }
    setEditOpen(false);
    await load();
  }

  async function removePedido(id: string) {
    const p = safeList.find(x => x.id === id);
    const res = await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const r = await res.json().catch(() => ({}));
      alert(r.error || 'Erro ao excluir pedido');
      return;
    }
    await load();
    if (p) {
      const docFmt = p.isCNPJ ? formatCNPJ(p.cpfCnpj) : formatCPF(p.cpfCnpj);
      addNotif({ type: 'pedido:delete', actor: 'FRANK GIOVANNI LOPES', payload: { doc: docFmt } });
    }
  }

  function FormPedido() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Tipo do certificado</label>
          <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value as TipoProduto)}>
            {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Responsável pelo pedido</label>
          <select className="input" value={responsavel} onChange={(e) => setResponsavel(e.target.value as Responsavel)}>
            <option>FRANK GIOVANNI LOPES</option>
            <option>MATHEUS CARDOSO SOARES</option>
          </select>
        </div>

        {isA3 && (
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Token</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="token" checked={token === 'com-token'} onChange={() => setToken('com-token')} />
                <span>Com token</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="token" checked={token === 'sem-token'} onChange={() => setToken('sem-token')} />
                <span>Sem token</span>
              </label>
            </div>
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">{isCNPJ ? 'CNPJ' : 'CPF'}</label>
          <input
            className="input"
            placeholder={isCNPJ ? '00.000.000/0000-00' : '000.000.000-00'}
            value={maskCpfCnpj(cpfCnpj, isCNPJ)}
            onChange={(e) => setCpfCnpj(onlyDigits(e.target.value))}
            inputMode="numeric"
            autoComplete="off"
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
          />
        </div>

        {isCNPJ ? (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Nome da empresa</label>
              <input className="input" value={nomeEmpresa} onChange={(e) => setNomeEmpresa(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Representante legal</label>
              <input className="input" value={representanteLegal} onChange={(e) => setRepresentanteLegal(e.target.value)} />
            </div>
          </>
        ) : (
          <>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Nome da pessoa</label>
              <input className="input" value={nomePessoa} onChange={(e) => setNomePessoa(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Curador (opcional)</label>
              <input className="input" placeholder="Se não houver, deixe em branco" value={curador} onChange={(e) => setCurador(e.target.value)} />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm mb-1">Valor total</label>
          <input
            className="input"
            placeholder="R$ 0,00"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Valor recebido</label>
          <input
            className="input"
            placeholder="R$ 0,00"
            value={valorRecebido}
            onChange={(e) => setValorRecebido(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm mb-1">Data de criação</label>
          <input className="input" disabled value={new Date().toLocaleString('pt-BR')} />
        </div>

        {msg && <div className="md:col-span-2 text-sm text-red-400">{msg}</div>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <button type="button" onClick={abrirCriar} className="btn w-auto flex itemsente gap-2"><Plus size={16} /> Novo pedido</button>
      </div>

      <div className="card flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-400">Itens por página</span>
          <select className="input w-auto" value={pageSize} onChange={(e) => setPageSize(Math.min(200, Math.max(1, Number(e.target.value))))}>
            {[10, 20, 50, 100, 200].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="btn w-auto" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Anterior</button>
          <div className="text-sm">Página {page} de {pages}</div>
          <button type="button" className="btn w-auto" disabled={page >= pages} onClick={() => setPage(p => Math.min(pages, p + 1))}>Próxima</button>
        </div>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="text-neutral-400">Carregando...</div>
        ) : pageData.length === 0 ? (
          <div className="text-neutral-400">Nenhum pedido nesta página.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-neutral-300">
              <tr className="text-left">
                <th className="py-2 pr-4">Tipo</th>
                <th className="py-2 pr-4">Nome</th>
                <th className="py-2 pr-4">Doc</th>
                <th className="py-2 pr-4">Resp.</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Recebido</th>
                <th className="py-2 pr-4">Data</th>
                <th className="py-2 pr-4"></th>
              </tr>
            </thead>
            <tbody className="text-neutral-200">
              {pageData.map(p => {
                const nome = p.isCNPJ ? (p.nomeEmpresa || '-') : (p.nomePessoa || '-');
                const docFmt = p.isCNPJ ? formatCNPJ(p.cpfCnpj) : formatCPF(p.cpfCnpj);
                return (
                  <tr key={p.id} className={`border-t border-white/10 ${hiId === p.id ? 'bg-brand-600/10' : ''}`}>
                    <td className="py-2 pr-4">{p.tipo}{p.isA3 && p.tokenOpcao ? ` • ${p.tokenOpcao === 'com-token' ? 'com token' : 'sem token'}` : ''}</td>
                    <td className="py-2 pr-4">{nome}</td>
                    <td className="py-2 pr-4">{docFmt}</td>
                    <td className="py-2 pr-4">{p.responsavel}</td>
                    <td className="py-2 pr-4">{numberToMoney(p.valorTotal)}</td>
                    <td className="py-2 pr-4">{numberToMoney(p.valorRecebido)}</td>
                    <td className="py-2 pr-4">{new Date(p.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="py-2 pr-4 flex gap-3">
                      <button type="button" className="text-brand-400 hover:text-brand-300 flex items-center gap-1" onClick={() => abrirEditar(p)}>
                        <Edit2 size={14} /> Editar
                      </button>
                      <button type="button" className="text-red-400 hover:text-red-300" onClick={() => removePedido(p.id)}>
                        Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal criar */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo pedido"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="btn w-auto bg-neutral-700 hover:bg-neutral-600" onClick={() => setCreateOpen(false)}><X size={16} /> Cancelar</button>
            <button type="button" className="btn w-auto" onClick={salvarNovo}><Save size={16} /> Salvar</button>
          </div>
        }
      >
        <FormPedido />
      </Modal>

      {/* Modal editar */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar pedido"
        size="lg"
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className="btn w-auto bg-neutral-700 hover:bg-neutral-600" onClick={() => setEditOpen(false)}><X size={16} /> Cancelar</button>
            <button type="button" className="btn w-auto" onClick={salvarEdicao}><Save size={16} /> Salvar alterações</button>
          </div>
        }
      >
        <FormPedido />
      </Modal>
    </div>
  );
}

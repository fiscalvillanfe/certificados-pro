'use client';

import { useEffect, useState } from 'react';
import { listNotifs, markRead, removeNotif, clearNotifs, Notif } from './notifyStore';
import { Trash2, Eye, Download, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotificationCenter() {
  const [items, setItems] = useState<Notif[]>([]);
  const router = useRouter();

  function refresh() {
    setItems(listNotifs());
  }
  useEffect(() => {
    refresh();
  }, []);

  function onView(n: Notif) {
    markRead(n.id);
    refresh();
    if (n.type.startsWith('pedido')) {
      const id = n.payload.pedidoId;
      router.push(id ? `/dashboard/pedidos?focus=${id}` : `/dashboard/pedidos`);
      return;
    }
    if (n.type === 'relatorio:gerado') {
      const q = new URLSearchParams({ inicio: n.payload.inicio || '', fim: n.payload.fim || '' });
      router.push(`/dashboard/relatorios?${q.toString()}`);
    }
  }

  function onDelete(id: string) {
    removeNotif(id);
    refresh();
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-brand-400" />
          <h2 className="font-medium">Notificações recentes</h2>
        </div>
        <button onClick={() => { clearNotifs(); refresh(); }} className="text-xs text-neutral-400 hover:text-neutral-200">
          Limpar tudo
        </button>
      </div>

      {!items.length && <div className="text-sm text-neutral-400">Sem notificações por aqui.</div>}

      <ul className="space-y-2">
        {items.map(n => (
          <li key={n.id} className={`p-3 rounded-lg border border-white/10 ${n.read ? 'opacity-80' : 'bg-neutral-900/40'}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="text-sm">
                {n.type === 'pedido:create' && (
                  <span>
                    <b>{n.actor}</b> criou o pedido <b>{n.payload.pedidoTipo}</b>{n.payload.doc ? ` • ${n.payload.doc}` : ''}.
                  </span>
                )}
                {n.type === 'pedido:delete' && (
                  <span>
                    <b>{n.actor}</b> excluiu um pedido {n.payload.doc ? `(${n.payload.doc})` : ''}.
                  </span>
                )}
                {n.type === 'relatorio:gerado' && (
                  <span>
                    <b>{n.actor}</b> gerou um relatório {n.payload.formato?.toUpperCase()} de <b>{n.payload.inicio}</b> a <b>{n.payload.fim}</b>.
                  </span>
                )}
                <div className="text-[11px] text-neutral-400 mt-1">
                  {new Date(n.createdAt).toLocaleString('pt-BR')}
                  {!n.read && <span className="ml-2 inline-block px-2 py-[2px] text-[10px] rounded bg-brand-600/20 text-brand-300">novo</span>}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => onView(n)} className="btn w-auto py-1 px-2 text-xs flex items-center gap-1">
                  <Eye size={14} /> Ver
                </button>
                {n.type === 'relatorio:gerado' && n.payload.downloadDataUrl && (
                  <a
                    className="btn w-auto py-1 px-2 text-xs flex items-center gap-1"
                    href={n.payload.downloadDataUrl}
                    download={`relatorio_${n.payload.inicio}_${n.payload.fim}.${n.payload.formato === 'excel' ? 'xlsx' : 'pdf'}`}
                  >
                    <Download size={14} /> Baixar
                  </a>
                )}
                <button onClick={() => onDelete(n.id)} title="Excluir notificação" className="p-2 rounded bg-neutral-800 hover:bg-neutral-700">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

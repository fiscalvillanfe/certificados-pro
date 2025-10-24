'use client';

import { useEffect, useRef, useState } from 'react';
import { listNotifs, markRead, removeNotif, clearNotifs, Notif } from './notifyStore';
import { Bell, Trash2, Eye, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotifyBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notif[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  function refresh() {
    setItems(listNotifs());
  }

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (open && boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  const unread = items.filter(n => !n.read).length;

  function onView(n: Notif) {
    // marca como lida
    markRead(n.id);
    refresh();
    if (n.type.startsWith('pedido')) {
      const id = n.payload.pedidoId;
      router.push(id ? `/dashboard/pedidos?focus=${id}` : `/dashboard/pedidos`);
    } else if (n.type === 'relatorio:gerado') {
      const q = new URLSearchParams({ inicio: n.payload.inicio || '', fim: n.payload.fim || '' });
      router.push(`/dashboard/relatorios?${q.toString()}`);
    }
    setOpen(false);
  }

  return (
    <div className="relative" ref={boxRef}>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-lg hover:bg-neutral-800"
        aria-label="Notificações"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-[1px] rounded-full bg-brand-600 text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[380px] max-h-[70vh] overflow-auto rounded-xl bg-neutral-950 border border-white/10 shadow-2xl z-50">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
            <div className="text-sm font-medium">Notificações</div>
            <button
              className="text-xs text-neutral-400 hover:text-neutral-200"
              onClick={() => { clearNotifs(); refresh(); }}
            >
              Limpar tudo
            </button>
          </div>

          {!items.length && <div className="p-4 text-sm text-neutral-400">Sem notificações.</div>}

          <ul className="p-2 space-y-2">
            {items.map(n => (
              <li key={n.id} className={`p-3 rounded-lg border border-white/10 ${n.read ? 'opacity-80' : 'bg-neutral-900/40'}`}>
                <div className="text-sm">
                  {n.type === 'pedido:create' && (
                    <span><b>{n.actor}</b> criou o pedido <b>{n.payload.pedidoTipo}</b>{n.payload.doc ? ` • ${n.payload.doc}` : ''}.</span>
                  )}
                  {n.type === 'pedido:delete' && (
                    <span><b>{n.actor}</b> excluiu um pedido {n.payload.doc ? `(${n.payload.doc})` : ''}.</span>
                  )}
                  {n.type === 'relatorio:gerado' && (
                    <span><b>{n.actor}</b> gerou relatório {n.payload.formato?.toUpperCase()} de <b>{n.payload.inicio}</b> a <b>{n.payload.fim}</b>.</span>
                  )}
                  <div className="text-[11px] text-neutral-400 mt-1">
                    {new Date(n.createdAt).toLocaleString('pt-BR')}
                    {!n.read && <span className="ml-2 inline-block px-2 py-[2px] text-[10px] rounded bg-brand-600/20 text-brand-300">novo</span>}
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
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
                  <button onClick={() => { removeNotif(n.id); refresh(); }} className="p-2 rounded bg-neutral-800 hover:bg-neutral-700">
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

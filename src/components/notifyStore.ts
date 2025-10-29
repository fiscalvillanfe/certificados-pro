'use client';

export type Responsavel = 'FRANK GIOVANNI LOPES' | 'MATHEUS CARDOSO SOARES';
export type NotifType = 'pedido:create' | 'pedido:delete' | 'relatorio:gerado';

export type Notif = {
  id: string;
  type: NotifType;
  createdAt: string;   // ISO
  actor: Responsavel;  // quem fez
  read: boolean;
  payload: {
    // pedido
    pedidoId?: string;
    pedidoTipo?: string;
    doc?: string; // cpf/cnpj formatado

    // relatório
    inicio?: string; // YYYY-MM-DD
    fim?: string;    // YYYY-MM-DD
    formato?: 'pdf' | 'excel';
    downloadDataUrl?: string; // download
};

const KEY = 'notifs_v1';

function readAll(): Notif[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Notif[]) : [];
  } catch {
    return [];
  }
}
function writeAll(all: Notif[]) {
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function listNotifs(): Notif[] {
  return readAll().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function addNotif(n: Omit<Notif, 'id' | 'createdAt' | 'read'>) {
  const novo: Notif = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false, ...n };
  const all = readAll();
  all.push(novo);
  writeAll(all);
  return novo;
}

export function markRead(id: string) {
  writeAll(readAll().map(n => (n.id === id ? { ...n, read: true } : n)));
}

export function removeNotif(id: string) {
  writeAll(readAll().filter(n => n.id !== id));
}

export function clearNotifs() {
  writeAll([]);
}

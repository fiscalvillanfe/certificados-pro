'use client';

import { useSession } from 'next-auth/react';
import NotifyBell from '../../components/NotifyBell';

export default function DashboardHome() {
  const { data } = useSession();
  const user = data?.user?.name ?? 'Usuário';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bem-vindo, {user}</h1>
        <NotifyBell />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><h3 className="font-medium">Pedidos</h3><p className="text-sm text-neutral-400 mt-1">Cadastre, edite e pagine seus pedidos.</p></div>
        <div className="card"><h3 className="font-medium">Relatórios</h3><p className="text-sm text-neutral-400 mt-1">Gere relatórios e visualize gráficos de vendas por período.</p></div>
        <div className="card"><h3 className="font-medium">Atalhos</h3><p className="text-sm text-neutral-400 mt-1">Atalhos rápidos entram aqui depois.</p></div>
      </div>
    </div>
  );
}

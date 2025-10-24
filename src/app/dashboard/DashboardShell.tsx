'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, FileText, Home, LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const userName = data?.user?.name ?? 'Usuário';
  const pathname = usePathname();

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 p-2 rounded-lg transition ${
          active ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-800 text-neutral-300'
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-white/10 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-brand-400 mb-6">CertificadosPro</h2>

          <nav className="space-y-2">
            <NavLink href="/dashboard" icon={Home} label="Início" />
            <NavLink href="/dashboard/pedidos" icon={FileText} label="Pedidos" />
            <NavLink href="/dashboard/relatorios" icon={BarChart3} label="Relatórios" />
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4">
          <p className="text-sm text-neutral-400 mb-2 line-clamp-1">{userName}</p>
          <Link href="/" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition">
            <LogOut size={16} />
            Sair
          </Link>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
          <div className="px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-neutral-400">Painel</span>
            <span className="text-sm text-neutral-400">v1.0</span>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

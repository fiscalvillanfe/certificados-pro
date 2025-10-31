import Link from 'next/link';
import { Home, FileText, BarChart3, LogOut } from 'lucide-react';

// cache OFF
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-white/10 p-5 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-brand-400 mb-6">CertificadosPro</h2>
          <nav className="space-y-2">
            <Link href="/dashboard" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 text-neutral-300">
              <Home size={18} />
              <span>Início</span>
            </Link>
            <Link href="/dashboard/pedidos" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 text-neutral-300">
              <FileText size={18} />
              <span>Pedidos</span>
            </Link>
            <Link href="/dashboard/relatorios" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 text-neutral-300">
              <BarChart3 size={18} />
              <span>Relatórios</span>
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4">
          {/*  */}
          <Link href="/api/auth/signout" className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition">
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

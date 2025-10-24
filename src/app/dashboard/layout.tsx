// NÃO coloque "use client" aqui
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import React from 'react';
import DashboardShell from './DashboardShell';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Layout é server component; opções de rota funcionam aqui.
  return <DashboardShell>{children}</DashboardShell>;
}

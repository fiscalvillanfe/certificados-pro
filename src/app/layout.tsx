import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ minHeight: '100vh', background: '#f6f6f6', color: '#111', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}

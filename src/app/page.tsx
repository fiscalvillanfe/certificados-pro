'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (m, a, b, c, d2) =>
    d2 ? `${a}.${b}.${c}-${d2}` : `${a}.${b}.${c}`
  );
}

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function entrar() {
    setErr('');
    const res = await signIn('credentials', {
      redirect: true,
      callbackUrl: '/dashboard',
      cpf,
      password,
    });
    // @ts-ignore
    if (res?.error) setErr('Falha no login');
  }

  return (
    <main style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
      <div
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 16,
          boxShadow: '0 8px 20px rgba(0,0,0,.08)',
          width: 360,
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Acesso</h1>
        <input
          placeholder="CPF"
          value={formatCPF(cpf)}
          onChange={(e) => setCpf(e.target.value)}
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: 10, marginBottom: 8 }}
        />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', border: '1px solid #ddd', borderRadius: 8, padding: 10, marginBottom: 8 }}
        />
        {err && <div style={{ color: '#c00', fontSize: 12, marginBottom: 8 }}>{err}</div>}
        <button
          onClick={entrar}
          style={{ width: '100%', border: 0, borderRadius: 10, padding: 10, background: '#111', color: '#fff' }}
        >
          Entrar
        </button>
      </div>
    </main>
  );
}

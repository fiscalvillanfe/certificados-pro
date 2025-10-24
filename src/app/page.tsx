'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BackgroundFX from '../components/BackgroundFX';
import Logo from '../components/Logo';

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 9) return d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_m, a, b, c) => [a, b, c].filter(Boolean).join('.'));
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, (_m, a, b, c, d2) => (d2 ? `${a}.${b}.${c}-${d2}` : `${a}.${b}.${c}`));
}

export default function LoginPage() {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (err) setShakeKey((k) => k + 1);
  }, [err]);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!cpf || !senha) {
      setErr('Preencha CPF e senha.');
      return;
    }
    setLoading(true);
    const res = await signIn('credentials', { redirect: false, cpf, senha });

    if (res?.error) {
      setErr('Usuário não autorizado ou credenciais inválidas.');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-950 text-white overflow-hidden">
      {/* fundo animado em z-0 */}
      <BackgroundFX />

      {/* conteúdo acima do fundo */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm card relative z-10"
      >
        <div className="mb-5 flex flex-col items-center">
          <Logo />
          <p className="text-xs text-neutral-400 mt-2">
            Acesso restrito. Monitorado e protegido.
          </p>
        </div>

        <motion.form
          key={shakeKey}
          onSubmit={entrar}
          className="space-y-4"
          animate={err ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div>
            <label htmlFor="cpf" className="block text-sm mb-1">CPF</label>
            <input
              id="cpf"
              className="input w-full"
              placeholder="000.000.000-00"
              inputMode="numeric"
              value={formatCPF(cpf)}
              onChange={(e) => setCpf(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="senha" className="block text-sm mb-1">Senha</label>
            <input
              id="senha"
              type="password"
              className="input w-full"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {err && <div className="text-red-400 text-sm">{err}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn w-full disabled:opacity-60 relative overflow-hidden"
          >
            <span className="relative z-10">{loading ? 'Entrando...' : 'Entrar'}</span>
            <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
              <span className="absolute -inset-1 bg-gradient-to-r from-brand-500/0 via-white/10 to-brand-500/0 blur-2xl" />
            </span>
          </button>

          <p className="text-[11px] text-neutral-500 mt-1">
            Ao continuar, você concorda com as políticas internas e a LGPD.
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

function stripDigits(v: string) {
  return (v || '').replace(/\D/g, '');
}

export const { handlers, auth } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'CPF',
      credentials: {
        cpf: { label: 'CPF', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(creds: Record<string, unknown> | undefined) {
        const cpf = stripDigits(String(creds?.cpf ?? ''));
        const password = String(creds?.password ?? '');

        const user = await prisma.user.findUnique({ where: { cpf } });
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        return { id: user.id, name: user.name, cpf: user.cpf } as any;
      },
    }),
  ],
});

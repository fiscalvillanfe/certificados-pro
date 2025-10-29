// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";

// helpers
function onlyDigits(s: string) { return (s || "").replace(/\D/g, ""); }
function sameCpf(a: string, b: string) { return onlyDigits(a) === onlyDigits(b); }

// tipa as credenciais sla como fala kkkkkkkkkkkkkkkkk
type Creds = { cpf?: string; senha?: string };

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "CPF e Senha",
      credentials: {
        cpf: { label: "CPF", type: "text" },
        senha: { label: "Senha", type: "password" },
      },
      authorize: async (rawCreds) => {
        const creds = (rawCreds || {}) as Creds;
        const cpf = String(creds.cpf ?? "").trim();
        const senha = String(creds.senha ?? "").trim();

        // checar debug 
        console.log("[auth] recebido:", { cpf, senhaLen: senha.length });

        if (!cpf || !senha) {
          console.log("[auth] faltando cpf/senha");
          return null;
        }

        // classifica os digitos
        const users = await prisma.user.findMany();
        const user = users.find(u => sameCpf(u.cpf, cpf));
        console.log("[auth] encontrou user?", !!user, "cpfBanco:", user?.cpf);

        if (!user) return null;
        if (user.senha !== senha) {
          console.log("[auth] senha incorreta");
          return null;
        }

        console.log("[auth] login OK:", user.id);
        return { id: user.id, name: user.nome, cpf: user.cpf };
      }
    })
  ],
  pages: {
    signIn: "/login", // faz o nextauth usar a padrão
    error: "/login"
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET
});

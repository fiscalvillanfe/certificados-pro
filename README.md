**README - CertificadosPro.txt**

---

**CertificadosPro**

Sistema web desenvolvido para gerenciamento de certificados digitais (e-CPF e e-CNPJ), voltado para agentes de registro e empresas que atuam na emissão e controle de certificados.
O projeto oferece login autenticado, criação e acompanhamento de pedidos, geração de relatórios e notificações automáticas sobre ações realizadas pelos usuários.

---

**⚙️ Funcionalidades**

* Login com autenticação (NextAuth) e proteção de rotas.
* Painel de controle (Dashboard) com abas de **Pedidos**, **Relatórios** e **Notificações**.
* Criação, edição e exclusão de pedidos de certificados (A1, A3, 1 a 3 anos).
* Relatórios detalhados de vendas e recebimentos, com opção de download direto.
* Sistema de notificações em tempo real (histórico persistente).
* UI moderna com animações leves e tema escuro.
* Conexão com banco de dados Supabase.
* Desenvolvido em **Next.js + TypeScript + TailwindCSS + Prisma**.

---

**💾 Tecnologias principais**

* **Frontend:** Next.js 14 / React / TailwindCSS / TypeScript
* **Backend:** Next.js API Routes + Prisma ORM
* **Banco:** PostgreSQL (via Supabase)
* **Autenticação:** NextAuth (provider Credentials)
* **Deploy:** Vercel

---

**🧩 Estrutura básica**

```
src/
 ├─ app/
 │   ├─ dashboard/
 │   │   ├─ layout.tsx
 │   │   ├─ page.tsx
 │   │   ├─ pedidos/page.tsx
 │   │   └─ relatorios/page.tsx
 │   ├─ api/
 │   │   └─ auth/[...nextauth]/route.ts
 │   └─ middleware.ts
 ├─ components/
 │   ├─ BackgroundFX.tsx
 │   ├─ Logo.tsx
 │   ├─ Modal.tsx
 │   ├─ NotifyBell.tsx
 │   ├─ NotificationCenter.tsx
 │   ├─ MiniCalendar.tsx
 │   └─ SimpleLineChart.tsx
 └─ lib/
     ├─ prisma.ts
     └─ auth.ts
```

---

**🔐 Login e acesso**

A página inicial (`/`) é o ponto de login.
Após autenticação, o usuário é redirecionado automaticamente para `/dashboard`.
O sistema bloqueia acesso direto a qualquer rota interna caso o usuário não esteja logado.
Mesmo que acesse a página de pedidos, não será exibido nada e o usuario não poderá criar ações, ex; Salvar pedidos e etc.

---

**🧠 Sobre o desenvolvimento**

Este projeto foi criado para servir de base a uma integração entre o painel de certificados e o sistema de pedidos da **AR Mídia**.
A proposta era sincronizar os pedidos criados aqui com o sistema oficial da AR Mídia em tempo real. Ou outra AR (O AGR deveria conseguir a API da pagina da AR).

No entanto, a **API da AR Mídia bloqueia conexões de máquinas não identificadas**, rejeitando qualquer tentativa de envio automático de novos pedidos.
Por conta disso, todos os pedidos ficam **salvos apenas no banco de dados interno (Supabase)** e **não são transmitidos** para o sistema da AR Mídia.

---

**📉 Situação atual**

* Integração com AR Mídia **fracassada por bloqueio de acesso**.
* Todos os pedidos e relatórios são apenas armazenados localmente no Supabase.
* O sistema roda normalmente em produção no **Vercel**, mas sem integração externa ativa.

> Em resumo: **foram 5 dias de tentativa sem sucesso**,
> mas o projeto segue funcionando de forma independente e pode ser retomado futuramente.

---

**🧰 Reutilização do código**

O projeto foi desenvolvido inteiramente em **TypeScript**, com módulos reutilizáveis.
Você pode copiar livremente os arquivos ou trechos que desejar (componentes, hooks, páginas, etc.),
desde que mantenha a referência ao projeto original.

---

**📜 Licença**

Uso livre para estudo, modificação e reimplementação parcial.
Não há restrições de uso pessoal ou comercial, desde que não haja revenda direta do código-fonte.

---

**💡 Observações finais**

* O projeto é totalmente funcional em produção no Vercel.
* Pode ser adaptado para integração com outros sistemas de emissão de certificados.
* Futuras versões devem incluir dashboards de métricas mais completos e APIs externas autenticadas.
* Atualmente alguns scripts não estão dentro desse repositorio por segurança e operam completamente no Supabase.

---

**Status:**

> ✅ Painel funcional
> ⚠️ Integração externa inoperante
> 💤 Desenvolvimento em pausa, não pretendo continuar por enquanto kkkkk.

---

**Autor:** fiscalvillanfe
**Ano:** 2025
**Repositório:** [GitHub - fiscalvillanfe/certificados-pro](https://github.com/fiscalvillanfe/certificados-pro)
**Deploy:** [certificados-pro.vercel.app](https://certificados-pro.vercel.app)

---

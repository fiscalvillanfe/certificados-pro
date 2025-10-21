import { auth } from '../../lib/auth';

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    return (
      <main style={{ padding: 24 }}>
        <p>Não autenticado. Volte ao login.</p>
        <a href="/" style={{ textDecoration: 'underline' }}>Ir para o login</a>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <p>Conectado como: {session.user?.name}</p>
      <p>Se você chegou aqui, o login funcionou. Próximo passo: pedidos e relatórios.</p>
      <a href="/" style={{ textDecoration: 'underline' }}>Sair (voltar)</a>
    </main>
  );
}

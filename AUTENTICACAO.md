# 🔐 Guia de Autenticação - HairInsight

## Status Atual ✅

A autenticação está **100% configurada e funcionando**!

- ✅ Conexão com Supabase estabelecida
- ✅ Variáveis de ambiente configuradas
- ✅ Login funcionando perfeitamente
- ✅ Middleware de proteção de rotas ativo
- ✅ Scripts de gerenciamento de usuários criados

---

## 🎯 Como Funciona

### Fluxo de Autenticação

1. **Login**: Usuário entra com email e senha em `/login`
2. **Verificação**: Supabase valida as credenciais
3. **Sessão**: Token JWT é criado e armazenado em cookies seguros
4. **Acesso**: Usuário é redirecionado para `/app`
5. **Proteção**: Middleware verifica o token em todas as rotas protegidas

### Rotas Protegidas

Estas rotas exigem autenticação:
- `/app/*` - Dashboard principal
- `/admin/*` - Painel administrativo
- `/chat/*` - Chat IA
- `/analysis/*` - Análises de rotina
- `/planos-femininos/*` - Planos femininos
- `/planos-masculinos/*` - Planos masculinos

Se o usuário não estiver logado, será redirecionado automaticamente para `/login`.

---

## 👤 Usuários de Teste

### Credenciais Disponíveis

| Email | Senha | Descrição |
|-------|-------|-----------|
| `teste@hairinsight.com` | `senha123` | Usuário de teste padrão |

---

## 🛠️ Gerenciamento de Usuários

### Criar Novo Usuário

```bash
node scripts/create-user.js email@exemplo.com senha123 "Nome do Usuário"
```

### Listar Todos os Usuários

```bash
node scripts/list-users.js
```

---

## 🔓 Habilitar Registro Público (Opcional)

Atualmente, o registro de novos usuários está **desabilitado** por segurança. Para habilitar:

### Opção 1: Via Dashboard Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: **chhair-hair's Project**
3. Vá em: **Authentication → Providers → Email**
4. Ative: **Enable Email Signup**
5. Salve as alterações

### Opção 2: Via CLI (Recomendado)

Execute este comando para habilitar via migration:

```bash
npx supabase migration new enable_signup
```

Depois adicione este SQL no arquivo criado:

```sql
-- Habilitar registro público
ALTER TABLE auth.users
  ENABLE ROW LEVEL SECURITY;

-- Permitir que qualquer um crie conta
CREATE POLICY "Allow public signup"
  ON auth.users
  FOR INSERT
  TO public
  WITH CHECK (true);
```

Aplique a migration:

```bash
npx supabase db push --yes
```

---

## 🔒 Configuração de Segurança

### Variáveis de Ambiente

```env
# URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_URL=https://imuihupaxkdlortlmfsw.supabase.co

# Chave pública (pode ser exposta no frontend)
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...

# Chave de serviço (NUNCA expor no frontend!)
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
```

### Boas Práticas

✅ **FAÇA:**
- Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` no frontend
- Use `SUPABASE_SERVICE_ROLE_KEY` apenas em APIs server-side
- Mantenha as chaves no `.env` e nunca faça commit

❌ **NÃO FAÇA:**
- Expor a service role key no código frontend
- Compartilhar chaves em repositórios públicos
- Hardcodar credenciais no código

---

## 🧪 Testar Autenticação

### 1. Teste de Login

1. Acesse: http://localhost:3000/login
2. Use: `teste@hairinsight.com` / `senha123`
3. Você deve ser redirecionado para `/app`

### 2. Teste de Proteção de Rota

1. Faça logout (se estiver logado)
2. Tente acessar: http://localhost:3000/app
3. Você deve ser redirecionado para `/login`

### 3. Teste de Cadastro (se habilitado)

1. Acesse: http://localhost:3000/login
2. Clique em "Criar Conta"
3. Preencha email e senha
4. Você deve ser logado automaticamente

---

## 🐛 Solução de Problemas

### Erro: "Invalid login credentials"

**Causa**: Email ou senha incorretos

**Solução**: Verifique as credenciais ou crie um novo usuário com o script

### Erro: "Signups not allowed"

**Causa**: Registro público está desabilitado

**Solução**: Use o script `create-user.js` ou habilite o signup no dashboard

### Erro: "Legacy API keys are disabled"

**Causa**: Usando chaves JWT antigas ao invés das novas `sb_publishable_` e `sb_secret_`

**Solução**: As chaves corretas já estão no `.env`

### Erro: Redirecionamento infinito

**Causa**: Problema no middleware ou cookies

**Solução**:
1. Limpe os cookies do navegador
2. Verifique se o middleware está funcionando
3. Faça logout e login novamente

---

## 📱 Login com Google (Opcional)

O botão "Continuar com Google" está implementado, mas precisa ser configurado:

1. Acesse o Supabase Dashboard
2. Vá em: **Authentication → Providers → Google**
3. Configure as credenciais OAuth do Google
4. Adicione o redirect URL autorizado

---

## 🎉 Pronto!

Sua autenticação está 100% funcional! Se precisar de ajuda ou quiser adicionar mais funcionalidades (recuperação de senha, 2FA, etc.), é só avisar!

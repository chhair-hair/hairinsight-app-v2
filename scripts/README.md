# 🔧 Scripts de Gerenciamento

Scripts utilitários para gerenciar usuários e autenticação do HairInsight.

## 📋 Scripts Disponíveis

### 1. Criar Usuário (`create-user.js`)

Cria um novo usuário no Supabase usando a API Admin.

**Uso:**
```bash
node scripts/create-user.js <email> <senha> [nome]
```

**Exemplos:**
```bash
# Criar usuário simples
node scripts/create-user.js usuario@email.com senha123

# Criar usuário com nome
node scripts/create-user.js joao@email.com senha456 "João Silva"
```

**Notas:**
- A senha deve ter no mínimo 6 caracteres
- O email será confirmado automaticamente (não precisa verificar email)
- Se o email já existir, o script retornará erro

---

### 2. Listar Usuários (`list-users.js`)

Lista todos os usuários cadastrados no Supabase.

**Uso:**
```bash
node scripts/list-users.js
```

**Saída:**
```
📋 Listando usuários...

👥 Total de usuários: 1

1. teste@hairinsight.com
   ID: 63f89014-d585-4015-a974-f6df78af5489
   Criado em: 13/02/2026, 16:22:28
   Nome: Usuário Teste
```

---

## ⚙️ Configuração

Os scripts usam as variáveis de ambiente do arquivo `.env`:

- `SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Certifique-se de que essas variáveis estão configuradas antes de usar os scripts.

---

## 🔒 Segurança

⚠️ **IMPORTANTE**: A chave `SUPABASE_SERVICE_ROLE_KEY` tem poderes administrativos completos. Nunca compartilhe essa chave ou a exponha no frontend!

- ✅ Use apenas em scripts server-side
- ✅ Mantenha a chave no `.env` e nunca faça commit dela
- ❌ Nunca use no código frontend (React, componentes client-side)

---

## 🚀 Usuário de Teste

Para testar o login, use estas credenciais:

- **Email**: `teste@hairinsight.com`
- **Senha**: `senha123`

---

## 💡 Dicas

1. **Registro Desabilitado**: O registro público está desabilitado no Supabase por segurança. Use o script `create-user.js` para criar novos usuários manualmente.

2. **Primeiro Acesso**: Novos usuários podem fazer login imediatamente após a criação (não precisam confirmar email).

3. **Resetar Senha**: Para resetar a senha de um usuário, delete-o e crie novamente com a nova senha.

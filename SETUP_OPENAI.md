# Configuração da Integração OpenAI - HairInsight

## 🔒 Segurança Implementada

✅ **API Keys apenas no servidor** - Todas as chamadas à OpenAI são feitas via API routes server-side
✅ **Variáveis de ambiente** - Nenhuma chave exposta no código frontend
✅ **Pronto para produção** - Basta configurar a variável de ambiente na Vercel

---

## 📋 Pré-requisitos

1. Conta na OpenAI (https://platform.openai.com)
2. Créditos na conta OpenAI para usar GPT-4 Vision API
3. API Key gerada

---

## 🚀 Configuração Local

### 1. Criar arquivo `.env.local`

Na raiz do projeto, crie o arquivo `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANTE:** Nunca commite este arquivo! Ele já está no `.gitignore`.

### 2. Obter sua API Key

1. Acesse https://platform.openai.com/api-keys
2. Clique em "Create new secret key"
3. Copie a chave (você só verá uma vez!)
4. Cole no arquivo `.env.local`

### 3. Testar localmente

```bash
npm run dev
```

Acesse o app e faça o upload de fotos no quiz para testar a análise.

---

## 🌐 Deploy na Vercel (Produção)

### 1. Adicionar variável de ambiente

No painel da Vercel:

1. Vá em **Settings** > **Environment Variables**
2. Adicione uma nova variável:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Environment:** Production, Preview, Development
3. Clique em **Save**

### 2. Redesploy

Após adicionar a variável, faça um novo deploy:

```bash
git push origin main
```

Ou no painel da Vercel: **Deployments** > **Redeploy**

---

## 🔧 Como Funciona

### Arquitetura Segura

```
Frontend (Cliente)
    ↓ POST /api/analyze-photos
API Route (Servidor)
    ↓ Usa OPENAI_API_KEY
OpenAI Vision API
    ↓ Retorna análise
Frontend recebe resultado
```

### Arquivos Criados

1. **`/src/app/api/analyze-photos/route.ts`**
   - Recebe fotos do frontend
   - Chama OpenAI Vision API com a chave do servidor
   - Retorna análise estruturada

2. **`/src/app/api/generate-routine/route.ts`**
   - Recebe dados do quiz + análise
   - Gera rotina personalizada via GPT-4
   - Retorna rotina completa

3. **`/src/lib/openai.ts`**
   - Funções helper para chamar as API routes
   - Sem exposição de API keys

4. **`/src/app/resultado-completo/page.tsx`**
   - Página com resultado detalhado
   - Pontos críticos identificados
   - Calendário mensal de rotina

---

## 💰 Custos Estimados

- **GPT-4 Vision API:** ~$0.01 por análise (3 fotos)
- **GPT-4 Text:** ~$0.03 por geração de rotina
- **Total por usuário:** ~$0.04

Para 100 usuários/dia: ~$4/dia = ~$120/mês

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'openai'"

```bash
npm install openai
```

### Erro: "API key not configured"

Verifique se o `.env.local` existe e contém `OPENAI_API_KEY=...`

### Erro: "Insufficient quota"

Sua conta OpenAI não tem créditos. Adicione em:
https://platform.openai.com/account/billing

### Erro 401: "Unauthorized"

A API key está incorreta. Gere uma nova em:
https://platform.openai.com/api-keys

---

## 📝 Notas Importantes

- **Nunca** commite arquivos `.env` ou `.env.local`
- **Nunca** coloque API keys no código frontend
- Use variáveis de ambiente diferentes para dev/prod se necessário
- Monitore o uso na dashboard da OpenAI

---

## ✅ Checklist de Segurança

- [x] API keys apenas em variáveis de ambiente
- [x] Chamadas à OpenAI apenas server-side
- [x] `.env` no `.gitignore`
- [x] Validação de entrada nas API routes
- [x] Tratamento de erros
- [x] Pronto para produção na Vercel

---

## 🎉 Pronto!

Sua integração com OpenAI está configurada de forma segura e profissional. 🚀

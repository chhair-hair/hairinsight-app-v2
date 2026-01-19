# 🔑 Como Configurar a OpenAI API

## 📋 Status Atual

✅ **Código está pronto** - A integração com OpenAI está implementada corretamente
❌ **Falta a chave da API** - Você precisa adicionar sua chave da OpenAI

---

## 🚀 Passo a Passo

### 1. Obter sua chave da OpenAI

1. Acesse: https://platform.openai.com/api-keys
2. Faça login na sua conta OpenAI
3. Clique em **"Create new secret key"**
4. Copie a chave (começa com `sk-proj-...`)

### 2. Adicionar a chave no projeto

Abra o arquivo `.env.local` e substitua:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Por:

```bash
OPENAI_API_KEY=sk-proj-SUA_CHAVE_AQUI
```

### 3. Reiniciar o servidor

Depois de adicionar a chave, reinicie o servidor:

```bash
npm run dev
```

---

## 🔒 Segurança

- ✅ A chave **NUNCA** é exposta no frontend
- ✅ A chave fica **APENAS** no servidor (API Routes)
- ✅ O arquivo `.env.local` está no `.gitignore` (não vai para o Git)
- ✅ Para produção, adicione a chave nas **Environment Variables da Vercel**

---

## 🎯 Como funciona a análise

1. **Usuário tira 3 fotos** na página `/quiz/photos`
2. **Frontend envia** as fotos para `/api/analyze-photos`
3. **API Route** (server-side) usa a OpenAI Vision API
4. **OpenAI analisa** as fotos e retorna:
   - Tipo de cabelo
   - Nível de dano
   - Tendência (oleoso/seco/normal)
   - Saúde do couro cabeludo
   - Porosidade
   - Espessura dos fios
   - Problemas críticos
   - Pontos fortes
   - Recomendações (imediatas, semanais, mensais)

5. **Análise é usada** para gerar rotina personalizada

---

## 💰 Custo Estimado

- **Modelo usado**: `gpt-4o` (GPT-4 com visão)
- **Custo por análise**: ~$0.01 - $0.03 USD
- **Tokens por análise**: ~1500 tokens

---

## 🧪 Testar a integração

Após configurar a chave:

1. Acesse: http://localhost:3000/quiz/photos
2. Tire as 3 fotos
3. Clique em "Analisar Fotos"
4. Veja a análise na página `/analisando` ou `/analisando-masculino`

---

## ❓ Problemas comuns

### Erro: "Missing OPENAI_API_KEY"
- Verifique se adicionou a chave no `.env.local`
- Reinicie o servidor (`npm run dev`)

### Erro: "Invalid API Key"
- Verifique se copiou a chave completa
- Certifique-se que a chave está ativa no painel da OpenAI

### Erro: "Rate limit exceeded"
- Você atingiu o limite de requisições
- Aguarde alguns minutos ou adicione créditos na conta OpenAI

---

## 📦 Deploy na Vercel

Para a análise funcionar em produção:

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione a variável:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `sk-proj-SUA_CHAVE_AQUI`
   - **Environment**: Production
3. Faça redeploy do projeto

---

## 🎨 Arquivos da integração

- `/src/lib/openai.ts` - Cliente frontend (chama API routes)
- `/src/app/api/analyze-photos/route.ts` - API route que usa OpenAI
- `/src/app/api/generate-routine/route.ts` - API route para gerar rotina
- `/src/app/quiz/photos/page.tsx` - Página de upload de fotos

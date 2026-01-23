# 🔑 Como Configurar a OpenAI API Key

## ✅ Configuração na Plataforma Lasy

**IMPORTANTE**: A chave deve ser configurada como **variável SECRETA** na plataforma Lasy.

### Passo a Passo:

1. **Obter a chave da OpenAI**
   - Acesse: https://platform.openai.com/api-keys
   - Crie uma nova API Key (começará com `sk-proj-...`)
   - Copie a chave completa

2. **Configurar na Plataforma Lasy**
   - Vá em **Configurações do Projeto** ou **Variáveis de Ambiente**
   - Adicione uma **VARIÁVEL SECRETA** com:
     - **Nome**: `OPENAI_API_KEY`
     - **Valor**: Sua chave completa (ex: `sk-proj-abc123...`)
   - Salve e aguarde a aplicação reiniciar

3. **Verificar se está funcionando**
   - Acesse: `/teste-openai` no seu app
   - Clique em "Testar OpenAI"
   - Você deverá ver: "Chave configurada corretamente ✅"

---

## 🔒 Segurança

- ✅ A chave NUNCA é exposta no navegador
- ✅ Todas as chamadas OpenAI são feitas no servidor (`/api/...`)
- ✅ O frontend apenas chama as rotas API internas
- ✅ A chave é lida de `process.env.OPENAI_API_KEY` (server-side)

---

## ❌ Se não funcionar

Se você vir erro "Chave da OpenAI não configurada":

1. Verifique se o nome da variável é **exatamente** `OPENAI_API_KEY`
2. Confirme que é uma variável **SECRETA** (não pública)
3. Aguarde alguns segundos para o app reiniciar
4. Teste novamente em `/teste-openai`

---

## 📋 Onde a chave é usada

O código busca `process.env.OPENAI_API_KEY` nas seguintes rotas:

- `/api/analyze-photos` - Análise de fotos com Vision API
- `/api/generate-routine` - Geração de rotina personalizada
- `/api/test-openai` - Teste de configuração

**Nenhuma chamada OpenAI acontece no navegador!** 🔒

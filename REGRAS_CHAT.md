# 🚨 REGRAS CRÍTICAS - SISTEMA DE CHAT

## ✅ SISTEMA ATUAL: CHAT INTERNO COM OPENAI

O chat do app usa **OpenAI GPT-4o-mini** integrado diretamente na aplicação.

### Arquitetura:
```
┌─────────────────────────────────────────────────────┐
│  Frontend: /chat                                    │
│  └─> Interface de chat React (src/app/chat/page)   │
│      └─> Envia mensagens para /api/chat            │
│                                                     │
│  Backend: /api/chat                                 │
│  └─> Rota Next.js API (src/app/api/chat/route.ts) │
│      └─> Chama OpenAI com contexto do usuário      │
│          └─> Retorna resposta personalizada        │
└─────────────────────────────────────────────────────┘
```

### Contexto enviado à OpenAI:
- ✅ Tipo de cabelo do usuário
- ✅ Gênero (feminino/masculino)
- ✅ Objetivo capilar
- ✅ Frequência de lavagem
- ✅ Análise de IA (se disponível)
- ✅ Nível de dano
- ✅ Tendência do cabelo

### Benefícios:
- ✅ Chat totalmente integrado ao app
- ✅ IA conhece o histórico do usuário
- ✅ Respostas personalizadas e contextualizadas
- ✅ Sem dependências externas
- ✅ Controle total sobre UX
- ✅ Sem custos adicionais de terceiros

---

## ❌ O QUE NÃO USAR: TAWK.TO

**TAWK.TO FOI COMPLETAMENTE REMOVIDO DO PROJETO!**

### Por que?
1. **Falta de contexto** - Tawk.to não sabe nada sobre o usuário
2. **Experiência ruim** - Widget externo não integrado ao design
3. **Dependência externa** - Mais um serviço para gerenciar
4. **Custo desnecessário** - OpenAI é mais barato e melhor
5. **Sem personalização** - Não adapta respostas ao tipo de cabelo

### Commit que removeu Tawk.to:
```
refactor: Remove Tawk.to e implementa chat interno com OpenAI
Hash: 4d2c94b
Data: 2026-01-23
```

**NUNCA REVERTA ESTE COMMIT!**

---

## 🔒 COMO GARANTIR QUE TAWK.TO NÃO VOLTE

### 1. NUNCA fazer:
```typescript
// ❌ ERRADO - NUNCA FAZER ISSO
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

// ❌ ERRADO - NUNCA ADICIONAR SCRIPT TAWK
const script = document.createElement('script');
script.src = 'https://embed.tawk.to/...';
```

### 2. SEMPRE fazer:
```typescript
// ✅ CORRETO - Usar chat interno com OpenAI
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...],
    quizData: userContext
  })
});
```

### 3. Checklist antes de modificar o chat:
- [ ] Estou tentando adicionar Tawk.to ou outro chat externo?
- [ ] Estou removendo a integração OpenAI?
- [ ] Estou criando dependência de serviço terceiro?

**Se qualquer resposta for SIM → NÃO FAÇA!**

---

## 📋 ESTRUTURA DO CHAT ATUAL

### Frontend (`src/app/chat/page.tsx`):
- Interface de chat moderna e responsiva
- Mensagens do usuário e assistente
- Auto-scroll para última mensagem
- Sugestões de perguntas
- Loading states
- Tratamento de erros

### Backend (`src/app/api/chat/route.ts`):
- Rota POST que recebe mensagens
- Envia contexto completo do usuário para OpenAI
- System prompt especializado em cabelos
- Usa modelo `gpt-4o-mini` (rápido e econômico)
- Retorna resposta + usage tokens
- Tratamento de erros OpenAI (401, 429, etc)

---

## 🎯 MELHORIAS FUTURAS PERMITIDAS

### ✅ Pode adicionar:
- Histórico persistente (salvar conversa no localStorage/DB)
- Streaming de respostas (SSE ou WebSockets)
- Feedback nas respostas (👍/👎)
- Compartilhamento de conversas
- Sugestões contextuais inteligentes
- Voice input (speech-to-text)
- Markdown rendering nas respostas
- Code highlighting se IA enviar receitas

### ❌ Não pode adicionar:
- Tawk.to ou qualquer chat widget externo
- Intercom, Zendesk Chat, Drift, etc.
- Qualquer solução que não seja OpenAI
- Scripts de terceiros no chat

---

## 💡 POR QUE ESSA REGRA EXISTE?

1. **Integração nativa** - Chat é parte do app, não um iframe externo
2. **Contexto do usuário** - IA sabe tudo sobre o usuário
3. **Personalização total** - Design e UX consistentes
4. **Controle** - Sem limites de terceiros
5. **Custo-benefício** - OpenAI é mais barato e melhor

---

## 🔑 CONFIGURAÇÃO NECESSÁRIA

Para o chat funcionar, configure:
- **OPENAI_API_KEY** - Variável secreta na plataforma Lasy

Sem configuração adicional necessária!

---

## ⚠️ HISTÓRICO DE MUDANÇAS

### v1 - Tawk.to (REMOVIDO)
- ❌ Chat externo via widget
- ❌ Sem contexto do usuário
- ❌ UX ruim e não integrada

### v2 - OpenAI Chat (ATUAL)
- ✅ Chat interno integrado
- ✅ Contexto completo do usuário
- ✅ IA especializada em cabelos
- ✅ UX moderna e responsiva

**Sempre use v2!**

---

## 📞 SUPORTE

Se precisar adicionar funcionalidades ao chat:
1. ✅ Modifique `src/app/chat/page.tsx` (frontend)
2. ✅ Modifique `src/app/api/chat/route.ts` (backend)
3. ✅ Use OpenAI como base
4. ❌ NÃO adicione serviços externos

Se alguém sugerir adicionar Tawk.to, mostre este documento!

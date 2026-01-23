# 🚨 REGRAS CRÍTICAS - USO DA OPENAI API

## ✅ ONDE A OPENAI PODE SER USADA

A OpenAI Vision API deve ser usada **APENAS** no fluxo do quiz inicial:

### Páginas permitidas:
- `/analisando-feminina` - Primeira análise após quiz feminino
- `/analisando-masculina` - Primeira análise após quiz masculino

Estas páginas chamam:
- `/api/analyze-photos` - Análise com Vision API
- `/api/generate-routine` - Geração de rotina com GPT

---

## ❌ ONDE A OPENAI **NUNCA** DEVE SER USADA

### Páginas de reanálise (PROIBIDO):
- ❌ `/reanalise-analisando-feminina`
- ❌ `/reanalise-analisando-masculina`

### Por que?
1. **Custo desnecessário** - Cada chamada OpenAI consome créditos
2. **Experiência ruim** - Reanálise deve ser instantânea
3. **Lógica incorreta** - Fotos já foram analisadas no quiz inicial
4. **Decisão do usuário** - Solicitado explicitamente para não usar IA em reanálise

---

## 🔒 COMO GARANTIR QUE ISSO NÃO VOLTE

### 1. Páginas de reanálise devem:
```typescript
// ✅ CORRETO
const processPhotos = async () => {
  // Apenas salvar fotos no contexto
  console.log('[Reanálise] Fotos salvas no contexto.');

  // Redirecionar direto
  router.push('/app?updated=true');
};
```

### 2. O que NÃO fazer:
```typescript
// ❌ ERRADO - NUNCA FAZER ISSO EM REANÁLISE
import { analyzeHairPhotos } from '@/lib/openai';
const analysis = await analyzeHairPhotos(...);
```

### 3. Mensagens de UI:
```typescript
// ✅ CORRETO
"Salvando suas novas fotos..."
"Atualizando seu perfil..."
"Preparando seu app..."

// ❌ ERRADO
"Analisando com OpenAI Vision..."
"Nossa IA está processando..."
```

---

## 📋 CHECKLIST ANTES DE MODIFICAR PÁGINAS

Antes de tocar em páginas de reanálise, pergunte:

- [ ] Esta página é de reanálise? (`reanalise-analisando-*`)
- [ ] Estou tentando adicionar `analyzeHairPhotos()`?
- [ ] Estou importando algo de `@/lib/openai`?
- [ ] Estou chamando `/api/analyze-photos` ou `/api/generate-routine`?

**Se qualquer resposta for SIM → NÃO FAÇA!**

---

## 🎯 RESUMO VISUAL

```
┌─────────────────────────────────────────────────────┐
│  FLUXO DO QUIZ INICIAL (OpenAI ✅ PERMITIDO)       │
├─────────────────────────────────────────────────────┤
│  1. Usuário responde quiz                           │
│  2. Usuário envia 3 fotos                           │
│  3. Vai para /analisando-feminina ou masculina      │
│  4. OpenAI Vision analisa fotos ✅                  │
│  5. OpenAI GPT gera rotina personalizada ✅         │
│  6. Redireciona para /app com análise completa      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  FLUXO DE REANÁLISE (OpenAI ❌ PROIBIDO)           │
├─────────────────────────────────────────────────────┤
│  1. Usuário clica em "Atualizar Fotos" no app      │
│  2. Usuário envia novas 3 fotos                     │
│  3. Vai para /reanalise-analisando-*                │
│  4. APENAS salva fotos no contexto ✅               │
│  5. NÃO chama OpenAI ❌                             │
│  6. Redireciona direto para /app?updated=true      │
└─────────────────────────────────────────────────────┘
```

---

## 💡 POR QUE ESSA REGRA EXISTE?

1. **Economia** - Cada análise OpenAI custa dinheiro
2. **Performance** - Reanálise deve ser instantânea
3. **UX** - Usuário só quer atualizar fotos, não refazer análise completa
4. **Lógica** - Análise já foi feita no quiz inicial

---

## ⚠️ COMMIT QUE REMOVEU OPENAI DA REANÁLISE

```
refactor: Remove OpenAI Vision das páginas de reanálise de fotos
Hash: 6a7e9fc
Data: 2026-01-23
```

**NUNCA REVERTA ESTE COMMIT!**

Se alguém tentar adicionar OpenAI de volta na reanálise, mostre este documento.

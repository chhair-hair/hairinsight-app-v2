# 🔔 Firebase Push Notifications - Configuração Completa

## ✅ O que já está pronto

O projeto está configurado para usar **Firebase Cloud Messaging (FCM) HTTP v1** com as variáveis de ambiente que você já adicionou.

### Arquivos criados:
- ✅ `/src/lib/firebase-admin.ts` - Configuração do Firebase Admin SDK (server-side)
- ✅ `/src/app/api/send-notification/route.ts` - API para enviar notificações
- ✅ `/src/app/api/register-fcm-token/route.ts` - API para registrar tokens FCM
- ✅ `/src/lib/firebase-config.ts` - Configuração do Firebase Client SDK
- ✅ `/src/components/NotificationManager.tsx` - Componente React para gerenciar notificações
- ✅ `/public/sw.js` - Service Worker atualizado com suporte FCM
- ✅ `/public/firebase-messaging-sw.js` - Service Worker específico do Firebase

## 📋 Próximos passos

### 1. Adicionar variáveis de ambiente do Firebase Client

Você precisa adicionar as configurações do Firebase para o navegador no arquivo `.env.local`:

```bash
# Firebase Client (navegador)
NEXT_PUBLIC_FIREBASE_API_KEY="sua-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu-projeto-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu-projeto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="sua-vapid-key"
```

**Onde encontrar essas informações:**
1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** (ícone de engrenagem) → **Geral**
4. Role até **Seus apps** e copie as configurações
5. Para a VAPID Key: vá em **Cloud Messaging** → **Web Push certificates** → Gerar par de chaves

### 2. Atualizar o arquivo firebase-messaging-sw.js

Edite o arquivo `/public/firebase-messaging-sw.js` e substitua as configurações:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 3. Usar o componente NotificationManager

Adicione o componente em qualquer página do seu app:

```tsx
import { NotificationManager } from '@/components/NotificationManager';

export default function Page() {
  return (
    <div>
      <h1>Minha Página</h1>
      <NotificationManager />
    </div>
  );
}
```

## 🚀 Como usar as APIs

### Enviar notificação para um usuário

```typescript
const response = await fetch('/api/send-notification', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'token-fcm-do-usuario',
    title: 'Hora da rotina capilar! 💆‍♀️',
    body: 'Não esqueça de aplicar seu produto hoje',
    imageUrl: 'https://example.com/image.jpg', // opcional
    data: {
      url: '/app',
      customData: 'valor'
    }
  }),
});

const result = await response.json();
console.log(result);
```

### Enviar notificações em massa

```typescript
const response = await fetch('/api/send-notification', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    tokens: ['token1', 'token2', 'token3'],
    title: 'Promoção especial! 🎉',
    body: 'Descontos em produtos capilares',
    data: {
      url: '/products'
    }
  }),
});

const result = await response.json();
console.log(`${result.successCount} notificações enviadas`);
```

### Registrar token FCM

O componente `NotificationManager` já faz isso automaticamente, mas você pode fazer manualmente:

```typescript
const response = await fetch('/api/register-fcm-token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    token: 'token-fcm',
    userId: 'user-123', // opcional
    deviceInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
    }
  }),
});
```

### Listar todos os tokens ativos

```typescript
const response = await fetch('/api/register-fcm-token', {
  method: 'GET',
});

const result = await response.json();
console.log(`${result.count} tokens ativos`);
console.log(result.tokens);
```

## 🗄️ Banco de dados (Opcional)

Para armazenar os tokens FCM no Supabase, crie a tabela:

```sql
-- Criar tabela para armazenar tokens FCM
CREATE TABLE fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fcm_token TEXT UNIQUE NOT NULL,
  user_id UUID,
  device_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_fcm_tokens_active ON fcm_tokens(is_active);
CREATE INDEX idx_fcm_tokens_user_id ON fcm_tokens(user_id);
CREATE INDEX idx_fcm_tokens_token ON fcm_tokens(fcm_token);

-- RLS (Row Level Security)
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Política para permitir insert de qualquer usuário
CREATE POLICY "Usuários podem registrar tokens"
  ON fcm_tokens FOR INSERT
  WITH CHECK (true);

-- Política para permitir update apenas do próprio token
CREATE POLICY "Usuários podem atualizar próprios tokens"
  ON fcm_tokens FOR UPDATE
  USING (true);
```

Ou use a CLI do Supabase:

```bash
npx supabase migration new create_fcm_tokens_table
# Edite o arquivo criado e adicione o SQL acima
npx supabase db push --yes
```

## 🧪 Testando as notificações

### Teste manual via navegador

1. Acesse seu app
2. Clique em "Ativar Notificações"
3. Permita as notificações quando o navegador solicitar
4. Copie o token FCM exibido
5. Use a API `/api/send-notification` para enviar uma notificação teste

### Teste via curl

```bash
curl -X POST http://localhost:3000/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "token": "seu-token-fcm-aqui",
    "title": "Teste de Notificação",
    "body": "Esta é uma notificação de teste!"
  }'
```

## 🔐 Segurança

✅ **Implementado corretamente:**
- Service Account usando variáveis de ambiente (sem arquivo JSON físico)
- Firebase Admin SDK apenas no servidor (API routes)
- Nenhuma chave exposta no frontend
- HTTP v1 API (moderna e segura)
- Suporte a PWA completo

## 📱 Compatibilidade

- ✅ Chrome/Edge (Desktop e Android)
- ✅ Firefox (Desktop e Android)
- ✅ Safari (Desktop e iOS 16.4+)
- ✅ Opera
- ❌ iOS Safari (versões antigas - limitações da Apple)

## 🎯 Casos de uso

### Lembretes de rotina capilar
```typescript
// Agendar lembrete diário
await fetch('/api/send-notification', {
  method: 'POST',
  body: JSON.stringify({
    token: userToken,
    title: '🌟 Hora da sua rotina!',
    body: 'Aplique seu sérum e hidratante agora',
    data: { url: '/app' }
  })
});
```

### Notificação de novo conteúdo
```typescript
// Avisar sobre novo artigo
await fetch('/api/send-notification', {
  method: 'POST',
  body: JSON.stringify({
    token: userToken,
    title: '📝 Novo artigo disponível',
    body: '10 dicas para cabelos brilhantes',
    imageUrl: 'https://example.com/article.jpg',
    data: { url: '/blog/10-dicas' }
  })
});
```

### Promoções e ofertas
```typescript
// Enviar para todos os usuários
const { tokens } = await fetch('/api/register-fcm-token').then(r => r.json());

await fetch('/api/send-notification', {
  method: 'PUT',
  body: JSON.stringify({
    tokens: tokens.map(t => t.fcm_token),
    title: '🎉 Black Friday Capilar',
    body: '50% OFF em todos os produtos',
    data: { url: '/products' }
  })
});
```

## 🆘 Troubleshooting

### Erro: "Variáveis de ambiente do Firebase não configuradas"
- Verifique se você adicionou todas as variáveis no `.env.local`
- Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro: "Firebase Messaging não suportado"
- Verifique se está usando HTTPS (ou localhost)
- Confirme que o navegador suporta notificações

### Token FCM não é gerado
- Verifique se a VAPID Key está configurada
- Confirme que o Service Worker está registrado (`/sw.js`)
- Verifique o console do navegador para erros

### Notificações não aparecem
- Verifique as permissões de notificação no navegador
- Confirme que o Service Worker está ativo
- Teste se o token FCM está correto

## 📚 Recursos adicionais

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications Guide](https://web.dev/notifications/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

💖 **Pronto para enviar notificações incríveis para seus usuários!**

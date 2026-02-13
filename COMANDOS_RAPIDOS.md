# ⚡ Comandos Rápidos - Notificações Push

## 🚀 Se ainda não criou a tabela no Supabase

```bash
# 1. Criar migration
npx supabase migration new create_fcm_tokens_table

# 2. Abrir o arquivo criado em supabase/migrations/ e colar este SQL:
```

```sql
CREATE TABLE fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fcm_token TEXT UNIQUE NOT NULL,
  user_id UUID,
  device_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fcm_tokens_active ON fcm_tokens(is_active);
CREATE INDEX idx_fcm_tokens_user ON fcm_tokens(user_id);
```

```bash
# 3. Aplicar a migration
npx supabase db push --yes
```

## 🧪 Testar as Notificações

Apenas acesse no navegador:
```
/teste-notificacoes
```

## 🔍 Verificar Service Worker

Abra o Console do navegador (F12) e vá em:
```
Application > Service Workers
```

Deve aparecer: `/firebase-messaging-sw.js` com status "activated"

## 📊 Ver Logs em Tempo Real

Abra o Console (F12) e filtre por:
```
FCM
Firebase
Notificação
```

## 🧹 Limpar Cache (se algo não funcionar)

```bash
# No navegador:
Ctrl + Shift + Delete (Windows/Linux)
Cmd + Shift + Delete (Mac)

# Marque:
☑️ Cache de imagens e arquivos
☑️ Cookies e dados do site
```

Depois recarregue com:
```
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (Mac)
```

## 🔧 Gerar nova VAPID Key (Firebase)

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em: **Project Settings** (⚙️)
4. Aba: **Cloud Messaging**
5. Role até "Web configuration"
6. Clique em "Generate key pair" (se não tiver)
7. Copie a **Web Push certificates** key

## 📝 Variáveis que DEVEM estar no .env.local

```env
# Frontend
NEXT_PUBLIC_FIREBASE_API_KEY="sua_api_key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="seu_projeto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="seu_projeto_id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="seu_projeto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abc123"
NEXT_PUBLIC_FIREBASE_VAPID_KEY="sua_vapid_key_aqui"

# Backend
FIREBASE_PROJECT_ID="seu_projeto_id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@seu_projeto.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key"
```

## 🎯 Endpoints da API

```bash
# Registrar token
POST /api/register-fcm-token
{
  "token": "fcm_token_aqui",
  "userId": "opcional",
  "deviceInfo": { "userAgent": "...", "platform": "..." }
}

# Enviar notificação individual
POST /api/send-notification
{
  "token": "fcm_token_aqui",
  "title": "Título",
  "body": "Mensagem"
}

# Enviar notificação em massa
PUT /api/send-notification
{
  "tokens": ["token1", "token2"],
  "title": "Título",
  "body": "Mensagem"
}

# Listar tokens ativos
GET /api/register-fcm-token

# Desativar token
DELETE /api/register-fcm-token
{
  "token": "fcm_token_aqui"
}
```

## 🐛 Debugar Problemas

### Ver todos os Service Workers registrados:
Abra o Console e cole:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => console.log(regs))
```

### Ver permissão de notificações:
```javascript
console.log(Notification.permission)
```

### Forçar atualização do Service Worker:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.update())
})
```

### Desregistrar todos os Service Workers (último recurso):
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister())
})
```

## 📱 Testar em Dispositivos Móveis

1. Acesse o app pelo celular (use ngrok ou deploy)
2. Vá em `/teste-notificacoes`
3. Permita notificações
4. Minimize o app
5. Envie uma notificação
6. Deve aparecer na barra de notificações

---

**Dica:** Se tudo estiver configurado, o teste leva menos de 1 minuto! 🚀

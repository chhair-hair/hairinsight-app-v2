# 📱 Exemplos Práticos de Notificações Push

## 🎯 Casos de uso reais

### 1. Lembrete de rotina capilar diária

```typescript
// src/app/api/routines/send-reminder/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, routineTime } = await request.json();

  // Busca o token FCM do usuário
  const { data: tokens } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (!tokens || tokens.length === 0) {
    return NextResponse.json({ error: 'Usuário sem notificações ativas' });
  }

  // Envia notificação
  const response = await fetch('/api/send-notification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: tokens[0].fcm_token,
      title: '⏰ Hora da sua rotina capilar!',
      body: `Chegou a hora de ${routineTime}. Não esqueça!`,
      data: {
        url: '/app',
        routineId: '123',
        type: 'routine-reminder'
      }
    })
  });

  return NextResponse.json(await response.json());
}
```

### 2. Análise de fotos concluída

```typescript
// Após a IA analisar as fotos
async function notifyAnalysisComplete(userId: string, analysisId: string) {
  const { data: tokens } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (tokens && tokens.length > 0) {
    await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokens[0].fcm_token,
        title: '✨ Sua análise capilar está pronta!',
        body: 'Veja o resultado completo e sua rotina personalizada',
        imageUrl: 'https://seu-dominio.com/resultado-preview.jpg',
        data: {
          url: `/resultado-completo?id=${analysisId}`,
          type: 'analysis-complete',
          analysisId
        }
      })
    });
  }
}
```

### 3. Promoção de produtos

```typescript
// Enviar para todos os usuários que usam shampoo
async function sendProductPromotion() {
  // Busca usuários que usam shampoo na rotina
  const { data: users } = await supabase
    .from('user_routines')
    .select('user_id')
    .contains('products', ['shampoo'])
    .distinct();

  // Busca tokens FCM desses usuários
  const userIds = users?.map(u => u.user_id) || [];
  const { data: tokens } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .in('user_id', userIds)
    .eq('is_active', true);

  if (tokens && tokens.length > 0) {
    const fcmTokens = tokens.map(t => t.fcm_token);

    await fetch('/api/send-notification', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokens: fcmTokens,
        title: '🎉 Oferta especial para você!',
        body: '30% OFF em shampoos selecionados. Válido até domingo!',
        imageUrl: 'https://seu-dominio.com/promo-shampoo.jpg',
        data: {
          url: '/products?category=shampoo&promo=true',
          type: 'promotion',
          discount: '30'
        }
      })
    });
  }
}
```

### 4. Sequência de onboarding

```typescript
// Enviar notificações progressivas para novos usuários
async function sendOnboardingSequence(userId: string) {
  const { data: tokens } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (!tokens || tokens.length === 0) return;

  const token = tokens[0].fcm_token;

  // Dia 1: Boas-vindas
  await fetch('/api/send-notification', {
    method: 'POST',
    body: JSON.stringify({
      token,
      title: '👋 Bem-vindo ao HairInsight!',
      body: 'Vamos começar sua jornada capilar? Tire suas primeiras fotos!',
      data: { url: '/quiz/photos', day: '1' }
    })
  });

  // Dia 3: Lembrete
  setTimeout(async () => {
    await fetch('/api/send-notification', {
      method: 'POST',
      body: JSON.stringify({
        token,
        title: '💡 Dica do dia',
        body: 'Sabia que a hidratação é essencial? Veja nosso guia!',
        data: { url: '/blog/hidratacao', day: '3' }
      })
    });
  }, 3 * 24 * 60 * 60 * 1000); // 3 dias
}
```

### 5. Notificação de conquistas

```typescript
// Quando o usuário completa 7 dias de rotina
async function notifyAchievement(userId: string, achievement: string) {
  const { data: tokens } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (tokens && tokens.length > 0) {
    await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokens[0].fcm_token,
        title: '🏆 Conquista desbloqueada!',
        body: achievement === '7-days'
          ? 'Parabéns! 7 dias de rotina completa. Continue assim!'
          : 'Você alcançou uma nova conquista!',
        data: {
          url: '/app/achievements',
          type: 'achievement',
          achievement
        }
      })
    });
  }
}
```

### 6. Lembrete de reanalise

```typescript
// Enviar após 30 dias da última análise
async function sendReanalysisReminder(userId: string) {
  const { data: tokens } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (tokens && tokens.length > 0) {
    await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokens[0].fcm_token,
        title: '📸 Hora de reanalisar seus cabelos',
        body: 'Já se passaram 30 dias! Veja a evolução dos seus cabelos',
        data: {
          url: '/reanalise-feminina',
          type: 'reanalysis-reminder'
        }
      })
    });
  }
}
```

### 7. Notificação baseada em localização/clima

```typescript
// Enviar dicas baseadas no clima
async function sendWeatherBasedTip(userId: string, weather: string) {
  const { data: tokens } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', userId)
    .eq('is_active', true);

  let message = {
    title: '🌦️ Dica baseada no clima',
    body: 'Hoje está úmido. Use anti-frizz!'
  };

  if (weather === 'sunny') {
    message = {
      title: '☀️ Sol forte hoje!',
      body: 'Não esqueça do protetor solar capilar'
    };
  } else if (weather === 'rainy') {
    message = {
      title: '🌧️ Dia chuvoso',
      body: 'Hidratação é essencial em dias úmidos'
    };
  }

  if (tokens && tokens.length > 0) {
    await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokens[0].fcm_token,
        ...message,
        data: {
          url: '/app',
          type: 'weather-tip',
          weather
        }
      })
    });
  }
}
```

### 8. Notificação de chat/mensagem

```typescript
// Quando um especialista responde
async function notifyNewMessage(userId: string, from: string) {
  const { data: tokens } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (tokens && tokens.length > 0) {
    await fetch('/api/send-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: tokens[0].fcm_token,
        title: '💬 Nova mensagem',
        body: `${from} respondeu sua dúvida`,
        data: {
          url: '/chat',
          type: 'new-message',
          from
        }
      })
    });
  }
}
```

## 🔔 Integração com React Components

### Hook customizado para notificações

```typescript
// src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { getFCMToken } from '@/lib/firebase-config';

export function useNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const initToken = async () => {
      const fcmToken = await getFCMToken();
      if (fcmToken) {
        setToken(fcmToken);
        setIsEnabled(true);
      }
    };

    initToken();
  }, []);

  const enableNotifications = async () => {
    const fcmToken = await getFCMToken();
    if (fcmToken) {
      await fetch('/api/register-fcm-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: fcmToken })
      });
      setToken(fcmToken);
      setIsEnabled(true);
      return true;
    }
    return false;
  };

  const disableNotifications = async () => {
    if (token) {
      await fetch('/api/register-fcm-token', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      setToken(null);
      setIsEnabled(false);
    }
  };

  return {
    token,
    isEnabled,
    enableNotifications,
    disableNotifications
  };
}
```

### Uso no componente

```typescript
// src/app/settings/page.tsx
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { isEnabled, enableNotifications, disableNotifications } = useNotifications();

  return (
    <div>
      <h2>Notificações Push</h2>
      <p>
        {isEnabled
          ? 'Você está recebendo notificações'
          : 'Ative para receber lembretes'}
      </p>
      <Button
        onClick={isEnabled ? disableNotifications : enableNotifications}
      >
        {isEnabled ? 'Desativar' : 'Ativar'}
      </Button>
    </div>
  );
}
```

## 🤖 Automação com Cron Jobs

### Lembrete diário (9h da manhã)

```javascript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/daily-reminder",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### Lembrete noturno (21h)

```javascript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/night-reminder",
      "schedule": "0 21 * * *"
    }
  ]
}
```

### Resumo semanal (domingo às 19h)

```javascript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/weekly-summary",
      "schedule": "0 19 * * 0"
    }
  ]
}
```

## 📊 Analytics e tracking

```typescript
// Registrar quando usuário abre notificação
async function trackNotificationOpen(notificationId: string, userId: string) {
  await supabase.from('notification_analytics').insert({
    notification_id: notificationId,
    user_id: userId,
    action: 'opened',
    timestamp: new Date().toISOString()
  });
}

// Registrar quando usuário ignora notificação
async function trackNotificationDismiss(notificationId: string, userId: string) {
  await supabase.from('notification_analytics').insert({
    notification_id: notificationId,
    user_id: userId,
    action: 'dismissed',
    timestamp: new Date().toISOString()
  });
}
```

---

💡 **Dica**: Sempre teste as notificações em diferentes dispositivos e navegadores para garantir compatibilidade!

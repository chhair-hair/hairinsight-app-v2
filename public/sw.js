const CACHE_NAME = 'hairinsight-v3-notifications';
const urlsToCache = [
  '/',
  '/app',
  '/quiz',
  '/manifest.json'
];

// Storage para agendamentos
const NOTIFICATION_STORE = 'hairinsight-notifications';

// Install service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
  // Ativa imediatamente o novo service worker
  self.skipWaiting();
});

// Fetch resources
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        // Fallback para offline
        if (event.request.destination === 'document') {
          return caches.match('/app');
        }
      })
  );
});


// Handle push notifications (compatível com FCM)
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event);

  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.log('[SW] Erro ao parsear dados do push:', e);
  }

  const title = data.notification?.title || data.title || 'HairInsight';
  const options = {
    body: data.notification?.body || data.body || 'Hora da sua rotina capilar!',
    icon: data.notification?.icon || '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'hairinsight-notification',
    requireInteraction: false,
    data: {
      url: data.data?.url || data.url || '/app',
      ...data.data
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Clique na notificação:', event);
  event.notification.close();

  // Se clicou em "fechar", apenas fecha
  if (event.action === 'close') {
    return;
  }

  // Se clicou em "lembrar depois", agenda notificação para 30 minutos
  if (event.action === 'later') {
    setTimeout(() => {
      const type = event.notification.data?.routineType || 'morning';
      sendRoutineNotification(type);
    }, 30 * 60 * 1000); // 30 minutos
    return;
  }

  const urlToOpen = event.notification.data?.url || '/app';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Procura por uma janela já aberta
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        // Se não encontrou, abre uma nova janela
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notificação fechada:', event);
});

// Listener para mensagens do cliente (agendamento de notificações)
self.addEventListener('message', (event) => {
  console.log('[SW] Mensagem recebida:', event.data);

  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATIONS') {
    const { morningTime, nightTime, enabled } = event.data;

    if (enabled) {
      // Salva configurações no IndexedDB ou em cache
      scheduleRoutineNotifications(morningTime, nightTime);
    } else {
      // Cancela notificações agendadas
      cancelScheduledNotifications();
    }
  }
});

// Agenda notificações periódicas
async function scheduleRoutineNotifications(morningTime, nightTime) {
  console.log('[SW] Agendando notificações para:', { morningTime, nightTime });

  // Salva em cache para persistência
  const cache = await caches.open(CACHE_NAME);
  await cache.put(
    new Request('/notification-schedule'),
    new Response(JSON.stringify({ morningTime, nightTime, enabled: true }))
  );

  // Agenda check periódico (a cada minuto)
  setInterval(() => {
    checkAndSendNotification(morningTime, nightTime);
  }, 60000); // 60 segundos

  // Faz primeiro check imediatamente
  checkAndSendNotification(morningTime, nightTime);
}

// Cancela notificações
async function cancelScheduledNotifications() {
  console.log('[SW] Cancelando notificações agendadas');
  const cache = await caches.open(CACHE_NAME);
  await cache.delete('/notification-schedule');
}

// Verifica se é hora de enviar notificação
async function checkAndSendNotification(morningTime, nightTime) {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  console.log('[SW] Verificando notificações:', currentTime, { morningTime, nightTime });

  // Verifica se chegou o horário da manhã
  if (currentTime === morningTime) {
    await sendRoutineNotification('morning');
  }

  // Verifica se chegou o horário da noite
  if (currentTime === nightTime) {
    await sendRoutineNotification('night');
  }
}

// Envia notificação de rotina
async function sendRoutineNotification(type) {
  console.log('[SW] Enviando notificação de rotina:', type);

  const title = type === 'morning' ? '☀️ Hora da Rotina da Manhã!' : '🌙 Hora da Rotina da Noite!';
  const body = type === 'morning'
    ? 'Hora de cuidar dos seus cabelos! Veja os passos da sua rotina matinal.'
    : 'Hora da sua rotina noturna! Vamos cuidar dos seus cabelos?';

  const options = {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: `hairinsight-routine-${type}`,
    requireInteraction: true,
    data: {
      url: '/app',
      routineType: type,
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: '👁️ Ver Rotina'
      },
      {
        action: 'later',
        title: '⏰ Lembrar Depois'
      }
    ]
  };

  try {
    await self.registration.showNotification(title, options);
    console.log('[SW] Notificação enviada com sucesso');
  } catch (error) {
    console.error('[SW] Erro ao enviar notificação:', error);
  }
}

// Inicializa verificação de notificações ao ativar
self.addEventListener('activate', async (event) => {
  console.log('[SW] Ativando Service Worker e checando notificações...');

  // Código de ativação existente
  const cacheWhitelist = [CACHE_NAME];
  await caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          console.log('[SW] Deletando cache antigo:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  });

  // Recupera configurações de notificação
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match('/notification-schedule');

    if (response) {
      const config = await response.json();
      if (config.enabled) {
        console.log('[SW] Reativando notificações com config:', config);
        scheduleRoutineNotifications(config.morningTime, config.nightTime);
      }
    }
  } catch (error) {
    console.error('[SW] Erro ao recuperar config de notificações:', error);
  }

  return self.clients.claim();
});

// Service Worker para Firebase Cloud Messaging
// Este arquivo é gerado automaticamente pelo script generate-firebase-sw.js
// NUNCA edite este arquivo manualmente - ele será sobrescrito

importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuração do Firebase (injetada automaticamente das variáveis de ambiente)
const firebaseConfig = {
  "apiKey": "",
  "authDomain": "",
  "projectId": "",
  "storageBucket": "",
  "messagingSenderId": "",
  "appId": ""
};

// Inicializa o Firebase apenas se as configurações foram fornecidas
if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    firebase.initializeApp(firebaseConfig);

    // Obtém a instância do messaging
    const messaging = firebase.messaging();

    // Handler para mensagens em background
    messaging.onBackgroundMessage((payload) => {
      console.log('[FCM SW] Mensagem recebida em background:', payload);

      const notificationTitle = payload.notification?.title || 'HairInsight';
      const notificationOptions = {
        body: payload.notification?.body || 'Você tem uma nova notificação',
        icon: payload.notification?.icon || '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        data: payload.data || {},
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

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });

    console.log('✅ Firebase Cloud Messaging inicializado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Cloud Messaging:', error);
  }
} else {
  console.warn('⚠️ Firebase Cloud Messaging não configurado - variáveis de ambiente não encontradas');
}

// Handler para clique na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('[FCM SW] Clique na notificação:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Abre ou foca na janela do app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data?.url || '/app';

      // Verifica se já existe uma janela aberta
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }

      // Se não existe, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

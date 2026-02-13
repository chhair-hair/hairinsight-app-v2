import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

// Configuração do Firebase (substitua com suas credenciais)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

// Inicializa o Firebase apenas uma vez
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let messaging: ReturnType<typeof getMessaging> | null = null;

// Função para obter o messaging (apenas no cliente)
export async function getFirebaseMessaging() {
  if (typeof window === 'undefined') {
    return null;
  }

  // Verifica se o navegador suporta notificações
  const supported = await isSupported();
  if (!supported) {
    console.warn('⚠️ Firebase Messaging não é suportado neste navegador');
    return null;
  }

  if (!messaging) {
    messaging = getMessaging(app);
  }

  return messaging;
}

// Função para obter o token FCM
export async function getFCMToken(): Promise<string | null> {
  try {
    const messaging = await getFirebaseMessaging();
    if (!messaging) {
      return null;
    }

    // Verifica permissão de notificações
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('⚠️ Permissão de notificações negada');
      return null;
    }

    // VAPID Key (obtenha nas configurações do Firebase Cloud Messaging)
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.warn('⚠️ VAPID Key não configurada. Configure NEXT_PUBLIC_FIREBASE_VAPID_KEY');
    }

    // Obtém o token FCM
    const token = await getToken(messaging, {
      vapidKey: vapidKey || undefined,
      serviceWorkerRegistration: await navigator.serviceWorker.ready,
    });

    if (token) {
      console.log('✅ Token FCM obtido:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.log('⚠️ Não foi possível obter o token FCM');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao obter token FCM:', error);
    return null;
  }
}

// Função para ouvir mensagens em foreground
export async function onForegroundMessage(callback: (payload: unknown) => void) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, callback);
}

export default app;

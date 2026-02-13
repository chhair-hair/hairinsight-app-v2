'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFCMToken, onForegroundMessage } from '@/lib/firebase-config';
import { toast } from 'sonner';

export function NotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verifica se notificações são suportadas
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Se já tiver permissão, obtém o token automaticamente
    if (notificationPermission === 'granted' && !fcmToken) {
      initializeNotifications();
    }
  }, [notificationPermission, fcmToken]);

  useEffect(() => {
    // Listener para mensagens em foreground
    if (!fcmToken) return;

    let unsubscribe: (() => void) | undefined;

    onForegroundMessage((payload: any) => {
      console.log('📬 Mensagem recebida em foreground:', payload);

      const title = payload.notification?.title || 'HairInsight';
      const body = payload.notification?.body || 'Você tem uma nova notificação';

      toast(title, {
        description: body,
        duration: 5000,
        action: payload.data?.url ? {
          label: 'Abrir',
          onClick: () => window.location.href = payload.data.url,
        } : undefined,
      });
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [fcmToken]);

  const initializeNotifications = async () => {
    setIsLoading(true);
    try {
      // Obtém o token FCM
      const token = await getFCMToken();

      if (token) {
        setFcmToken(token);

        // Salva o token no localStorage para fácil acesso
        localStorage.setItem('fcm_token', token);

        // Registra o token no backend
        const response = await fetch('/api/register-fcm-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            deviceInfo: {
              userAgent: navigator.userAgent,
              platform: navigator.platform,
              language: navigator.language,
            },
          }),
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Notificações ativadas com sucesso!', {
            description: 'Você receberá lembretes da sua rotina capilar',
          });
          setNotificationPermission('granted');
        } else {
          console.warn('⚠️ Aviso ao registrar token:', data.warning);
          if (data.warning) {
            toast.warning('Notificações configuradas', {
              description: data.message,
            });
          }
        }
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar notificações:', error);
      toast.error('Erro ao ativar notificações', {
        description: 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error('Notificações não suportadas', {
        description: 'Seu navegador não suporta notificações push',
      });
      return;
    }

    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        await initializeNotifications();
      } else {
        toast.error('Permissão negada', {
          description: 'Você precisa permitir notificações nas configurações do navegador',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao solicitar permissão:', error);
      toast.error('Erro ao solicitar permissão', {
        description: 'Tente novamente mais tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disableNotifications = async () => {
    if (!fcmToken) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/register-fcm-token', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: fcmToken }),
      });

      const data = await response.json();

      if (data.success) {
        setFcmToken(null);
        toast.success('Notificações desativadas', {
          description: 'Você não receberá mais notificações push',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao desativar notificações:', error);
      toast.error('Erro ao desativar notificações');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1 flex items-center gap-2">
            {notificationPermission === 'granted' ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Notificações Ativadas
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Ativar Notificações
              </>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {notificationPermission === 'granted'
              ? 'Você receberá lembretes da sua rotina capilar'
              : 'Receba lembretes para não esquecer da sua rotina'}
          </p>
        </div>

        {notificationPermission === 'granted' ? (
          <Button
            size="sm"
            variant="outline"
            onClick={disableNotifications}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <BellOff className="w-4 h-4" />
            Desativar
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={requestPermission}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Ativar
          </Button>
        )}
      </div>

      {fcmToken && (
        <div className="text-xs text-muted-foreground border-t pt-3">
          <p className="font-mono truncate">Token: {fcmToken.substring(0, 40)}...</p>
        </div>
      )}
    </div>
  );
}

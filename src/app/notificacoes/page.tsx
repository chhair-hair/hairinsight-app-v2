'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Bell, ArrowLeft, Sun, Moon, Check } from 'lucide-react';

export default function NotificacoesPage() {
  const router = useRouter();
  const { getThemeColors } = useQuiz();
  const colors = getThemeColors();

  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [morningTime, setMorningTime] = useState('08:00');
  const [nightTime, setNightTime] = useState('21:00');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Carrega configurações salvas
    const savedMorning = localStorage.getItem('notification-morning-time');
    const savedNight = localStorage.getItem('notification-night-time');
    const savedEnabled = localStorage.getItem('notifications-enabled');

    if (savedMorning) setMorningTime(savedMorning);
    if (savedNight) setNightTime(savedNight);
    if (savedEnabled === 'true') setIsEnabled(true);

    // Verifica permissão atual
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Seu navegador não suporta notificações');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Registra o service worker para notificações
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registrado:', registration);
        }
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  const handleSave = async () => {
    localStorage.setItem('notification-morning-time', morningTime);
    localStorage.setItem('notification-night-time', nightTime);
    localStorage.setItem('notifications-enabled', 'true');
    setIsEnabled(true);

    // Envia configurações para o Service Worker
    await sendNotificationConfigToSW(morningTime, nightTime, true);

    // Mostra confirmação
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      router.push('/app');
    }, 2000);

    // Agenda notificações
    scheduleNotifications();
  };

  const scheduleNotifications = () => {
    // Demonstração: envia notificação de teste
    if (permission === 'granted') {
      setTimeout(() => {
        new Notification('HairInsight', {
          body: 'Suas notificações foram ativadas! Você receberá lembretes nos horários configurados.',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
        });
      }, 2000);
    }
  };

  const handleDisable = async () => {
    localStorage.removeItem('notifications-enabled');
    setIsEnabled(false);

    // Desabilita no Service Worker
    await sendNotificationConfigToSW('', '', false);

    router.push('/app');
  };

  // Função para enviar config ao Service Worker
  const sendNotificationConfigToSW = async (morning: string, night: string, enabled: boolean) => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration.active) {
          registration.active.postMessage({
            type: 'SCHEDULE_NOTIFICATIONS',
            morningTime: morning,
            nightTime: night,
            enabled: enabled,
          });
          console.log('Configuração enviada ao Service Worker:', { morning, night, enabled });
        }
      } catch (error) {
        console.error('Erro ao enviar config ao SW:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/app')}
            className="p-2 hover:bg-white/10 rounded-lg transition-all mb-4 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Notificações</h1>
              <p className="text-white/60 text-sm">Configure seus lembretes</p>
            </div>
          </div>
        </div>

        {/* Permissão */}
        {permission !== 'granted' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
            <h3 className="font-bold text-sm mb-2 text-yellow-200">Permissão Necessária</h3>
            <p className="text-white/80 text-xs mb-3">
              Para receber lembretes, precisamos da sua permissão para enviar notificações.
            </p>
            <button
              onClick={requestNotificationPermission}
              className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: colors.primary }}
            >
              Permitir Notificações
            </button>
          </div>
        )}

        {/* Configurações de Horário */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <h3 className="font-bold text-base mb-4">Horários dos Lembretes</h3>

          {/* Manhã */}
          <div className="bg-white/5 rounded-lg p-4 mb-3">
            <div className="flex items-center gap-3 mb-3">
              <Sun className="w-5 h-5" style={{ color: colors.primary }} />
              <div>
                <h4 className="font-semibold text-sm">Rotina da Manhã</h4>
                <p className="text-white/60 text-xs">Lembrete matinal</p>
              </div>
            </div>
            <input
              type="time"
              value={morningTime}
              onChange={(e) => setMorningTime(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/40 transition-all"
              disabled={permission !== 'granted'}
            />
          </div>

          {/* Noite */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Moon className="w-5 h-5" style={{ color: colors.primary }} />
              <div>
                <h4 className="font-semibold text-sm">Rotina da Noite</h4>
                <p className="text-white/60 text-xs">Lembrete noturno</p>
              </div>
            </div>
            <input
              type="time"
              value={nightTime}
              onChange={(e) => setNightTime(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/40 transition-all"
              disabled={permission !== 'granted'}
            />
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-2">
          <button
            onClick={handleSave}
            disabled={permission !== 'granted'}
            className="w-full px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: permission === 'granted' ? colors.primary : '#666' }}
          >
            Salvar e Ativar
          </button>

          {isEnabled && (
            <button
              onClick={handleDisable}
              className="w-full px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition-all active:scale-95"
            >
              Desativar Notificações
            </button>
          )}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Notificações ativadas!</span>
          </div>
        )}
      </div>
    </div>
  );
}

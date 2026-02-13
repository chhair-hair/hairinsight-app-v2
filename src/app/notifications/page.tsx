'use client';

import { useState } from 'react';
import Navbar from '@/components/custom/navbar';
import { Bell, Check, Clock, Sparkles, Settings } from 'lucide-react';
import { Gender } from '@/lib/types';

export default function NotificationsPage() {
  const [gender] = useState<Gender>('feminino'); // TODO: Get from context/state

  const accentColor = gender === 'feminino' ? '#FF6F91' : '#9B59B6';

  const notifications = [
    {
      id: 1,
      title: 'Hora da Hidratação!',
      message: 'Está na hora do seu tratamento de hidratação semanal',
      time: '2 horas atrás',
      read: false,
      type: 'reminder',
    },
    {
      id: 2,
      title: 'Nova Conquista Desbloqueada',
      message: 'Parabéns! Você completou 7 dias consecutivos de cuidados',
      time: '1 dia atrás',
      read: false,
      type: 'achievement',
    },
    {
      id: 3,
      title: 'Dica do Dia',
      message: 'Evite lavar o cabelo com água muito quente para preservar a hidratação',
      time: '2 dias atrás',
      read: true,
      type: 'tip',
    },
    {
      id: 4,
      title: 'Análise Concluída',
      message: 'Sua análise capilar está pronta! Confira as recomendações',
      time: '3 dias atrás',
      read: true,
      type: 'info',
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen">
      <Navbar gender={gender} />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                <Bell className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-sm text-white/80">
                  {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span style={{ color: accentColor }}>Notificações</span>
              </h1>
              <p className="text-lg text-white/60">
                Acompanhe suas atualizações e lembretes
              </p>
            </div>

            <button
              className="p-3 rounded-xl border border-white/20 hover:bg-white/5 transition-colors"
              title="Configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mb-8">
            <button
              className="px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              Todas
            </button>
            <button className="px-4 py-2 rounded-xl border border-white/20 font-medium text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300">
              Não Lidas
            </button>
            <button className="px-4 py-2 rounded-xl border border-white/20 font-medium text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300">
              Lembretes
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group rounded-2xl border p-6 transition-all duration-300 hover:border-white/20 ${
                  notification.read
                    ? 'border-white/10 bg-white/5'
                    : 'border-white/20 bg-white/10'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}20` }}
                  >
                    {notification.type === 'achievement' ? (
                      <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
                    ) : notification.type === 'reminder' ? (
                      <Clock className="w-5 h-5" style={{ color: accentColor }} />
                    ) : (
                      <Bell className="w-5 h-5" style={{ color: accentColor }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-bold text-lg">{notification.title}</h3>
                      {!notification.read && (
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0 mt-2"
                          style={{ backgroundColor: accentColor }}
                        />
                      )}
                    </div>
                    <p className="text-white/60 mb-3">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/40">{notification.time}</span>
                      {!notification.read && (
                        <button
                          className="text-sm font-medium transition-colors hover:opacity-80"
                          style={{ color: accentColor }}
                        >
                          Marcar como lida
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {notifications.length === 0 && (
            <div className="text-center py-16">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Bell className="w-10 h-10" style={{ color: accentColor }} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Nenhuma notificação</h3>
              <p className="text-white/60">
                Você está em dia com tudo!
              </p>
            </div>
          )}

          {/* Mark All as Read */}
          {unreadCount > 0 && (
            <div className="mt-8 text-center">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 font-medium hover:bg-white/5 transition-all duration-300"
              >
                <Check className="w-5 h-5" />
                <span>Marcar todas como lidas</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

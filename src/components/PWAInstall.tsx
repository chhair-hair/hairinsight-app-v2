'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // SÓ MOSTRA se estiver na rota /app (depois do obrigado)
    const isInApp = pathname === '/app';
    if (!isInApp) {
      setShowInstallBanner(false);
      return;
    }

    // Verifica se já está instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const wasDismissed = localStorage.getItem('pwa-install-dismissed');

    if (!isInstalled && !wasDismissed) {
      // Listener para o evento de instalação
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setShowInstallBanner(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso!');
    }

    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 shadow-2xl border border-white/20">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm mb-1">
              Instale o HairInsight
            </h3>
            <p className="text-white/90 text-xs mb-3">
              Adicione o app na tela inicial para acesso rápido e notificações!
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              Instalar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

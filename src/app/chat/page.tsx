'use client';

import { useEffect, useState } from 'react';
import AppHeader from '@/components/custom/app-header';
import { MessageCircle, Sparkles, Loader2 } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import { Gender } from '@/lib/types';

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function ChatPage() {
  const { quizData } = useQuiz();
  const gender: Gender = quizData?.gender || 'feminino';
  const accentColor = gender === 'feminino' ? '#FF6F91' : '#9B59B6';
  const [isLoading, setIsLoading] = useState(true);
  const [tawkLoaded, setTawkLoaded] = useState(false);

  useEffect(() => {
    // Configuração do Tawk.to
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Criar e adicionar o script do Tawk.to
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID'; // Substitua pelos seus IDs do Tawk.to
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Callback quando o Tawk.to carregar
    script.onload = () => {
      setIsLoading(false);
      setTawkLoaded(true);

      // Configurações adicionais do Tawk.to
      if (window.Tawk_API) {
        // Maximizar o widget automaticamente
        window.Tawk_API.onLoad = function() {
          window.Tawk_API.maximize();
        };

        // Customizar com dados do usuário (opcional)
        window.Tawk_API.setAttributes({
          name: 'Visitante',
          gender: gender,
          hairType: quizData?.hairType || 'Não informado',
        }, function(error: any) {
          if (error) {
            console.error('Erro ao definir atributos Tawk.to:', error);
          }
        });
      }
    };

    script.onerror = () => {
      setIsLoading(false);
      console.error('Erro ao carregar o Tawk.to');
    };

    document.head.appendChild(script);

    // Cleanup ao desmontar o componente
    return () => {
      // Minimizar o widget quando sair da página
      if (window.Tawk_API && window.Tawk_API.minimize) {
        window.Tawk_API.minimize();
      }
    };
  }, [quizData, gender]);

  // Abrir o chat quando clicar no botão
  const handleOpenChat = () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <AppHeader accentColor={accentColor} />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
          {/* Header */}
          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border mb-4"
              style={{ borderColor: `${accentColor}30` }}
            >
              <MessageCircle className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-sm text-white/80">Chat com IA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Assistente <span style={{ color: accentColor }}>Virtual</span>
            </h1>
            <p className="text-lg text-white/60">
              Tire suas dúvidas sobre cuidados capilares 24/7
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2
                  className="w-12 h-12 animate-spin mx-auto mb-4"
                  style={{ color: accentColor }}
                />
                <p className="text-white/60">Carregando chat...</p>
              </div>
            </div>
          )}

          {/* Chat Container - Somente após carregar */}
          {!isLoading && tawkLoaded && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
              >
                <MessageCircle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold mb-3">Chat Ativo!</h2>
              <p className="text-white/60 mb-6 max-w-md">
                Nosso assistente virtual está pronto para responder suas dúvidas sobre cuidados capilares.
              </p>

              <button
                onClick={handleOpenChat}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Abrir Chat</span>
              </button>

              {/* Perguntas Frequentes */}
              <div className="mt-12 w-full max-w-2xl">
                <h3 className="text-lg font-bold mb-4 text-left">Perguntas Frequentes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Como identificar meu tipo de cabelo?',
                    'Qual a frequência ideal de hidratação?',
                    'Como fazer cronograma capilar?',
                    'Dicas para cabelos danificados',
                    'Como evitar pontas duplas?',
                    'Melhor forma de secar o cabelo?',
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={handleOpenChat}
                      className="text-left px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benefícios do Chat */}
              <div className="mt-12 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: '🤖',
                    title: 'IA Especializada',
                    desc: 'Respostas personalizadas sobre cabelos',
                  },
                  {
                    icon: '⚡',
                    title: 'Respostas Rápidas',
                    desc: 'Assistência imediata 24/7',
                  },
                  {
                    icon: '💬',
                    title: 'Suporte Completo',
                    desc: 'Tire todas as suas dúvidas',
                  },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                  >
                    <div className="text-4xl mb-3">{benefit.icon}</div>
                    <h4 className="font-semibold mb-2">{benefit.title}</h4>
                    <p className="text-sm text-white/60">{benefit.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {!isLoading && !tawkLoaded && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <MessageCircle className="w-10 h-10" style={{ color: accentColor }} />
                </div>
                <h2 className="text-2xl font-bold mb-3">Ops! Algo deu errado</h2>
                <p className="text-white/60 mb-6">
                  Não foi possível carregar o chat. Por favor, recarregue a página ou tente novamente mais tarde.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
                >
                  Recarregar Página
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Conteúdo Principal - Scrollável */}
      <div className="flex-1 flex items-center justify-center p-4 pb-32 md:pb-4">
        <div className="max-w-4xl w-full text-center">
          {/* Logo/Icon */}
          <div
            className="mb-6 md:mb-8 animate-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            <div
              className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full mb-4 md:mb-6"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </div>

          {/* Título Principal */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-in"
            style={{ animationDelay: '100ms' }}
          >
            HairInsight
          </h1>

          {/* Subtítulo - Mais curto no mobile */}
          <p
            className="text-lg sm:text-xl md:text-2xl text-white/70 mb-3 md:mb-4 animate-fade-in px-4"
            style={{ animationDelay: '200ms' }}
          >
            Análise Capilar com IA
          </p>

          <p
            className="text-sm sm:text-base md:text-lg text-white/50 mb-8 md:mb-12 max-w-2xl mx-auto animate-fade-in px-4"
            style={{ animationDelay: '300ms' }}
          >
            Rotina personalizada em minutos
          </p>

          {/* Botão Principal - Desktop apenas */}
          <div className="hidden md:flex justify-center items-center mb-12 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-white transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              }}
            >
              <span>Começar Análise</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Features - Compactas no mobile */}
          <div
            className="mt-8 md:mt-16 grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto animate-fade-in px-2"
            style={{ animationDelay: '500ms' }}
          >
            {[
              { title: 'Rápido', desc: '6 perguntas', icon: '⚡' },
              { title: 'IA', desc: 'Inteligente', icon: '🧠' },
              { title: 'Personalizado', desc: 'Sob medida', icon: '✨' },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-3 md:p-6 rounded-lg md:rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-2xl md:text-3xl mb-2">{feature.icon}</div>
                <h3 className="font-semibold text-xs md:text-lg mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-white/60 text-[10px] md:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botão CTA Fixo Mobile - Apenas mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D] to-transparent backdrop-blur-sm z-50">
        <button
          onClick={handleStartQuiz}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-xl font-bold text-white transition-all duration-300 shadow-2xl active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <span>Começar Análise</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

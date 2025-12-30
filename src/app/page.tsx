'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push('/quiz');
  };

  const handleDirectAccess = () => {
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo/Icon */}
        <div
          className="mb-8 animate-fade-in"
          style={{ animationDelay: '0ms' }}
        >
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Título Principal */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in"
          style={{ animationDelay: '100ms' }}
        >
          HairInsight
        </h1>

        {/* Subtítulo */}
        <p
          className="text-xl sm:text-2xl text-white/70 mb-4 animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          Análise Capilar Inteligente com IA
        </p>

        <p
          className="text-lg text-white/50 mb-12 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: '300ms' }}
        >
          Descubra o segredo para um cabelo saudável em minutos. Análise personalizada com inteligência artificial.
        </p>

        {/* Botões CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
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

          {/* Botão de Acesso Direto para Testes */}
          <button
            onClick={handleDirectAccess}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold text-white/90 border-2 border-white/20 transition-all duration-300 hover:bg-white/10 hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <Zap className="w-5 h-5" />
            <span>Acesso Direto (Preview)</span>
          </button>
        </div>

        {/* Nota de Preview */}
        <p className="text-sm text-white/40 mb-12 animate-fade-in" style={{ animationDelay: '450ms' }}>
          💡 Use "Acesso Direto" para testar o app sem passar pelo quiz
        </p>

        {/* Features */}
        <div
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in"
          style={{ animationDelay: '500ms' }}
        >
          {[
            { title: 'Análise Rápida', desc: 'Apenas 6 perguntas' },
            { title: 'IA Avançada', desc: 'Tecnologia de ponta' },
            { title: 'Personalizado', desc: 'Rotina sob medida' },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
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

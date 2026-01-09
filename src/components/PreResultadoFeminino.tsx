'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import HorizontalFeed from '@/components/HorizontalFeed';
import { useQuiz } from '@/lib/quiz-context';

export default function PreResultadoFeminino() {
  const { updateQuizData, isAdmin } = useQuiz();

  // FORÇAR cores rosas femininas (não depender do getThemeColors)
  const colors = {
    primary: '#FF6F91',
    primaryLight: '#FF6F91',
    primaryDark: '#FF4D73',
  };

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    'Espessura dos fios',
    'Oleosidade do couro cabeludo',
    'Saúde da cutícula',
    'Compatibilidade com rotinas capilares'
  ];

  // Marca o quiz como concluído quando chegar nesta página (exceto admin)
  useEffect(() => {
    if (!isAdmin) {
      console.log('✅ Usuário chegou no pré-resultado feminino - Marcando quiz como concluído');
      updateQuizData({ hasCompletedQuiz: true });
    } else {
      console.log('🔓 Admin acessando pré-resultado feminino - não marca quiz como concluído');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= analysisSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1250);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const depoimentos = [
    {
      id: 1,
      texto: 'Minha autoestima mudou completamente após seguir a rotina. Nunca pensei que teria tanto resultado em pouco tempo.',
      nome: 'Mariana S.',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      texto: 'A análise da IA foi certeira, meu cabelo mudou em 30 dias.',
      nome: 'Juliana R.',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      texto: 'O antes e depois fala por si só. Recomendo 100%.',
      nome: 'Camila P.',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white pb-20">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-600 container mx-auto px-4 sm:px-6 py-8 sm:py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 sm:mb-6">
          <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
          <span className="text-sm text-white/80">Transformações Reais</span>
          {isAdmin && (
            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded ml-2">
              MODO ADMIN
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent px-4">
          Veja Resultados Reais
        </h1>
        <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto px-4">
          Pessoas reais que transformaram seus cabelos seguindo rotinas personalizadas
        </p>
      </div>

      {/* Barra de Progresso */}
      <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white/90">Analisando seu perfil</span>
            <span className="text-sm font-bold" style={{ color: colors.primary }}>{analysisProgress}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full transition-all duration-300 ease-out rounded-full"
              style={{
                width: `${analysisProgress}%`,
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.primaryLight})`
              }}
            />
          </div>
        </div>
      </div>

      {/* Bloco: O que estamos analisando */}
      <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="max-w-3xl mx-auto">
          <div className="animate-in fade-in duration-600 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center" style={{ color: colors.primary }}>
              O que estamos analisando agora
            </h2>
            <div className="space-y-4">
              {analysisSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 ${
                    index <= currentStep
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border border-white/5 opacity-40'
                  }`}
                  style={{
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index <= currentStep ? 'animate-pulse' : ''
                    }`}
                    style={{
                      backgroundColor: index <= currentStep ? colors.primary : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    {index <= currentStep ? (
                      <Sparkles className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-sm text-white/50">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-base sm:text-lg ${index <= currentStep ? 'text-white font-medium' : 'text-white/50'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bloco: Identificação do Usuário */}
      <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="max-w-3xl mx-auto">
          <div className="animate-in fade-in duration-600 delay-200 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.primary}20` }}>
                <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">Seu perfil capilar está sendo mapeado</h3>
                <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                  Pessoas com um perfil semelhante ao seu geralmente apresentam padrões específicos de saúde capilar. Estamos identificando características únicas que podem influenciar os resultados do seu tratamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Micro-preview do Resultado */}
      <div className="container mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="max-w-3xl mx-auto">
          <div className="animate-in fade-in duration-600 delay-400 border-l-4 rounded-r-2xl p-6 sm:p-8 bg-white/5 backdrop-blur-sm" style={{ borderColor: colors.primary }}>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
              <span className="font-bold" style={{ color: colors.primary }}>⚠️ Identificamos um ponto crítico</span> que pode estar impactando seus resultados
            </p>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              Sua rotina atual pode estar limitando a evolução do seu cabelo. O diagnóstico completo revelará os ajustes necessários.
            </p>
          </div>
        </div>
      </div>

      {/* Preparação Final */}
      <div className="container mx-auto px-4 sm:px-6 mb-16 sm:mb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-in fade-in duration-600 delay-600 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-white/10 to-transparent border border-white/10">
            <Sparkles className="w-10 h-10 mx-auto mb-4 animate-pulse" style={{ color: colors.primary }} />
            <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">Seu resultado completo está quase pronto…</h3>
            <p className="text-sm sm:text-base text-white/70">
              Estamos finalizando a análise personalizada do seu perfil capilar
            </p>
          </div>
        </div>
      </div>

      {/* Seção Antes e Depois - Carrossel Horizontal */}
      <div className="py-12 sm:py-16">
        <div className="animate-in fade-in duration-800 delay-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 px-4 uppercase">Antes & Depois</h2>

          <HorizontalFeed />
        </div>
      </div>

      {/* Seção Depoimentos */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="animate-in fade-in duration-800 delay-400">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">O Que Dizem Sobre a Transformação</h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {depoimentos.map((depoimento, index) => (
              <div
                key={depoimento.id}
                className="animate-in fade-in zoom-in-95 duration-500 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Foto de perfil */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={depoimento.foto}
                      alt={depoimento.nome}
                      className="w-12 h-12 rounded-full object-cover border-2"
                      style={{ borderColor: colors.primary }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{depoimento.nome}</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" style={{ color: colors.primary }} />
                      <span className="text-xs text-white/50">Cliente Verificada</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: colors.primary }} />
                  <p className="text-sm sm:text-base text-white/80 italic leading-relaxed">
                    "{depoimento.texto}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-600">
          <Link href="/planos-femininos">
            <button
              style={{ backgroundColor: colors.primary }}
              className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 uppercase text-white"
            >
              Continuar para o próximo passo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

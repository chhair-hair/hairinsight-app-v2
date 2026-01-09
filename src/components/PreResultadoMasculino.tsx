'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import Image from 'next/image';

export default function PreResultadoMasculino() {
  const router = useRouter();
  const { updateQuizData, isAdmin } = useQuiz();

  // FORÇAR cores roxas masculinas (não depender do getThemeColors)
  const colors = {
    primary: '#9333EA',
    primaryLight: '#A855F7',
    primaryDark: '#7E22CE',
  };

  // Marca o quiz como concluído quando chegar nesta página (exceto admin)
  useEffect(() => {
    if (!isAdmin) {
      console.log('✅ Usuário chegou no pré-resultado masculino - Marcando quiz como concluído');
      updateQuizData({ hasCompletedQuiz: true });
    } else {
      console.log('🔓 Admin acessando pré-resultado masculino - não marca quiz como concluído');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const cards = [
    {
      id: 1,
      titulo: 'Cabelo Liso Masculino',
      imagemAntes: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2700e0b6-2cdd-4d9f-9117-6412b559d62f.jpg',
      imagemDepois: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/239cb0fd-2299-4d84-b617-59805440f0aa.jpg'
    },
    {
      id: 2,
      titulo: 'Cabelo Ondulado Masculino',
      imagemAntes: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5759a164-9cfb-4f78-b273-c7138ad5fe1d.jpg',
      imagemDepois: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/86aa724f-29c4-4cea-90aa-88966099aede.jpg'
    },
    {
      id: 3,
      titulo: 'Cabelo Cacheado Masculino',
      imagemAntes: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/737b7de6-fead-431f-81e5-510a650b74a8.jpg',
      imagemDepois: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2d792aff-d170-48e0-acf8-326335d55457.jpg'
    },
    {
      id: 4,
      titulo: 'Cabelo Crespo Masculino',
      imagemAntes: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/c342a145-1225-4bf5-b886-fa1f1eb8de21.jpg',
      imagemDepois: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/6d3df602-f0ac-4ccc-b014-472a6c7f2863.jpg'
    }
  ];

  const depoimentos = [
    {
      id: 1,
      texto: 'Minha confiança mudou completamente após seguir a rotina. Nunca pensei que teria tanto resultado em pouco tempo.',
      nome: 'Carlos M.',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces'
    },
    {
      id: 2,
      texto: 'A análise da IA foi certeira, meu cabelo mudou em 30 dias.',
      nome: 'Rafael S.',
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces'
    },
    {
      id: 3,
      texto: 'O antes e depois fala por si só. Recomendo 100%.',
      nome: 'Bruno L.',
      foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces'
    }
  ];

  // Componente de Feed Horizontal com CSS puro
  const HorizontalFeedMasculino = () => {
    const [isPaused, setIsPaused] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Aguardar um momento para o DOM estar pronto antes de iniciar animação
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 100);
      return () => clearTimeout(timer);
    }, []);

    // Duplicar cards 3x para criar loop infinito verdadeiro
    const infiniteCards = [...cards, ...cards, ...cards];

    return (
      <div className="relative w-full overflow-hidden py-8">
        <div
          className={`flex gap-6 ${isReady && !isPaused ? 'animate-scroll-horizontal' : ''}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          style={{ width: 'max-content' }}
        >
          {infiniteCards.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className="flex-shrink-0 w-[85vw] sm:w-[400px] md:w-[450px]"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm h-full">
                {/* Título do Card */}
                <div 
                  className="p-4 border-b border-white/10"
                  style={{ 
                    background: `linear-gradient(to right, ${colors.primary}15, transparent)` 
                  }}
                >
                  <h3 className="text-xl font-semibold text-center text-white">
                    {card.titulo}
                  </h3>
                </div>

                {/* Grid Antes/Depois */}
                <div className="grid grid-cols-2 gap-0">
                  {/* Antes */}
                  <div className="relative border-r border-white/10">
                    <div 
                      className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold shadow-lg text-white"
                      style={{ backgroundColor: `${colors.primaryLight}90` }}
                    >
                      ANTES
                    </div>
                    <div className="w-full h-72 bg-white/5 flex items-center justify-center relative overflow-hidden">
                      {card.imagemAntes ? (
                        <Image
                          src={card.imagemAntes}
                          alt={`${card.titulo} - Antes`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <p className="text-white/40 text-sm">Imagem Antes</p>
                      )}
                    </div>
                  </div>

                  {/* Depois */}
                  <div className="relative">
                    <div 
                      className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold shadow-lg text-white"
                      style={{ backgroundColor: `${colors.primary}90` }}
                    >
                      DEPOIS
                    </div>
                    <div className="w-full h-72 bg-white/5 flex items-center justify-center relative overflow-hidden">
                      {card.imagemDepois ? (
                        <Image
                          src={card.imagemDepois}
                          alt={`${card.titulo} - Depois`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <p className="text-white/40 text-sm">Imagem Depois</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div className="p-5 bg-gradient-to-b from-transparent to-white/5">
                  <p className="text-sm text-white/80 text-center leading-relaxed">
                    Transformação após rotina personalizada
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gradientes nas bordas para efeito de fade */}
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#0D0D0D] to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#0D0D0D] to-transparent pointer-events-none z-10" />
      </div>
    );
  };

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const analysisSteps = [
    'Espessura dos fios',
    'Oleosidade do couro cabeludo',
    'Possíveis causas da queda',
    'Compatibilidade com rotinas capilares'
  ];

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
          Homens reais que transformaram seus cabelos seguindo rotinas personalizadas
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
                  Homens com um perfil semelhante ao seu geralmente apresentam padrões específicos de saúde capilar. Estamos identificando características únicas que podem influenciar os resultados do seu tratamento.
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

          <HorizontalFeedMasculino />
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
                {/* Foto de Perfil */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={depoimento.foto}
                    alt={`Foto de ${depoimento.nome}`}
                    className="w-12 h-12 rounded-full object-cover border-2"
                    style={{ borderColor: colors.primary }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{depoimento.nome}</p>
                    <p className="text-xs text-white/50">Cliente Verificado</p>
                  </div>
                </div>

                {/* Texto do Depoimento */}
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
          <button
            onClick={() => router.push('/planos-masculinos')}
            className="group inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 uppercase text-white"
            style={{ backgroundColor: colors.primary }}
          >
            Continuar para o próximo passo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

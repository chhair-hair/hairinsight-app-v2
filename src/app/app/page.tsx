'use client';

import { useRoutine } from '@/lib/routine-context';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, Home, Calendar, User, Settings, TrendingUp, Droplets, Wind, Clock, ShoppingBag, CheckCircle2, Package, Play, X, ChevronRight, Timer, Info, ArrowLeft, Pause } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RoutineHistory {
  id: string;
  date: Date;
  type: 'morning' | 'night';
  completedSteps: number;
  totalSteps: number;
  duration: number; // em segundos
}

export default function AppPage() {
  const router = useRouter();
  const { userRoutine, generateMockRoutine } = useRoutine();
  const { quizData, getThemeColors } = useQuiz();
  const [activeTab, setActiveTab] = useState<'inicio' | 'rotina' | 'perfil' | 'config' | 'historico'>('inicio');
  const [showUpdateAnalysisModal, setShowUpdateAnalysisModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [showRoutineGuide, setShowRoutineGuide] = useState(false);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const [isRunningRoutine, setIsRunningRoutine] = useState(false);
  const [currentStepTimer, setCurrentStepTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [routineHistory, setRoutineHistory] = useState<RoutineHistory[]>([]);
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  // Gerar rotina mock ao carregar a página se não existir
  useEffect(() => {
    if (!userRoutine) {
      generateMockRoutine();
    }
  }, [userRoutine, generateMockRoutine]);

  // Detectar se voltou da reanálise com sucesso
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('updated') === 'true') {
        setShowSuccessCard(true);
        // Remove o parâmetro da URL
        window.history.replaceState({}, '', '/app');
        // Recarrega a rotina com os novos dados
        generateMockRoutine();
        // Fecha o card após 5 segundos
        setTimeout(() => {
          setShowSuccessCard(false);
        }, 5000);
      }
    }
  }, []);

  const handleTabClick = (tab: 'inicio' | 'rotina' | 'perfil' | 'config') => {
    setActiveTab(tab);
  };

  const handleAnalyzeClick = () => {
    setShowUpdateAnalysisModal(true);
  };

  const handleRedoQuiz = () => {
    setShowUpdateAnalysisModal(false);
    // Redireciona baseado no gênero para a reanálise correta
    if (quizData.gender === 'masculino') {
      router.push('/reanalise-masculina');
    } else {
      router.push('/reanalise-feminina');
    }
  };

  const handleProductsClick = () => {
    setShowComingSoonModal(true);
  };

  const handleStartRoutineGuide = () => {
    setShowRoutineGuide(true);
    setCurrentGuideStep(0);
  };

  const themeColors = getThemeColors();
  const colors = {
    primary: themeColors.primary,
    primaryLight: themeColors.primaryLight,
    primaryDark: themeColors.primaryDark,
  };

  // Carregar histórico do localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('routine-history');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setRoutineHistory(parsed.map((h: RoutineHistory) => ({ ...h, date: new Date(h.date) })));
    }
  }, []);

  // Timer para executar a rotina
  useEffect(() => {
    if (!isRunningRoutine || isPaused) return;

    const interval = setInterval(() => {
      setCurrentStepTimer((prev) => {
        const currentStep = routineGuideSteps[currentGuideStep];
        if (prev >= currentStep.duration) {
          // Avança automaticamente para o próximo passo
          if (currentGuideStep < routineGuideSteps.length - 1) {
            setCurrentGuideStep(currentGuideStep + 1);
            return 0;
          } else {
            // Rotina completa!
            handleCompleteRoutine();
            return 0;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunningRoutine, isPaused, currentGuideStep, currentStepTimer]);

  const handleCompleteRoutine = () => {
    const newHistory: RoutineHistory = {
      id: Date.now().toString(),
      date: new Date(),
      type: 'morning', // Você pode adicionar lógica para detectar manhã/noite
      completedSteps: routineGuideSteps.length,
      totalSteps: routineGuideSteps.length,
      duration: routineGuideSteps.reduce((acc, step) => acc + step.duration, 0),
    };

    const updatedHistory = [newHistory, ...routineHistory];
    setRoutineHistory(updatedHistory);
    localStorage.setItem('routine-history', JSON.stringify(updatedHistory));

    setIsRunningRoutine(false);
    setCurrentGuideStep(0);
    setCurrentStepTimer(0);
    setShowRoutineGuide(false);
  };

  const handleStartRoutine = () => {
    setIsRunningRoutine(true);
    setCurrentGuideStep(0);
    setCurrentStepTimer(0);
    setIsPaused(false);
    setShowRoutineGuide(true);
  };

  const handlePauseRoutine = () => {
    setIsPaused(!isPaused);
  };

  const handleExitRoutine = () => {
    setIsRunningRoutine(false);
    setShowRoutineGuide(false);
    setCurrentGuideStep(0);
    setCurrentStepTimer(0);
    setIsPaused(false);
  };

  const handleJumpToStep = (stepIndex: number) => {
    setCurrentGuideStep(stepIndex);
    setCurrentStepTimer(0);
  };

  // Mock de passos da rotina guiada
  const routineGuideSteps = [
    {
      id: 1,
      title: 'Lavagem',
      description: 'Lave o cabelo com água morna e massageie suavemente o couro cabeludo',
      duration: 180, // segundos
      illustration: '🚿',
    },
    {
      id: 2,
      title: 'Aplicação do Shampoo',
      description: 'Aplique o shampoo da raiz às pontas, fazendo movimentos circulares',
      duration: 120,
      illustration: '🧴',
    },
    {
      id: 3,
      title: 'Enxágue',
      description: 'Enxágue completamente até remover todo o produto',
      duration: 90,
      illustration: '💧',
    },
    {
      id: 4,
      title: 'Condicionador',
      description: 'Aplique o condicionador do meio às pontas, evitando a raiz',
      duration: 150,
      illustration: '✨',
    },
    {
      id: 5,
      title: 'Finalização',
      description: 'Enxágue com água fria para selar as cutículas e dar brilho',
      duration: 60,
      illustration: '🌟',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-24">
      {/* Header Minimalista */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-[#0D0D0D]/95 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold">HairInsight</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile First */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Tab: Início */}
        {activeTab === 'inicio' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Sua Rotina Personalizada
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Baseada em análise inteligente do seu tipo de cabelo e necessidades específicas
              </p>
            </div>

            {/* Análise da IA - Com dados reais */}
            {userRoutine && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Resumo da Sua Análise</h3>
                    <p className="text-white/60 text-sm">Atualizada em {new Date(userRoutine.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                {/* Cards de Análise - Dados Reais */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-3">
                      <Wind className="w-6 h-6" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-lg">Tipo de Cabelo</h4>
                    </div>
                    <p className="text-white/80 text-xl font-bold">{userRoutine.hairType}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-lg">Objetivo Principal</h4>
                    </div>
                    <p className="text-white/80 text-xl font-bold">{userRoutine.mainGoal}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-3">
                      <Droplets className="w-6 h-6" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-lg">Tendência</h4>
                    </div>
                    <p className="text-white/80 text-xl font-bold">{userRoutine.tendency}</p>
                  </div>
                </div>

                {/* Resumo da Rotina */}
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                  <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6" style={{ color: colors.primary }} />
                    Resumo da Rotina Diária
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">☀️</span> Manhã
                      </h5>
                      <ul className="space-y-2">
                        {userRoutine.morningRoutine.map((step) => (
                          <li key={step.id} className="flex items-start gap-2 text-white/80">
                            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                            <span>{step.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">🌙</span> Noite
                      </h5>
                      <ul className="space-y-2">
                        {userRoutine.nightRoutine.map((step) => (
                          <li key={step.id} className="flex items-start gap-2 text-white/80">
                            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                            <span>{step.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <h4 className="font-bold text-xl mb-4">Atualizar Análise</h4>
                <p className="text-white/60 mb-6">
                  Refaça a análise para atualizar sua rotina com base em novas informações.
                </p>
                <button
                  onClick={handleAnalyzeClick}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{ backgroundColor: colors.primary }}
                >
                  Fazer Análise Agora
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <h4 className="font-bold text-xl mb-4">Produtos Recomendados</h4>
                <p className="text-white/60 mb-6">
                  {userRoutine ? `${userRoutine.allRecommendedProducts.length} tipos de produtos selecionados para você` : 'Produtos específicos para seu tipo de cabelo'}
                </p>
                <button
                  onClick={handleProductsClick}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Ver Produtos
                </button>
              </div>
            </div>

            {/* Sua Rotina de Hoje */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-sm mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Rotina de Hoje</h3>
                  <p className="text-white/60 text-sm">Siga o passo a passo personalizado</p>
                </div>
              </div>

              {/* Informações da rotina - PRIMEIRO */}
              <div className="mb-6 space-y-4">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">☀️</div>
                    <div>
                      <h4 className="font-bold text-lg">Rotina da Manhã</h4>
                      <p className="text-white/60 text-sm">Passos para começar o dia</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {userRoutine?.morningRoutine.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-3 text-sm">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: colors.primary }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white/90">{step.title}</p>
                          {step.duration && (
                            <p className="text-white/50 text-xs">{step.duration}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">🌙</div>
                    <div>
                      <h4 className="font-bold text-lg">Rotina da Noite</h4>
                      <p className="text-white/60 text-sm">Cuidados antes de dormir</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {userRoutine?.nightRoutine.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-3 text-sm">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: colors.primary }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-white/90">{step.title}</p>
                          {step.duration && (
                            <p className="text-white/50 text-xs">{step.duration}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botão de iniciar - DEPOIS */}
              <button
                onClick={handleStartRoutine}
                className="w-full px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
                  boxShadow: `0 10px 30px -10px ${colors.primary}80`
                }}
              >
                <Play className="w-6 h-6" />
                <span className="text-lg">Iniciar Rotina</span>
              </button>

              <p className="text-white/50 text-sm text-center mt-4">
                Um timer interativo vai te guiar em cada etapa
              </p>
            </div>
          </div>
        )}

        {/* Tab: Rotina */}
        {activeTab === 'rotina' && userRoutine && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sua Rotina Completa</h2>
              <p className="text-white/60 text-lg">Siga os passos abaixo para resultados incríveis</p>
            </div>

            {/* Rotina da Manhã */}
            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">☀️</span>
                Rotina da Manhã
              </h3>
              <div className="space-y-6">
                {userRoutine.morningRoutine.map((step, index) => (
                  <div key={step.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-xl">{step.title}</h4>
                          {step.duration && (
                            <span className="flex items-center gap-1 text-white/60 text-sm">
                              <Clock className="w-4 h-4" />
                              {step.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 mb-4">{step.description}</p>
                        {step.recommendedProducts.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-white/60 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Tipos de produtos recomendados:
                            </p>
                            {step.recommendedProducts.map((product) => (
                              <div key={product.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="font-semibold text-lg mb-1">{product.genericName}</p>
                                <p className="text-sm text-white/70 mb-2">
                                  <span className="font-medium">Objetivo:</span> {product.mainGoal}
                                </p>
                                <p className="text-sm text-white/60">
                                  <span className="font-medium">Ativos ideais:</span> {product.keyIngredients.join(', ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rotina da Noite */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🌙</span>
                Rotina da Noite
              </h3>
              <div className="space-y-6">
                {userRoutine.nightRoutine.map((step, index) => (
                  <div key={step.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-xl">{step.title}</h4>
                          {step.duration && (
                            <span className="flex items-center gap-1 text-white/60 text-sm">
                              <Clock className="w-4 h-4" />
                              {step.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 mb-4">{step.description}</p>
                        {step.recommendedProducts.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-white/60 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Tipos de produtos recomendados:
                            </p>
                            {step.recommendedProducts.map((product) => (
                              <div key={product.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="font-semibold text-lg mb-1">{product.genericName}</p>
                                <p className="text-sm text-white/70 mb-2">
                                  <span className="font-medium">Objetivo:</span> {product.mainGoal}
                                </p>
                                <p className="text-sm text-white/60">
                                  <span className="font-medium">Ativos ideais:</span> {product.keyIngredients.join(', ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista Completa de Produtos Recomendados */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShoppingBag className="w-7 h-7" style={{ color: colors.primary }} />
                Todos os Produtos Recomendados
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {userRoutine.allRecommendedProducts.map((product) => (
                  <div key={product.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="mb-4">
                      <h4 className="font-bold text-lg mb-2">{product.genericName}</h4>
                      <p className="text-sm text-white/70 mb-3">
                        <span className="font-medium">Objetivo:</span> {product.mainGoal}
                      </p>
                      <p className="text-sm text-white/60 mb-3">{product.description}</p>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-xs font-semibold text-white/50 mb-1">Ativos ideais:</p>
                        <p className="text-sm text-white/80">{product.keyIngredients.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão Clicável - Produtos em Breve */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center">
                <p className="text-white/80 mb-4 text-lg">
                  Estamos preparando uma seleção especial de produtos compatíveis com sua rotina.
                </p>
                <button
                  onClick={handleProductsClick}
                  className="px-8 py-4 rounded-xl font-semibold bg-white/10 text-white/80 border border-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  Produtos compatíveis serão disponibilizados em breve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Perfil */}
        {activeTab === 'perfil' && userRoutine && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Seu Perfil Capilar</h2>
              <p className="text-white/60 text-lg">Informações baseadas na sua análise</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tipo de Cabelo */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Wind className="w-8 h-8" style={{ color: colors.primary }} />
                  <h3 className="text-2xl font-bold">Tipo de Cabelo</h3>
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">{userRoutine.hairType}</p>
                <p className="text-white/60">
                  Seu cabelo possui características específicas que requerem cuidados personalizados.
                </p>
              </div>

              {/* Objetivo Principal */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8" style={{ color: colors.primary }} />
                  <h3 className="text-2xl font-bold">Objetivo Principal</h3>
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">{userRoutine.mainGoal}</p>
                <p className="text-white/60">
                  Foco principal da sua rotina capilar personalizada.
                </p>
              </div>

              {/* Nível de Dano */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Droplets className="w-8 h-8" style={{ color: colors.primary }} />
                  <h3 className="text-2xl font-bold">Nível de Dano</h3>
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">{userRoutine.damageLevel}</p>
                <p className="text-white/60">
                  Estado atual dos seus fios e necessidade de tratamento.
                </p>
              </div>

              {/* Tendência */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8" style={{ color: colors.primary }} />
                  <h3 className="text-2xl font-bold">Tendência</h3>
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">{userRoutine.tendency}</p>
                <p className="text-white/60">
                  Características predominantes que precisam de atenção especial.
                </p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">Estatísticas da Rotina</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                    {userRoutine.morningRoutine.length}
                  </p>
                  <p className="text-white/60">Passos pela Manhã</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                    {userRoutine.nightRoutine.length}
                  </p>
                  <p className="text-white/60">Passos à Noite</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                    {userRoutine.allRecommendedProducts.length}
                  </p>
                  <p className="text-white/60">Tipos de Produtos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Histórico */}
        {activeTab === 'historico' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Histórico de Rotinas</h2>
              <p className="text-white/60 text-lg">Acompanhe suas rotinas concluídas</p>
            </div>

            {routineHistory.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <div className="text-6xl mb-6">📋</div>
                <h3 className="text-xl font-bold mb-3">Nenhuma rotina concluída ainda</h3>
                <p className="text-white/60 mb-6">
                  Complete sua primeira rotina para começar seu histórico
                </p>
                <button
                  onClick={() => setActiveTab('inicio')}
                  className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: colors.primary }}
                >
                  Ir para Início
                </button>
              </div>
            ) : (
              <>
                {/* Estatísticas */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center">
                    <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                      {routineHistory.length}
                    </p>
                    <p className="text-white/60">Rotinas Completas</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center">
                    <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                      {routineHistory.filter(h => h.type === 'morning').length}
                    </p>
                    <p className="text-white/60">Rotinas da Manhã</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center">
                    <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                      {routineHistory.filter(h => h.type === 'night').length}
                    </p>
                    <p className="text-white/60">Rotinas da Noite</p>
                  </div>
                </div>

                {/* Lista de Histórico */}
                <div className="space-y-4">
                  {routineHistory.map((history) => (
                    <div
                      key={history.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                            style={{ backgroundColor: `${colors.primary}30` }}
                          >
                            {history.type === 'morning' ? '☀️' : '🌙'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-2">
                              Rotina {history.type === 'morning' ? 'da Manhã' : 'da Noite'}
                            </h4>
                            <div className="flex flex-wrap gap-4 text-sm text-white/60">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(history.date).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {Math.floor(history.duration / 60)} min
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {history.completedSteps}/{history.totalSteps} passos
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="px-4 py-2 rounded-lg text-sm font-bold"
                          style={{ backgroundColor: `${colors.primary}30`, color: colors.primary }}
                        >
                          Completa
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab: Config */}
        {activeTab === 'config' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Configurações</h2>
              <p className="text-white/60 text-lg">Personalize sua experiência</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Preferências</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Notificações de Rotina</p>
                    <p className="text-sm text-white/60">Receba lembretes para seguir sua rotina</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
                    Ativar
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Modo Escuro</p>
                    <p className="text-sm text-white/60">Interface com tema escuro</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
                    Ativo
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Idioma</p>
                    <p className="text-sm text-white/60">Português (Brasil)</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
                    Alterar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Conta</h3>
              <div className="space-y-4">
                <button className="w-full p-4 bg-white/5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-left">
                  <p className="font-semibold">Editar Perfil</p>
                  <p className="text-sm text-white/60">Atualize suas informações pessoais</p>
                </button>
                <button className="w-full p-4 bg-white/5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-left">
                  <p className="font-semibold">Privacidade</p>
                  <p className="text-sm text-white/60">Gerencie suas preferências de privacidade</p>
                </button>
                <button className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 active:scale-95 transition-all text-left">
                  <p className="font-semibold text-red-400">Sair da Conta</p>
                  <p className="text-sm text-white/60">Desconectar do aplicativo</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Atualizar Análise */}
      {showUpdateAnalysisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0D0D] border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Atualizar Análise</h3>
              </div>
              <button
                onClick={() => setShowUpdateAnalysisModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-white/80 mb-6 text-lg leading-relaxed">
              Você pode refazer a análise do seu cabelo a qualquer momento. Isso atualizará sua rotina personalizada com base nas suas novas respostas.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 mt-1 flex-shrink-0" style={{ color: colors.primary }} />
                <div>
                  <p className="font-semibold mb-2">O que vai acontecer:</p>
                  <ul className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Você vai responder o questionário novamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Uma nova análise será gerada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Sua rotina será atualizada automaticamente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowUpdateAnalysisModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleRedoQuiz}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: colors.primary }}
              >
                Refazer Análise
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Funcionalidade em Breve */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0D0D] border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Em Breve</h3>
              </div>
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center py-6">
              <div className="text-6xl mb-6">🚀</div>
              <p className="text-white/80 mb-4 text-lg leading-relaxed">
                Estamos trabalhando para trazer uma seleção incrível de produtos compatíveis com sua rotina!
              </p>
              <p className="text-white/60 text-sm">
                Em breve você poderá comprar produtos específicos recomendados para seu tipo de cabelo.
              </p>
            </div>

            <button
              onClick={() => setShowComingSoonModal(false)}
              className="w-full px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: colors.primary }}
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {/* Card de Sucesso - Reanálise Concluída */}
      {showSuccessCard && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-top duration-500">
          <div
            className="bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl p-6 shadow-2xl backdrop-blur-lg"
            style={{
              boxShadow: `0 20px 40px -10px ${colors.primary}40`
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.primary }}
              >
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">Rotina Atualizada!</h3>
                <p className="text-white/80 text-sm">
                  Suas informações foram analisadas com sucesso e sua rotina foi atualizada com base nas novas respostas.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessCard(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-all active:scale-95 flex-shrink-0"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {!showRoutineGuide && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-lg border-t border-white/10">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-around">
              <button
                onClick={() => setActiveTab('inicio')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  activeTab === 'inicio' ? 'scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Home
                  className="w-6 h-6"
                  style={{ color: activeTab === 'inicio' ? colors.primary : '#ffffff' }}
                />
                <span className="text-xs font-semibold">Início</span>
              </button>

              <button
                onClick={() => setActiveTab('rotina')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  activeTab === 'rotina' ? 'scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Calendar
                  className="w-6 h-6"
                  style={{ color: activeTab === 'rotina' ? colors.primary : '#ffffff' }}
                />
                <span className="text-xs font-semibold">Rotina</span>
              </button>

              <button
                onClick={() => setActiveTab('historico')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  activeTab === 'historico' ? 'scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Clock
                  className="w-6 h-6"
                  style={{ color: activeTab === 'historico' ? colors.primary : '#ffffff' }}
                />
                <span className="text-xs font-semibold">Histórico</span>
              </button>

              <button
                onClick={() => setActiveTab('perfil')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  activeTab === 'perfil' ? 'scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <User
                  className="w-6 h-6"
                  style={{ color: activeTab === 'perfil' ? colors.primary : '#ffffff' }}
                />
                <span className="text-xs font-semibold">Perfil</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  activeTab === 'config' ? 'scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Settings
                  className="w-6 h-6"
                  style={{ color: activeTab === 'config' ? colors.primary : '#ffffff' }}
                />
                <span className="text-xs font-semibold">Config</span>
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Tela Fullscreen: Executar Rotina com Timer Circular */}
      {showRoutineGuide && isRunningRoutine && (
        <div className="fixed inset-0 z-50 bg-[#0D0D0D] overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-[#0D0D0D]/95 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-2xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleExitRoutine}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95 flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-semibold">Sair</span>
                </button>
                <div className="flex items-center gap-2">
                  <div
                    className="px-3 py-1.5 rounded-lg text-sm font-bold"
                    style={{ backgroundColor: `${colors.primary}30`, color: colors.primary }}
                  >
                    {currentGuideStep + 1}/{routineGuideSteps.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto px-4 py-8">
            {/* Timer Circular */}
            <div className="flex flex-col items-center justify-center mb-12">
              <div className="relative w-64 h-64 mb-8">
                {/* Círculo de fundo */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="#ffffff10"
                    strokeWidth="12"
                    fill="none"
                  />
                  {/* Círculo de progresso (anti-horário) */}
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke={colors.primary}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - currentStepTimer / routineGuideSteps[currentGuideStep].duration)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>

                {/* Tempo no centro */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold mb-2">
                    {Math.floor((routineGuideSteps[currentGuideStep].duration - currentStepTimer) / 60)}:
                    {((routineGuideSteps[currentGuideStep].duration - currentStepTimer) % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-white/60 text-sm">restantes</p>
                </div>
              </div>

              {/* Ilustração e Título */}
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">
                  {routineGuideSteps[currentGuideStep].illustration}
                </div>
                <h2 className="text-3xl font-bold mb-3">
                  {routineGuideSteps[currentGuideStep].title}
                </h2>
                <p className="text-white/80 text-lg leading-relaxed max-w-md mx-auto">
                  {routineGuideSteps[currentGuideStep].description}
                </p>
              </div>

              {/* Botão Começar Agora / Pausar */}
              <button
                onClick={handlePauseRoutine}
                className="px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                style={{ backgroundColor: colors.primary }}
              >
                {isPaused ? (
                  <>
                    <Play className="w-6 h-6" />
                    <span className="text-lg">Continuar</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-6 h-6" />
                    <span className="text-lg">Pausar</span>
                  </>
                )}
              </button>
            </div>

            {/* Navegação entre etapas */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <h3 className="font-bold text-lg mb-4 text-center">Todas as Etapas</h3>
              <div className="grid grid-cols-5 gap-3">
                {routineGuideSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => handleJumpToStep(index)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                      index === currentGuideStep
                        ? 'scale-110 shadow-lg'
                        : 'hover:scale-105 opacity-60 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: index === currentGuideStep ? colors.primary : '#ffffff10',
                    }}
                  >
                    <span className="text-2xl">{step.illustration}</span>
                    <span className="text-xs font-bold">{index + 1}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Progresso geral */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-white/60">Progresso da Rotina</span>
                <span className="text-sm font-bold" style={{ color: colors.primary }}>
                  {Math.round((currentGuideStep / routineGuideSteps.length) * 100)}%
                </span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(currentGuideStep / routineGuideSteps.length) * 100}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

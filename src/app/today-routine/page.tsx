'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { useRoutine, type RoutineStep } from '@/lib/routine-context';
import AppHeader from '@/components/custom/app-header';
import {
  Clock,
  CheckCircle2,
  Circle,
  ArrowLeft,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
} from 'lucide-react';

export default function TodayRoutinePage() {
  const router = useRouter();
  const { quizData, getThemeColors } = useQuiz();
  const { userRoutine, generateMockRoutine } = useRoutine();
  const colors = getThemeColors();

  // Estado do período selecionado
  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'night' | null>(null);
  const [showPeriodModal, setShowPeriodModal] = useState(false);

  // Estados da rotina em execução
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentStepTime, setCurrentStepTime] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);

  // Gerar rotina ao carregar
  useEffect(() => {
    if (!userRoutine) {
      generateMockRoutine();
    }
  }, [userRoutine, generateMockRoutine]);

  // Timer individual da etapa atual
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setCurrentStepTime((prev) => prev + 1);
        setTotalElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Verificar se tem dados do quiz
  if (!quizData.hairType || !quizData.scalpType) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <AppHeader accentColor={colors.primary} />
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-3xl font-bold mb-4">Complete o Quiz Primeiro</h1>
            <p className="text-white/60 mb-8">
              Para ver sua rotina personalizada, você precisa completar o quiz de análise capilar.
            </p>
            <button
              onClick={() => router.push('/quiz')}
              className="px-8 py-4 rounded-xl font-bold transition-all"
              style={{ backgroundColor: colors.primary }}
            >
              Fazer Quiz Agora
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Aguardando geração da rotina
  if (!userRoutine) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Carregando sua rotina personalizada...</p>
        </div>
      </div>
    );
  }

  // Se não selecionou período ainda, mostrar seleção
  if (!selectedPeriod) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white">
        <AppHeader accentColor={colors.primary} />

        <main className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => router.push('/app')}
              className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>

            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${colors.primary}30` }}>
                <Sparkles className="w-10 h-10" style={{ color: colors.primary }} />
              </div>
              <h1 className="text-3xl font-bold mb-3">Iniciar Rotina Capilar</h1>
              <p className="text-white/70 text-lg">
                Escolha qual rotina você quer fazer agora
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Rotina da Manhã */}
              <button
                onClick={() => {
                  setSelectedPeriod('morning');
                  setCurrentStepIndex(0);
                  setCompletedSteps([]);
                  setCurrentStepTime(0);
                  setTotalElapsedTime(0);
                }}
                className="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border-2 border-orange-500/30 rounded-2xl p-6 hover:scale-105 transition-all text-left group"
              >
                <div className="text-5xl mb-4">☀️</div>
                <h3 className="text-2xl font-bold mb-2">Rotina da Manhã</h3>
                <p className="text-white/70 mb-4">
                  {userRoutine.morningRoutine.length} etapas
                </p>
                <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm">Começar agora</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Rotina da Noite */}
              <button
                onClick={() => {
                  setSelectedPeriod('night');
                  setCurrentStepIndex(0);
                  setCompletedSteps([]);
                  setCurrentStepTime(0);
                  setTotalElapsedTime(0);
                }}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 rounded-2xl p-6 hover:scale-105 transition-all text-left group"
              >
                <div className="text-5xl mb-4">🌙</div>
                <h3 className="text-2xl font-bold mb-2">Rotina da Noite</h3>
                <p className="text-white/70 mb-4">
                  {userRoutine.nightRoutine.length} etapas
                </p>
                <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="text-sm">Começar agora</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Preview das rotinas */}
            <div className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="font-bold text-lg mb-4">O que está incluído?</h3>

              <div className="space-y-4">
                {/* Manhã */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">☀️</span>
                    <h4 className="font-semibold">Manhã</h4>
                  </div>
                  <div className="space-y-1 pl-7">
                    {userRoutine.morningRoutine.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-2 text-sm text-white/70">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${colors.primary}30`, color: colors.primary }}>
                          {index + 1}
                        </div>
                        <span>{step.title}</span>
                        {step.duration && <span className="text-white/50">({step.duration})</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Noite */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌙</span>
                    <h4 className="font-semibold">Noite</h4>
                  </div>
                  <div className="space-y-1 pl-7">
                    {userRoutine.nightRoutine.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-2 text-sm text-white/70">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${colors.primary}30`, color: colors.primary }}>
                          {index + 1}
                        </div>
                        <span>{step.title}</span>
                        {step.duration && <span className="text-white/50">({step.duration})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Rotina selecionada
  const activeRoutine = selectedPeriod === 'morning' ? userRoutine.morningRoutine : userRoutine.nightRoutine;
  const currentStep = activeRoutine[currentStepIndex];
  const progress = (completedSteps.length / activeRoutine.length) * 100;

  const handleNextStep = () => {
    if (currentStepIndex < activeRoutine.length - 1) {
      // Marca etapa atual como completa
      if (!completedSteps.includes(currentStepIndex)) {
        setCompletedSteps([...completedSteps, currentStepIndex]);
      }

      // Avança para próxima etapa
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentStepTime(0);
      setIsTimerRunning(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentStepTime(0);
      setIsTimerRunning(false);
    }
  };

  const handleCompleteRoutine = () => {
    // Marca a última etapa como completa
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }

    // Salvar no histórico
    const history = JSON.parse(localStorage.getItem('routine-history') || '[]');
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: selectedPeriod,
      completedSteps: activeRoutine.length,
      totalSteps: activeRoutine.length,
      duration: totalElapsedTime,
    };

    history.unshift(newEntry);
    localStorage.setItem('routine-history', JSON.stringify(history));

    // Mostrar modal de conclusão
    setShowPeriodModal(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastStep = currentStepIndex === activeRoutine.length - 1;
  const isCompleted = completedSteps.length === activeRoutine.length;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <AppHeader accentColor={colors.primary} />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                setSelectedPeriod(null);
                setIsTimerRunning(false);
              }}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Trocar Período
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedPeriod === 'morning' ? '☀️' : '🌙'}</span>
              <span className="font-bold">{selectedPeriod === 'morning' ? 'Manhã' : 'Noite'}</span>
            </div>
          </div>

          {/* Card Principal - Etapa Atual */}
          <div
            className="rounded-3xl p-6 mb-6 border-2"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryDark}10)`,
              borderColor: colors.primary,
            }}
          >
            {/* Indicador de progresso */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/70">
                Etapa {currentStepIndex + 1} de {activeRoutine.length}
              </span>
              <span className="text-sm font-bold" style={{ color: colors.primary }}>
                {Math.round(progress)}% completo
              </span>
            </div>

            {/* Barra de progresso */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: colors.primary,
                }}
              />
            </div>

            <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
            <p className="text-white/80 mb-6 text-lg leading-relaxed">{currentStep.description}</p>

            {/* Timer Circular */}
            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative w-48 h-48 mb-6">
                {/* Círculo de fundo */}
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#ffffff10"
                    strokeWidth="10"
                    fill="none"
                  />
                  {/* Círculo de progresso */}
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke={colors.primary}
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 88}`}
                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - (currentStepTime % 3600) / 3600)}`}
                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                  />
                </svg>

                {/* Tempo no centro */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold">{formatTime(currentStepTime)}</div>
                  <p className="text-white/50 text-sm">etapa atual</p>
                </div>
              </div>

              {/* Botões de controle */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: colors.primary }}
                >
                  {isTimerRunning ? (
                    <>
                      <Pause className="w-5 h-5" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      {currentStepTime > 0 ? 'Continuar' : 'Iniciar'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCurrentStepTime(0)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  Resetar
                </button>
              </div>

              {/* Tempo total */}
              <div className="text-center">
                <p className="text-white/50 text-sm">Tempo total da rotina</p>
                <p className="text-xl font-bold" style={{ color: colors.primary }}>
                  {formatTime(totalElapsedTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Produtos recomendados para esta etapa */}
          {currentStep.recommendedProducts && currentStep.recommendedProducts.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
              <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
                Produtos para esta etapa
              </h3>
              <div className="space-y-3">
                {currentStep.recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <h4 className="font-bold mb-1">{product.genericName}</h4>
                    <p className="text-sm text-white/70 mb-2">{product.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {product.keyIngredients.map((ingredient, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-lg bg-white/10"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navegação entre etapas */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Etapa Anterior
            </button>

            {!isLastStep ? (
              <button
                onClick={handleNextStep}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: colors.primary }}
              >
                Próxima Etapa
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleCompleteRoutine}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ backgroundColor: colors.primary }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Concluir Rotina
              </button>
            )}
          </div>

          {/* Lista de todas as etapas */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4" style={{ color: colors.primary }}>
              Todas as Etapas
            </h3>
            <div className="space-y-2">
              {activeRoutine.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isCurrent = index === currentStepIndex;

                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setCurrentStepIndex(index);
                      setCurrentStepTime(0);
                      setIsTimerRunning(false);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-white/10 border-white/30 scale-105'
                        : isCompleted
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : isCurrent ? (
                          <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: colors.primary }}></div>
                        ) : (
                          <Circle className="w-6 h-6 text-white/30" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm" style={{ color: isCurrent ? colors.primary : 'inherit' }}>
                            {index + 1}. {step.title}
                          </span>
                        </div>
                        <p className="text-sm text-white/60">{step.description}</p>
                      </div>
                      {step.duration && (
                        <span className="text-xs text-white/50">{step.duration}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Conclusão */}
      {showPeriodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0D0D0D] border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${colors.primary}30` }}>
                <CheckCircle2 className="w-10 h-10" style={{ color: colors.primary }} />
              </div>

              <h2 className="text-3xl font-bold mb-3">Rotina Concluída! 🎉</h2>
              <p className="text-white/70 text-lg mb-6">
                Você completou sua rotina {selectedPeriod === 'morning' ? 'da manhã' : 'da noite'} em {formatTime(totalElapsedTime)}.
              </p>

              <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">Etapas completadas</span>
                  <span className="font-bold">{completedSteps.length}/{activeRoutine.length}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60">Tempo total</span>
                  <span className="font-bold">{formatTime(totalElapsedTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Período</span>
                  <span className="font-bold">{selectedPeriod === 'morning' ? '☀️ Manhã' : '🌙 Noite'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPeriodModal(false);
                    setSelectedPeriod(null);
                    setCurrentStepIndex(0);
                    setCompletedSteps([]);
                    setCurrentStepTime(0);
                    setTotalElapsedTime(0);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold bg-white/10 hover:bg-white/20 transition-all"
                >
                  Nova Rotina
                </button>
                <button
                  onClick={() => router.push('/app')}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{ backgroundColor: colors.primary }}
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

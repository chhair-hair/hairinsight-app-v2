'use client';

import { useRoutine } from '@/lib/routine-context';
import { formatNextRoutineDate } from '@/lib/routine-calendar';
import { useQuiz } from '@/lib/quiz-context';
import AppHeader from '@/components/custom/app-header';
import { Sparkles, Home, Calendar, User, Settings, TrendingUp, Droplets, Wind, Clock, ShoppingBag, CheckCircle2, Play, X, ChevronRight, Info } from 'lucide-react';
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

// Componente para exibir cada dia da semana
function WeekDayCard({
  dayName,
  hasRoutine,
  userRoutine,
  colors,
}: {
  dayName: string;
  hasRoutine: boolean;
  userRoutine?: any;
  colors?: { primary: string; primaryLight: string; primaryDark: string };
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:bg-white/10 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header do Card */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{
              backgroundColor: hasRoutine ? `${colors?.primary}30` : '#ffffff10',
            }}
          >
            {hasRoutine ? '💆‍♀️' : '😌'}
          </div>
          <div>
            <h3 className="text-base font-bold">{dayName}</h3>
            <p className="text-xs text-white/60">
              {hasRoutine ? 'Rotina Capilar' : 'Dia de Descanso'}
            </p>
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-white/60 transition-transform ${
            isExpanded ? 'rotate-90' : ''
          }`}
        />
      </div>

      {/* Conteúdo Expandido */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          {hasRoutine && userRoutine ? (
            <>
              {/* Rotina da Manhã */}
              <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-3">
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <span>☀️</span>
                  Rotina da Manhã
                </h4>
                <div className="space-y-2">
                  {userRoutine.morningRoutine.map((step: any, index: number) => (
                    <div key={step.id} className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <div className="flex items-start gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: colors?.primary }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-bold text-xs">{step.title}</h5>
                            {step.duration && (
                              <span className="flex items-center gap-0.5 text-white/60 text-[10px]">
                                <Clock className="w-2.5 h-2.5" />
                                {step.duration}
                              </span>
                            )}
                          </div>
                          <p className="text-white/80 text-[11px]">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rotina da Noite */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-3">
                <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                  <span>🌙</span>
                  Rotina da Noite
                </h4>
                <div className="space-y-2">
                  {userRoutine.nightRoutine.map((step: any, index: number) => (
                    <div key={step.id} className="bg-white/5 rounded-lg p-2 border border-white/10">
                      <div className="flex items-start gap-2">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: colors?.primary }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-bold text-xs">{step.title}</h5>
                            {step.duration && (
                              <span className="flex items-center gap-0.5 text-white/60 text-[10px]">
                                <Clock className="w-2.5 h-2.5" />
                                {step.duration}
                              </span>
                            )}
                          </div>
                          <p className="text-white/80 text-[11px]">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Dia de Descanso
            <div className="text-center py-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-4xl mb-3">😌</div>
              <h4 className="font-bold text-sm mb-2">Aproveite para descansar!</h4>
              <p className="text-white/60 text-xs px-4">
                Seus cabelos também precisam de um tempo para se recuperar naturalmente.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AppPage() {
  const router = useRouter();
  const { userRoutine, generateMockRoutine, todayStatus } = useRoutine();
  const { quizData, getThemeColors } = useQuiz();
  const [activeTab, setActiveTab] = useState<'inicio' | 'rotina' | 'perfil' | 'config' | 'historico'>('inicio');
  const [showUpdateAnalysisModal, setShowUpdateAnalysisModal] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-24">
      {/* Header com AppHeader */}
      <AppHeader accentColor={colors.primary} />

      {/* Main Content - Mobile First */}
      <main className="max-w-2xl mx-auto px-4 py-3 pt-20">
        {/* Tab: Início */}
        {activeTab === 'inicio' && (
          <div className="space-y-4">
            {/* Welcome Section */}
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Sua Rotina Personalizada
              </h2>
              <p className="text-white/60 text-sm max-w-2xl mx-auto">
                Baseada em análise inteligente do seu tipo de cabelo
              </p>
            </div>

            {/* Análise da IA - Com dados reais */}
            {userRoutine && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Resumo da Sua Análise</h3>
                    <p className="text-white/60 text-xs">Atualizada em {new Date(userRoutine.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                {/* Cards de Análise - Dados Reais */}
                <div className="grid md:grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Wind className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-xs">Tipo de Cabelo</h4>
                    </div>
                    <p className="text-white/80 text-sm font-bold">{userRoutine.hairType}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-xs">Objetivo Principal</h4>
                    </div>
                    <p className="text-white/80 text-sm font-bold">{userRoutine.mainGoal}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Droplets className="w-3.5 h-3.5" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-xs">Tendência</h4>
                    </div>
                    <p className="text-white/80 text-sm font-bold">{userRoutine.tendency}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {/* Novo Card: Resultado Completo */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4 hover:scale-105 transition-all cursor-pointer" onClick={() => router.push('/resultado-completo')}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" style={{ color: colors.primary }} />
                  <h4 className="font-bold text-sm">Resultado Completo</h4>
                </div>
                <p className="text-white/80 text-xs mb-3">
                  Veja sua análise detalhada, pontos críticos e calendário personalizado
                </p>
                <button
                  className="w-full px-4 py-2 text-sm rounded-lg font-semibold transition-all bg-white/20 hover:bg-white/30 flex items-center justify-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4" />
                  Ver Detalhes
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <h4 className="font-bold text-sm mb-2">Atualizar Análise</h4>
                <p className="text-white/60 text-xs mb-3">
                  Refaça a análise para atualizar sua rotina.
                </p>
                <button
                  onClick={handleAnalyzeClick}
                  className="w-full px-4 py-2 text-sm rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: colors.primary }}
                >
                  Fazer Análise Agora
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                <h4 className="font-bold text-sm mb-2">Produtos Recomendados</h4>
                <p className="text-white/60 text-xs mb-3">
                  {userRoutine ? `${userRoutine.allRecommendedProducts.length} tipos selecionados para você` : 'Produtos específicos'}
                </p>
                <button
                  onClick={handleProductsClick}
                  className="w-full px-4 py-2 text-sm rounded-lg font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: colors.primary }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Ver Produtos
                </button>
              </div>
            </div>

            {/* Sua Rotina de Hoje - DINÂMICA */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-4 shadow-2xl backdrop-blur-sm mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {todayStatus.hasRoutine ? 'Rotina de Hoje' : 'Dia de Descanso'}
                  </h3>
                  <p className="text-white/60 text-xs">
                    {todayStatus.dayName || ' '}
                  </p>
                </div>
              </div>

              {todayStatus.hasRoutine && userRoutine ? (
                <>
                  {/* Rotina Personalizada do Quiz */}
                  <div className="space-y-3">
                    {/* Rotina da Manhã */}
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg">☀️</div>
                        <div>
                          <h4 className="font-bold text-sm">Rotina da Manhã</h4>
                          <p className="text-white/60 text-xs">Passos para começar o dia</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {userRoutine.morningRoutine.map((step, index) => (
                          <div key={step.id} className="flex items-start gap-2 text-xs">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: colors.primary }}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-white/90">{step.title}</p>
                              {step.duration && (
                                <p className="text-white/50 text-[10px]">{step.duration}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rotina da Noite */}
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-lg">🌙</div>
                        <div>
                          <h4 className="font-bold text-sm">Rotina da Noite</h4>
                          <p className="text-white/60 text-xs">Cuidados antes de dormir</p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {userRoutine.nightRoutine.map((step, index) => (
                          <div key={step.id} className="flex items-start gap-2 text-xs">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: colors.primary }}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-white/90">{step.title}</p>
                              {step.duration && (
                                <p className="text-white/50 text-[10px]">{step.duration}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Botão de iniciar */}
                    <button
                      onClick={() => router.push('/today-routine')}
                      className="w-full px-4 py-3 text-sm rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
                        boxShadow: `0 10px 30px -10px ${colors.primary}80`
                      }}
                    >
                      <Play className="w-4 h-4" />
                      <span>Iniciar Rotina</span>
                    </button>

                    <p className="text-white/50 text-xs text-center mt-2">
                      Escolha manhã ou noite e siga o cronômetro
                    </p>
                  </div>
                </>
              ) : !todayStatus.hasRoutine ? (
                <>
                  {/* Dia de Descanso */}
                  <div className="text-center py-6">
                    <div className="text-6xl mb-4">😌</div>
                    <h4 className="font-bold text-lg mb-2">Aproveite para descansar!</h4>
                    <p className="text-white/60 text-sm mb-4">
                      Hoje não há rotina programada. Seus cabelos também precisam de descanso.
                    </p>

                    {todayStatus.nextRoutineDate && (
                      <div className="bg-white/5 rounded-xl p-3 border border-white/10 inline-block">
                        <p className="text-white/80 text-xs mb-1">Próxima rotina</p>
                        <p className="font-bold" style={{ color: colors.primary }}>
                          {todayStatus.nextRoutineDayName} ({formatNextRoutineDate(todayStatus.nextRoutineDate)})
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Botão para ver calendário completo */}
                  <button
                    onClick={() => router.push('/schedule')}
                    className="w-full px-4 py-3 text-sm rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 bg-white/10 border border-white/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Ver Calendário Completo</span>
                  </button>
                </>
              ) : null}
            </div>
          </div>
        )}

        {/* Tab: Rotina */}
        {activeTab === 'rotina' && userRoutine && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Rotina Semanal</h2>
              <p className="text-white/60 text-sm">
                {quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum'
                  ? 'Frequência: 2x por semana (cabelos com química)'
                  : quizData.scalpType === 'oleoso'
                  ? 'Frequência: 3x por semana (couro cabeludo oleoso)'
                  : 'Frequência: 2x por semana (ideal para seu cabelo)'}
              </p>
            </div>

            {/* Rotina Semanal - Baseada no Perfil */}
            <div className="space-y-3">
              {/* Segunda-feira - SEMPRE TEM */}
              <WeekDayCard
                dayName="Segunda-feira"
                hasRoutine={true}
                userRoutine={userRoutine}
                colors={colors}
              />

              {/* Terça-feira - Depende do perfil */}
              <WeekDayCard
                dayName="Terça-feira"
                hasRoutine={false}
                colors={colors}
              />

              {/* Quarta-feira - Só para OLEOSO */}
              <WeekDayCard
                dayName="Quarta-feira"
                hasRoutine={quizData.scalpType === 'oleoso'}
                userRoutine={quizData.scalpType === 'oleoso' ? userRoutine : undefined}
                colors={colors}
              />

              {/* Quinta-feira - Para QUÍMICA e SECO/NORMAL */}
              <WeekDayCard
                dayName="Quinta-feira"
                hasRoutine={
                  (quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum') ||
                  quizData.scalpType !== 'oleoso'
                }
                userRoutine={
                  (quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum') ||
                  quizData.scalpType !== 'oleoso'
                    ? userRoutine
                    : undefined
                }
                colors={colors}
              />

              {/* Sexta-feira - Só para OLEOSO */}
              <WeekDayCard
                dayName="Sexta-feira"
                hasRoutine={quizData.scalpType === 'oleoso'}
                userRoutine={quizData.scalpType === 'oleoso' ? userRoutine : undefined}
                colors={colors}
              />

              {/* Sábado - SEMPRE DESCANSO */}
              <WeekDayCard
                dayName="Sábado"
                hasRoutine={false}
                colors={colors}
              />

              {/* Domingo - SEMPRE DESCANSO */}
              <WeekDayCard
                dayName="Domingo"
                hasRoutine={false}
                colors={colors}
              />
            </div>

            {/* Lista Completa de Produtos Recomendados */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-6">
              <h3 className="text-base font-bold mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" style={{ color: colors.primary }} />
                Todos os Produtos Recomendados
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {userRoutine.allRecommendedProducts.map((product) => (
                  <div key={product.id} className="bg-white/5 rounded-xl p-3 border border-white/10 hover:bg-white/10 transition-all">
                    <div>
                      <h4 className="font-bold text-sm mb-1">{product.genericName}</h4>
                      <p className="text-xs text-white/70 mb-2">
                        <span className="font-medium">Objetivo:</span> {product.mainGoal}
                      </p>
                      <p className="text-xs text-white/60 mb-2">{product.description}</p>
                      <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                        <p className="text-[10px] font-semibold text-white/50 mb-0.5">Ativos ideais:</p>
                        <p className="text-xs text-white/80">{product.keyIngredients.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão Clicável - Produtos em Breve */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-xl p-4 text-center">
                <p className="text-white/80 mb-3 text-sm">
                  Estamos preparando uma seleção especial de produtos compatíveis.
                </p>
                <button
                  onClick={handleProductsClick}
                  className="px-4 py-2 text-sm rounded-lg font-semibold bg-white/10 text-white/80 border border-white/20 transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
                >
                  Em breve: produtos compatíveis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Perfil */}
        {activeTab === 'perfil' && userRoutine && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Seu Perfil Capilar</h2>
              <p className="text-white/60 text-sm">Informações baseadas na sua análise</p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {/* Tipo de Cabelo */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="w-4 h-4" style={{ color: colors.primary }} />
                  <h3 className="text-sm font-bold">Tipo de Cabelo</h3>
                </div>
                <p className="text-white/80 text-base font-semibold mb-1">{userRoutine.hairType}</p>
                <p className="text-white/60 text-xs">
                  Características específicas que requerem cuidados personalizados.
                </p>
              </div>

              {/* Objetivo Principal */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4" style={{ color: colors.primary }} />
                  <h3 className="text-sm font-bold">Objetivo Principal</h3>
                </div>
                <p className="text-white/80 text-base font-semibold mb-1">{userRoutine.mainGoal}</p>
                <p className="text-white/60 text-xs">
                  Foco principal da sua rotina capilar.
                </p>
              </div>

              {/* Nível de Dano */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4" style={{ color: colors.primary }} />
                  <h3 className="text-sm font-bold">Nível de Dano</h3>
                </div>
                <p className="text-white/80 text-base font-semibold mb-1">{userRoutine.damageLevel}</p>
                <p className="text-white/60 text-xs">
                  Estado atual e necessidade de tratamento.
                </p>
              </div>

              {/* Tendência */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
                  <h3 className="text-sm font-bold">Tendência</h3>
                </div>
                <p className="text-white/80 text-base font-semibold mb-1">{userRoutine.tendency}</p>
                <p className="text-white/60 text-xs">
                  Características que precisam de atenção.
                </p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-4">
              <h3 className="text-base font-bold mb-3">Estatísticas da Rotina</h3>
              <div className="grid md:grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {userRoutine.morningRoutine.length}
                  </p>
                  <p className="text-white/60 text-xs">Passos pela Manhã</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {userRoutine.nightRoutine.length}
                  </p>
                  <p className="text-white/60 text-xs">Passos à Noite</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                    {userRoutine.allRecommendedProducts.length}
                  </p>
                  <p className="text-white/60 text-xs">Tipos de Produtos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Histórico */}
        {activeTab === 'historico' && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Histórico de Rotinas</h2>
              <p className="text-white/60 text-sm">Acompanhe suas rotinas concluídas</p>
            </div>

            {routineHistory.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-base font-bold mb-2">Nenhuma rotina concluída ainda</h3>
                <p className="text-white/60 text-sm mb-4">
                  Complete sua primeira rotina para começar seu histórico
                </p>
                <button
                  onClick={() => setActiveTab('inicio')}
                  className="px-4 py-2 text-sm rounded-lg font-semibold transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: colors.primary }}
                >
                  Ir para Início
                </button>
              </div>
            ) : (
              <>
                {/* Estatísticas */}
                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                      {routineHistory.length}
                    </p>
                    <p className="text-white/60 text-xs">Rotinas Completas</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                      {routineHistory.filter(h => h.type === 'morning').length}
                    </p>
                    <p className="text-white/60 text-xs">Rotinas da Manhã</p>
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold mb-1" style={{ color: colors.primary }}>
                      {routineHistory.filter(h => h.type === 'night').length}
                    </p>
                    <p className="text-white/60 text-xs">Rotinas da Noite</p>
                  </div>
                </div>

                {/* Lista de Histórico */}
                <div className="space-y-2">
                  {routineHistory.map((history) => (
                    <div
                      key={history.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                            style={{ backgroundColor: `${colors.primary}30` }}
                          >
                            {history.type === 'morning' ? '☀️' : '🌙'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1">
                              Rotina {history.type === 'morning' ? 'da Manhã' : 'da Noite'}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs text-white/60">
                              <span className="flex items-center gap-0.5">
                                <Calendar className="w-3 h-3" />
                                {new Date(history.date).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <Clock className="w-3 h-3" />
                                {Math.floor(history.duration / 60)} min
                              </span>
                              <span className="flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                {history.completedSteps}/{history.totalSteps} passos
                              </span>
                            </div>
                          </div>
                        </div>
                        <div
                          className="px-2 py-1 rounded-md text-xs font-bold"
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
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Configurações</h2>
              <p className="text-white/60 text-sm">Personalize sua experiência</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-base font-bold mb-3">Preferências</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">Notificações de Rotina</p>
                    <p className="text-xs text-white/60">Receba lembretes</p>
                  </div>
                  <button
                    onClick={() => router.push('/notificacoes')}
                    className="px-3 py-1.5 text-xs rounded-md bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
                  >
                    Configurar
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">Modo Escuro</p>
                    <p className="text-xs text-white/60">Tema escuro</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs rounded-md bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
                    Ativo
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">Idioma</p>
                    <p className="text-xs text-white/60">Português (Brasil)</p>
                  </div>
                  <button className="px-3 py-1.5 text-xs rounded-md bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
                    Alterar
                  </button>
                </div>
              </div>
            </div>

            {/* Instalar App */}
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-4">
              <h3 className="text-base font-bold mb-3">Instalar Aplicativo</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // Dispara evento customizado para o PWAInstall
                    window.dispatchEvent(new Event('trigger-pwa-install'));
                  }}
                  className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:opacity-90 active:scale-95 transition-all text-left"
                >
                  <p className="font-semibold text-sm text-white">Adicionar à Tela Inicial</p>
                  <p className="text-xs text-white/80">Instale o app para acesso rápido</p>
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <h3 className="text-base font-bold mb-3">Conta</h3>
              <div className="space-y-2">
                <button className="w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-left">
                  <p className="font-semibold text-sm">Editar Perfil</p>
                  <p className="text-xs text-white/60">Atualize suas informações</p>
                </button>
                <button className="w-full p-3 bg-white/5 rounded-lg hover:bg-white/10 active:scale-95 transition-all text-left">
                  <p className="font-semibold text-sm">Privacidade</p>
                  <p className="text-xs text-white/60">Gerencie preferências</p>
                </button>
                <button className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 active:scale-95 transition-all text-left">
                  <p className="font-semibold text-sm text-red-400">Sair da Conta</p>
                  <p className="text-xs text-white/60">Desconecionar</p>
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
    </div>
  );
}

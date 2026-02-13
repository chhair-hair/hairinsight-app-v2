'use client';

import { useState, useEffect } from 'react';
import AppHeader from '@/components/custom/app-header';
import { Calendar as CalendarIcon, Clock, Droplet, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';
import { useRoutine } from '@/lib/routine-context';
import { Gender } from '@/lib/types';

interface DaySchedule {
  date: Date;
  routine: 'morning' | 'night' | 'both';
  treatments: string[];
}

export default function SchedulePage() {
  const { quizData } = useQuiz();
  const { userRoutine, generateMockRoutine } = useRoutine();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCard, setShowCard] = useState(false);
  const gender: Gender = quizData?.gender || 'feminino';

  const accentColor = gender === 'feminino' ? '#FF6F91' : '#9B59B6';

  // Gerar rotina se não existir
  useEffect(() => {
    if (!userRoutine) {
      generateMockRoutine();
    }
  }, [userRoutine, generateMockRoutine]);

  // Função para gerar dias do mês
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Adicionar dias vazios antes do primeiro dia do mês
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Adicionar todos os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  // Função para verificar se o dia tem rotina programada
  // Baseado no perfil capilar:
  // - Cabelo com química: lava 2-3x por semana (Segunda, Quinta)
  // - Cabelo sem química oleoso: lava 3x por semana (Segunda, Quarta, Sexta)
  // - Cabelo seco/normal: lava 2x por semana (Segunda, Quinta)
  const hasSchedule = (date: Date | null): boolean => {
    if (!date || !userRoutine) return false;
    const dayOfWeek = date.getDay();

    // Verifica se o perfil tem química (menos lavagens)
    const hasChemistry = quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum';
    const isOily = quizData.scalpType === 'oleoso';

    if (hasChemistry) {
      // Com química: Segunda e Quinta (2x por semana)
      return dayOfWeek === 1 || dayOfWeek === 4;
    } else if (isOily) {
      // Oleoso sem química: Segunda, Quarta, Sexta (3x por semana)
      return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    } else {
      // Seco/Normal: Segunda e Quinta (2x por semana)
      return dayOfWeek === 1 || dayOfWeek === 4;
    }
  };

  // Função para obter o tipo de cuidado do dia
  const getDayRoutineType = (date: Date | null): string => {
    if (!date) return '';
    if (!hasSchedule(date)) return 'Dia de Descanso';
    return 'Rotina Completa';
  };

  // Função para obter produtos e instruções do dia
  const getDayProducts = (date: Date | null): any[] => {
    if (!date || !userRoutine || !hasSchedule(date)) return [];

    // Retorna produtos da rotina noturna (lavagem completa)
    const products: any[] = [];

    // Adiciona produtos dos passos da rotina noturna
    userRoutine.nightRoutine.forEach((step) => {
      if (step.recommendedProducts && step.recommendedProducts.length > 0) {
        step.recommendedProducts.forEach((product) => {
          // Evita duplicatas
          if (!products.find((p) => p.id === product.id)) {
            products.push(product);
          }
        });
      }
    });

    return products;
  };

  // Função para obter instruções detalhadas do dia
  const getDayInstructions = (date: Date | null) => {
    if (!date || !userRoutine || !hasSchedule(date)) {
      return {
        morning: [],
        night: [],
      };
    }

    return {
      morning: userRoutine.morningRoutine,
      night: userRoutine.nightRoutine,
    };
  };

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    // Permite clicar em qualquer dia para ver se é dia de descanso
    setSelectedDate(date);
    setShowCard(true);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const days = getDaysInMonth(currentMonth);
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <AppHeader accentColor={accentColor} />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <CalendarIcon className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-sm text-white/80">Calendário Capilar</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Seu <span style={{ color: accentColor }}>Calendário</span>
            </h1>
            <p className="text-lg text-white/60">
              Clique nos dias para ver os cuidados e produtos recomendados
            </p>
          </div>

          {/* Legenda */}
          <div className="mb-6 flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-md"
                style={{ backgroundColor: `${accentColor}20`, border: `1px solid ${accentColor}40` }}
              />
              <span className="text-sm text-white/70">Dia com Rotina</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-white/5" />
              <span className="text-sm text-white/70">Dia de Descanso</span>
            </div>
          </div>

          {/* Calendário */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            {/* Header do Calendário */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-bold capitalize">{monthName}</h2>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dias da Semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-white/50 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do Mês */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                const isToday =
                  date &&
                  date.toDateString() === new Date().toDateString();
                const hasRoutine = hasSchedule(date);
                const isSelected =
                  selectedDate &&
                  date &&
                  date.toDateString() === selectedDate.toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    disabled={!date}
                    className={`
                      aspect-square rounded-xl p-2 text-sm font-medium transition-all duration-300
                      ${!date ? 'invisible' : ''}
                      ${!hasRoutine ? 'text-white/30 hover:bg-white/5' : ''}
                      ${hasRoutine ? 'hover:scale-105 cursor-pointer' : 'cursor-pointer'}
                      ${isToday ? 'ring-2' : ''}
                      ${isSelected ? 'text-white' : hasRoutine ? 'text-white/90' : ''}
                    `}
                    style={
                      isSelected
                        ? { backgroundColor: accentColor }
                        : hasRoutine
                        ? { backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40`, border: '1px solid' }
                        : {}
                    }
                  >
                    {date?.getDate()}
                    {hasRoutine && !isSelected && (
                      <div
                        className="w-1.5 h-1.5 rounded-full mx-auto mt-1"
                        style={{ backgroundColor: accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card de Informações do Dia */}
          {showCard && selectedDate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
              <div className="max-w-2xl w-full rounded-3xl border border-white/10 bg-[#0D0D0D] p-6 shadow-2xl animate-fade-in my-8">
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3 capitalize"
                      style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    >
                      {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                    </div>
                    <h2 className="text-3xl font-bold capitalize">
                      {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowCard(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {hasSchedule(selectedDate) ? (
                  <>
                    {/* Tipo de Rotina */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
                        <h3 className="text-xl font-bold">Rotina Completa</h3>
                      </div>
                      <p className="text-white/60 text-sm">
                        Siga os passos abaixo para cuidar dos seus cabelos de acordo com seu perfil
                      </p>
                    </div>

                    {/* Rotina da Noite (Lavagem) */}
                    {getDayInstructions(selectedDate).night.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-2xl">🌙</div>
                          <h3 className="text-lg font-bold">Rotina da Noite</h3>
                        </div>
                        <div className="space-y-3">
                          {getDayInstructions(selectedDate).night.map((step, index) => (
                            <div
                              key={step.id}
                              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                  style={{ backgroundColor: `${accentColor}30`, color: accentColor }}
                                >
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-sm">{step.title}</h4>
                                    {step.duration && (
                                      <span className="flex items-center gap-1 text-white/50 text-xs">
                                        <Clock className="w-3 h-3" />
                                        {step.duration}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-white/70 text-xs mb-2">{step.description}</p>
                                  {step.recommendedProducts && step.recommendedProducts.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-white/10">
                                      <p className="text-xs text-white/50 mb-1">Produtos recomendados:</p>
                                      {step.recommendedProducts.map((product) => (
                                        <div key={product.id} className="bg-white/5 rounded-lg p-2 mb-1">
                                          <p className="font-semibold text-xs text-white/90">{product.genericName}</p>
                                          <p className="text-[10px] text-white/50">{product.mainGoal}</p>
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
                    )}

                    {/* Rotina da Manhã */}
                    {getDayInstructions(selectedDate).morning.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-2xl">☀️</div>
                          <h3 className="text-lg font-bold">Rotina da Manhã (Dia Seguinte)</h3>
                        </div>
                        <div className="space-y-3">
                          {getDayInstructions(selectedDate).morning.map((step, index) => (
                            <div
                              key={step.id}
                              className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                                  style={{ backgroundColor: `${accentColor}30`, color: accentColor }}
                                >
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-sm">{step.title}</h4>
                                    {step.duration && (
                                      <span className="flex items-center gap-1 text-white/50 text-xs">
                                        <Clock className="w-3 h-3" />
                                        {step.duration}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-white/70 text-xs mb-2">{step.description}</p>
                                  {step.recommendedProducts && step.recommendedProducts.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-white/10">
                                      <p className="text-xs text-white/50 mb-1">Produtos recomendados:</p>
                                      {step.recommendedProducts.map((product) => (
                                        <div key={product.id} className="bg-white/5 rounded-lg p-2 mb-1">
                                          <p className="font-semibold text-xs text-white/90">{product.genericName}</p>
                                          <p className="text-[10px] text-white/50">{product.mainGoal}</p>
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
                    )}

                    {/* Aviso sobre tempo de descanso */}
                    {(quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum') && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-blue-400 mb-1">Cabelos com Química</p>
                            <p className="text-xs text-white/70">
                              Por ter tratamento químico, recomendamos lavar apenas 2x por semana para não ressecar os fios.
                              Os dias de descanso são importantes para a recuperação natural do cabelo.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Dia de Descanso
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">😌</div>
                    <h3 className="text-2xl font-bold mb-3">Dia de Descanso</h3>
                    <p className="text-white/60 text-sm mb-4 max-w-md mx-auto">
                      Seus cabelos também precisam de tempo para se recuperar naturalmente.
                      Hoje não há rotina programada - aproveite para deixar os fios descansarem!
                    </p>
                    <div className="bg-white/5 rounded-xl p-4 inline-block">
                      <p className="text-white/70 text-xs">
                        <strong>Dica:</strong> Você pode prender os cabelos para dormir ou usar uma touca de cetim para proteger os fios.
                      </p>
                    </div>
                  </div>
                )}

                {/* Botão de Fechar */}
                <button
                  onClick={() => setShowCard(false)}
                  className="w-full mt-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
                >
                  Entendi!
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

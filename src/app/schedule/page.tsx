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
  const hasSchedule = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDate();
    // Segunda, Quarta, Sexta - Rotina completa
    // Terça, Quinta - Apenas hidratação rápida
    // Sábado - Tratamento intensivo
    // Domingo - Descanso
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0; // Todos os dias exceto domingo
  };

  // Função para obter o tipo de cuidado do dia
  const getDayRoutineType = (date: Date | null): string => {
    if (!date) return '';
    const dayOfWeek = date.getDay();

    switch (dayOfWeek) {
      case 1: // Segunda
      case 3: // Quarta
      case 5: // Sexta
        return 'Rotina Completa';
      case 2: // Terça
      case 4: // Quinta
        return 'Hidratação Rápida';
      case 6: // Sábado
        return 'Tratamento Intensivo';
      default:
        return 'Dia de Descanso';
    }
  };

  // Função para obter produtos do dia
  const getDayProducts = (date: Date | null) => {
    if (!date || !userRoutine) return [];
    const dayOfWeek = date.getDay();

    switch (dayOfWeek) {
      case 1: // Segunda
      case 3: // Quarta
      case 5: // Sexta
        return [
          userRoutine.allRecommendedProducts[0], // Shampoo
          userRoutine.allRecommendedProducts[1], // Condicionador
          userRoutine.allRecommendedProducts[3], // Leave-in
        ];
      case 2: // Terça
      case 4: // Quinta
        return [
          userRoutine.allRecommendedProducts[3], // Leave-in
          userRoutine.allRecommendedProducts[4], // Óleo
        ];
      case 6: // Sábado
        return [
          userRoutine.allRecommendedProducts[0], // Shampoo
          userRoutine.allRecommendedProducts[2], // Máscara Intensiva
          userRoutine.allRecommendedProducts[4], // Óleo
        ];
      default:
        return [];
    }
  };

  const handleDateClick = (date: Date | null) => {
    if (!date || !hasSchedule(date)) return;
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
                    disabled={!date || !hasRoutine}
                    className={`
                      aspect-square rounded-xl p-2 text-sm font-medium transition-all duration-300
                      ${!date ? 'invisible' : ''}
                      ${!hasRoutine ? 'text-white/20 cursor-not-allowed' : ''}
                      ${hasRoutine ? 'hover:scale-105 cursor-pointer' : ''}
                      ${isToday ? 'ring-2' : ''}
                      ${isSelected ? 'text-white' : hasRoutine ? 'text-white/70' : ''}
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
                        className="w-1 h-1 rounded-full mx-auto mt-1"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-[#0D0D0D] p-6 shadow-2xl animate-fade-in">
                {/* Header do Card */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-3"
                      style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                    >
                      {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                    </div>
                    <h2 className="text-3xl font-bold">
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

                {/* Tipo de Rotina */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" style={{ color: accentColor }} />
                    <h3 className="text-xl font-bold">{getDayRoutineType(selectedDate)}</h3>
                  </div>
                  <p className="text-white/60 text-sm">
                    {selectedDate.getDay() === 6
                      ? 'Dia perfeito para um tratamento mais profundo e intensivo'
                      : selectedDate.getDay() === 2 || selectedDate.getDay() === 4
                      ? 'Mantenha os fios hidratados com uma rotina leve'
                      : 'Complete sua rotina com todos os passos essenciais'}
                  </p>
                </div>

                {/* Produtos Recomendados */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Droplet className="w-5 h-5" style={{ color: accentColor }} />
                    <h3 className="text-lg font-bold">Produtos para Hoje</h3>
                  </div>
                  <div className="space-y-3">
                    {getDayProducts(selectedDate).map((product, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${accentColor}20` }}
                          >
                            <Droplet className="w-5 h-5" style={{ color: accentColor }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1">{product.genericName}</h4>
                            <p className="text-xs text-white/50 mb-2">{product.mainGoal}</p>
                            <div className="flex flex-wrap gap-1">
                              {product.keyIngredients.slice(0, 3).map((ingredient, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/60"
                                >
                                  {ingredient}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

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

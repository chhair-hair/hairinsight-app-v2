'use client';

import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { useRoutine } from '@/lib/routine-context';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle, Calendar as CalendarIcon, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function ResultadoCompletoPage() {
  const router = useRouter();
  const { quizData, getThemeColors } = useQuiz();
  const { userRoutine } = useRoutine();
  const colors = getThemeColors();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());

  // Gerar dias do mês
  const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();

  // Lógica de rotina baseada no perfil capilar
  const isRoutineDay = (date: Date) => {
    const dayOfWeek = date.getDay();

    // Determina frequência baseada no perfil do quiz
    const hasChemistry = quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum';
    const isOily = quizData.scalpType === 'oleoso';

    if (hasChemistry) {
      // Com química: Segunda (1) e Quinta (4) - 2x por semana
      return dayOfWeek === 1 || dayOfWeek === 4;
    } else if (isOily) {
      // Oleoso: Segunda (1), Quarta (3), Sexta (5) - 3x por semana
      return dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    } else {
      // Seco/Normal: Segunda (1) e Quinta (4) - 2x por semana
      return dayOfWeek === 1 || dayOfWeek === 4;
    }
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="min-h-screen bg-[#0D0D0D] pb-8">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-[#0D0D0D]/95 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold">Resultado Completo</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Resumo do Perfil Capilar */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: colors.primary }} />
            <h2 className="text-xl font-bold">Seu Perfil Capilar</h2>
          </div>

          {userRoutine && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-white/60 mb-2">Tipo de Cabelo</h3>
                <p className="text-lg font-bold">{userRoutine.hairType}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-white/60 mb-2">Objetivo Principal</h3>
                <p className="text-lg font-bold">{userRoutine.mainGoal}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-white/60 mb-2">Nível de Dano</h3>
                <p className="text-lg font-bold">{userRoutine.damageLevel}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-white/60 mb-2">Tendência</h3>
                <p className="text-lg font-bold">{userRoutine.tendency}</p>
              </div>
            </div>
          )}
        </div>

        {/* Pontos Críticos Identificados */}
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h2 className="text-xl font-bold">Pontos Críticos Identificados</h2>
          </div>

          <div className="space-y-3">
            {userRoutine && userRoutine.damageLevel === 'Alto' && (
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Alto Nível de Dano</h3>
                  <p className="text-white/70 text-xs">
                    Seus fios precisam de cuidados intensivos. Evite processos químicos e use máscara de hidratação regularmente.
                  </p>
                </div>
              </div>
            )}

            {userRoutine && userRoutine.tendency === 'Oleoso' && (
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-400 text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Oleosidade Excessiva</h3>
                  <p className="text-white/70 text-xs">
                    Lave o cabelo com shampoo específico para controle de oleosidade. Evite produtos pesados na raiz.
                  </p>
                </div>
              </div>
            )}

            {userRoutine && userRoutine.tendency === 'Seco' && (
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-yellow-400 text-xs font-bold">!</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Ressecamento dos Fios</h3>
                  <p className="text-white/70 text-xs">
                    Seus fios precisam de hidratação intensa. Use produtos com óleos naturais e evite água muito quente.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs font-bold">i</span>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">Exposição a Agentes Externos</h3>
                <p className="text-white/70 text-xs">
                  Proteja seus fios do sol, vento e poluição. Use produtos com proteção UV e leave-in.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rotina Personalizada Detalhada */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5" style={{ color: colors.primary }} />
            <h2 className="text-xl font-bold">Rotina Personalizada</h2>
          </div>

          {userRoutine && (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Manhã */}
              <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sun className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold">Manhã</h3>
                </div>
                <div className="space-y-3">
                  {userRoutine.morningRoutine.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                        <p className="text-white/70 text-xs">{step.description}</p>
                        {step.duration && (
                          <p className="text-white/50 text-xs mt-1">{step.duration}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Noite */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Moon className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-bold">Noite</h3>
                </div>
                <div className="space-y-3">
                  {userRoutine.nightRoutine.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                        <p className="text-white/70 text-xs">{step.description}</p>
                        {step.duration && (
                          <p className="text-white/50 text-xs mt-1">{step.duration}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calendário Mensal */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" style={{ color: colors.primary }} />
              <h2 className="text-xl font-bold">Calendário de Rotina</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))}
                className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm min-w-[120px] text-center">
                {monthNames[selectedMonth]} {selectedYear}
              </span>
              <button
                onClick={() => setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))}
                className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95 rotate-180"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Descrição da Frequência */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
            <p className="text-sm text-white/80 mb-2">
              <strong>Frequência recomendada:</strong>{' '}
              {quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum'
                ? '2x por semana (Segunda e Quinta)'
                : quizData.scalpType === 'oleoso'
                ? '3x por semana (Segunda, Quarta e Sexta)'
                : '2x por semana (Segunda e Quinta)'}
            </p>
            <p className="text-xs text-white/60">
              {quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum'
                ? '🧪 Por ter tratamento químico, recomendamos menos lavagens para evitar ressecamento.'
                : quizData.scalpType === 'oleoso'
                ? '💧 Por ter couro cabeludo oleoso, você pode lavar com mais frequência.'
                : '✨ Frequência equilibrada ideal para seu tipo de cabelo.'}
            </p>
          </div>

          {/* Legenda */}
          <div className="flex flex-wrap gap-4 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.primary }}></div>
              <span className="text-white/70">Dia de Rotina</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10"></div>
              <span className="text-white/70">Dia de Descanso</span>
            </div>
          </div>

          {/* Calendário */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-white/60 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Dias do mês */}
            <div className="grid grid-cols-7 gap-2">
              {/* Espaços vazios para o primeiro dia */}
              {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}

              {/* Dias */}
              {daysInMonth.map((date) => {
                const isToday =
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear();
                const hasRoutine = isRoutineDay(date);

                return (
                  <div
                    key={date.toISOString()}
                    className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                      isToday ? 'ring-2 ring-white/50' : ''
                    } ${hasRoutine ? 'hover:scale-110' : ''}`}
                    style={{
                      backgroundColor: hasRoutine ? colors.primary : '#ffffff10',
                      color: hasRoutine ? '#ffffff' : '#ffffff80',
                    }}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="mt-4 bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-sm text-white/80 mb-2">
              <span className="font-bold" style={{ color: colors.primary }}>Frequência recomendada:</span> 3x por semana
            </p>
            <p className="text-xs text-white/60">
              Segunda, Quarta e Sexta são os melhores dias para sua rotina capilar. Mantenha consistência para resultados incríveis!
            </p>
          </div>
        </div>

        {/* Botão Voltar */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: colors.primary }}
          >
            Voltar para Início
          </button>
        </div>
      </main>
    </div>
  );
}

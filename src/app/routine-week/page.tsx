'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import AppHeader from '@/components/custom/app-header';
import {
  Calendar,
  Droplet,
  Leaf,
  Wrench,
  Sparkles,
  Clock,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import {
  calculatePorosity,
  findProfile,
  generateWeeklyCalendar,
  getTodayRoutine,
  type HairCurvature,
  type ScalpOiliness,
} from '@/lib/calendar';

export default function RoutineWeekPage() {
  const router = useRouter();
  const { quizData, getThemeColors } = useQuiz();
  const colors = getThemeColors();

  const [calendar, setCalendar] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Mapear as respostas do quiz para o sistema de perfis
  useEffect(() => {
    if (!quizData.hairType || !quizData.scalpType) {
      return; // Aguarda o quiz estar completo
    }

    // Mapear hairType para HairCurvature
    const curvature = quizData.hairType as HairCurvature;

    // Mapear scalpType para ScalpOiliness
    const oiliness = quizData.scalpType as ScalpOiliness;

    // Calcular porosidade
    const porosity = calculatePorosity(
      quizData.chemicalTreatments || 'nenhum',
      quizData.heatTools || 'nao',
      quizData.hairTexture || 'medio'
    );

    // Verificar se tem química
    const hasChemistry = quizData.chemicalTreatments
      ? !['nenhum'].includes(quizData.chemicalTreatments)
      : false;

    // Buscar perfil
    const foundProfile = findProfile(curvature, oiliness, porosity, hasChemistry);

    if (foundProfile) {
      setProfile(foundProfile);

      // Gerar calendário (semana 1 por padrão)
      const weekCalendar = generateWeeklyCalendar(foundProfile, 1);
      setCalendar(weekCalendar);
    }
  }, [quizData]);

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case 'H':
        return <Droplet className="w-4 h-4 text-blue-400" />;
      case 'N':
        return <Leaf className="w-4 h-4 text-green-400" />;
      case 'R':
        return <Wrench className="w-4 h-4 text-orange-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const dayNames: Record<string, string> = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  // Se não tem perfil ainda, mostra mensagem
  if (!profile || !calendar) {
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

  const todayRoutine = getTodayRoutine(calendar);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <AppHeader accentColor={colors.primary} />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button
            onClick={() => router.push('/app')}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>

          <div className="mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border mb-4"
              style={{ borderColor: `${colors.primary}30` }}
            >
              <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
              <span className="text-sm text-white/80">Rotina Semanal</span>
            </div>

            <h1 className="text-4xl font-bold mb-2">
              Sua <span style={{ color: colors.primary }}>Rotina</span> da Semana
            </h1>
            <p className="text-white/60">
              Perfil: <span className="font-semibold">{profile.name}</span>
            </p>
          </div>

          {/* Rotina de Hoje - Destaque */}
          <div
            className="rounded-3xl p-6 mb-8 border-2"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primaryDark}10)`,
              borderColor: colors.primary,
            }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-3xl">{todayRoutine.icon}</span>
              Rotina de Hoje
            </h2>

            <h3 className="text-3xl font-bold mb-2">{todayRoutine.title}</h3>
            <p className="text-white/70 mb-4">{todayRoutine.description}</p>

            <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
              <Clock className="w-4 h-4" />
              <span>{todayRoutine.duration}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Produtos */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="font-semibold mb-3" style={{ color: colors.primary }}>
                  Produtos Necessários
                </h4>
                <ul className="space-y-2">
                  {todayRoutine.products.map((product: string, i: number) => (
                    <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                      <span style={{ color: colors.primary }}>•</span>
                      {product}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Passo a Passo */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="font-semibold mb-3" style={{ color: colors.primary }}>
                  Passo a Passo
                </h4>
                <ol className="space-y-2">
                  {todayRoutine.steps.slice(0, 5).map((step: string, i: number) => (
                    <li key={i} className="text-sm text-white/80">
                      <span className="font-semibold" style={{ color: colors.primary }}>
                        {i + 1}.
                      </span>{' '}
                      {step}
                    </li>
                  ))}
                  {todayRoutine.steps.length > 5 && (
                    <li className="text-sm text-white/60 italic">
                      + {todayRoutine.steps.length - 5} passos adicionais
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </div>

          {/* Calendário Semanal */}
          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Calendário Completo da Semana</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(calendar.days).map(([dayKey, routine]: [string, any]) => {
                const isToday =
                  dayKey ===
                  [
                    'sunday',
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                  ][new Date().getDay()];

                return (
                  <div
                    key={dayKey}
                    className={`rounded-xl p-4 border transition-all hover:scale-105 ${
                      isToday ? 'border-2 shadow-lg' : 'border-white/10'
                    }`}
                    style={{
                      backgroundColor: isToday ? `${colors.primary}15` : '#ffffff05',
                      borderColor: isToday ? colors.primary : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold">{dayNames[dayKey]}</h3>
                      {routine.scheduleType && getScheduleIcon(routine.scheduleType)}
                    </div>

                    <div className="text-3xl mb-2">{routine.icon}</div>
                    <h4 className="font-semibold mb-1" style={{ color: colors.primary }}>
                      {routine.title}
                    </h4>
                    <p className="text-xs text-white/60 mb-3">{routine.description}</p>

                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      <span>{routine.duration}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-white/50">{routine.products.length} produto(s)</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legenda */}
          <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="font-bold mb-4">Legenda do Cronograma Capilar</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Droplet className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="font-semibold">H - Hidratação</p>
                  <p className="text-xs text-white/60">Repõe água nos fios</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Leaf className="w-6 h-6 text-green-400" />
                <div>
                  <p className="font-semibold">N - Nutrição</p>
                  <p className="text-xs text-white/60">Repõe óleos e lipídios</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Wrench className="w-6 h-6 text-orange-400" />
                <div>
                  <p className="font-semibold">R - Reconstrução</p>
                  <p className="text-xs text-white/60">Repõe proteínas e queratina</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

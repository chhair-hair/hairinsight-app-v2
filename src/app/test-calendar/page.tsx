'use client';

import { useState } from 'react';
import {
  HAIR_PROFILES,
  HairProfile,
  generateWeeklyCalendar,
  WeeklyCalendar,
  getTodayRoutine,
} from '@/lib/calendar';
import { Calendar, Droplet, Leaf, Wrench, Sparkles, Clock } from 'lucide-react';

export default function TestCalendarPage() {
  const [selectedProfile, setSelectedProfile] = useState<HairProfile | null>(
    HAIR_PROFILES[0]
  );
  const [weekNumber, setWeekNumber] = useState<1 | 2 | 3>(1);
  const [calendar, setCalendar] = useState<WeeklyCalendar | null>(null);

  const handleGenerateCalendar = () => {
    if (!selectedProfile) return;
    const generated = generateWeeklyCalendar(selectedProfile, weekNumber);
    setCalendar(generated);
  };

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case 'H':
        return <Droplet className="w-5 h-5 text-blue-400" />;
      case 'N':
        return <Leaf className="w-5 h-5 text-green-400" />;
      case 'R':
        return <Wrench className="w-5 h-5 text-orange-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-400" />;
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

  const todayRoutine = calendar ? getTodayRoutine(calendar) : null;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
          <Calendar className="w-10 h-10 text-[#FF6F91]" />
          Sistema de Calendário Capilar
        </h1>

        {/* Seleção de Perfil */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">1. Escolha um Perfil</h2>
          <select
            value={selectedProfile?.id || ''}
            onChange={(e) => {
              const profile = HAIR_PROFILES.find((p) => p.id === e.target.value);
              setSelectedProfile(profile || null);
            }}
            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
          >
            {HAIR_PROFILES.map((profile) => (
              <option key={profile.id} value={profile.id} className="bg-[#1A1A1A]">
                {profile.name} - {profile.curvature} / {profile.oiliness} / {profile.porosity} /
                {profile.hasChemistry ? 'Com química' : 'Sem química'}
              </option>
            ))}
          </select>

          {selectedProfile && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-[#FF6F91]">Características</h3>
                <ul className="text-sm space-y-1 text-white/70">
                  <li>• Curvatura: {selectedProfile.curvature}</li>
                  <li>• Oleosidade: {selectedProfile.oiliness}</li>
                  <li>• Porosidade: {selectedProfile.porosity}</li>
                  <li>• Química: {selectedProfile.hasChemistry ? 'Sim' : 'Não'}</li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-[#FF6F91]">Configurações</h3>
                <ul className="text-sm space-y-1 text-white/70">
                  <li>• Lavagens por semana: {selectedProfile.washDaysPerWeek}</li>
                  <li>• Precisa refresh: {selectedProfile.needsRefresh ? 'Sim' : 'Não'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Seleção de Semana */}
        <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
          <h2 className="text-xl font-bold mb-4">2. Escolha a Semana do Ciclo</h2>
          <div className="flex gap-3">
            {[1, 2, 3].map((week) => (
              <button
                key={week}
                onClick={() => setWeekNumber(week as 1 | 2 | 3)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  weekNumber === week
                    ? 'bg-[#FF6F91] text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                Semana {week}
              </button>
            ))}
          </div>
        </div>

        {/* Botão Gerar */}
        <button
          onClick={handleGenerateCalendar}
          className="w-full bg-gradient-to-r from-[#FF6F91] to-[#FF4D73] text-white font-bold py-4 rounded-xl mb-8 hover:scale-[1.02] transition-transform"
        >
          Gerar Calendário
        </button>

        {/* Calendário Gerado */}
        {calendar && (
          <>
            {/* Rotina de Hoje */}
            {todayRoutine && (
              <div className="bg-gradient-to-br from-[#FF6F91]/20 to-[#FF4D73]/20 border-2 border-[#FF6F91] rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  {todayRoutine.icon} Rotina de Hoje
                </h2>
                <h3 className="text-3xl font-bold mb-2">{todayRoutine.title}</h3>
                <p className="text-white/70 mb-4">{todayRoutine.description}</p>
                <div className="flex items-center gap-2 text-sm text-white/60 mb-6">
                  <Clock className="w-4 h-4" />
                  <span>{todayRoutine.duration}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-[#FF6F91]">Produtos Necessários</h4>
                    <ul className="space-y-2">
                      {todayRoutine.products.map((product, i) => (
                        <li key={i} className="text-sm text-white/80">• {product}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-[#FF6F91]">Passo a Passo</h4>
                    <ol className="space-y-2">
                      {todayRoutine.steps.slice(0, 5).map((step, i) => (
                        <li key={i} className="text-sm text-white/80">
                          {i + 1}. {step}
                        </li>
                      ))}
                      {todayRoutine.steps.length > 5 && (
                        <li className="text-sm text-white/60">
                          + {todayRoutine.steps.length - 5} mais passos
                        </li>
                      )}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Calendário Semanal */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-6">
                Calendário - Semana {calendar.weekNumber} do Ciclo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(calendar.days).map(([dayKey, routine]) => (
                  <div
                    key={dayKey}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#FF6F91]/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold">{dayNames[dayKey]}</h3>
                      {routine.scheduleType && getScheduleIcon(routine.scheduleType)}
                    </div>

                    <div className="text-2xl mb-2">{routine.icon}</div>
                    <h4 className="font-semibold text-[#FF6F91] mb-1">{routine.title}</h4>
                    <p className="text-xs text-white/60 mb-3">{routine.description}</p>

                    <div className="flex items-center gap-2 text-xs text-white/50">
                      <Clock className="w-3 h-3" />
                      <span>{routine.duration}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-white/50">
                        {routine.products.length} produto(s)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

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
    </div>
  );
}

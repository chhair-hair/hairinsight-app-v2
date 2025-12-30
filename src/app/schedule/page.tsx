'use client';

import { useState } from 'react';
import Navbar from '@/components/custom/navbar';
import { Calendar, Clock, CheckCircle2, Circle, Plus } from 'lucide-react';
import { Gender } from '@/lib/types';

export default function SchedulePage() {
  const [gender] = useState<Gender>('female'); // TODO: Get from context/state
  
  const accentColor = gender === 'female' ? '#FF6F91' : '#9B59B6';

  const schedules = [
    {
      id: 1,
      title: 'Hidratação Profunda',
      description: 'Máscara nutritiva por 30 minutos',
      frequency: 'Semanal',
      nextDate: '2024-01-15',
      completed: false,
    },
    {
      id: 2,
      title: 'Nutrição Capilar',
      description: 'Tratamento com óleos essenciais',
      frequency: 'Quinzenal',
      nextDate: '2024-01-20',
      completed: false,
    },
    {
      id: 3,
      title: 'Reconstrução',
      description: 'Reposição de queratina',
      frequency: 'Mensal',
      nextDate: '2024-01-25',
      completed: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar gender={gender} />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
                <Calendar className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-sm text-white/80">Cronograma Capilar</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Seu <span style={{ color: accentColor }}>Cronograma</span>
              </h1>
              <p className="text-lg text-white/60">
                Acompanhe e organize seus cuidados capilares
              </p>
            </div>

            <button
              className="mt-6 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
            >
              <Plus className="w-5 h-5" />
              <span>Novo Cuidado</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl font-bold mb-1">3</div>
              <div className="text-sm text-white/60">Cuidados Ativos</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl font-bold mb-1">1</div>
              <div className="text-sm text-white/60">Concluídos</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl font-bold mb-1">2</div>
              <div className="text-sm text-white/60">Pendentes</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-3xl font-bold mb-1">67%</div>
              <div className="text-sm text-white/60">Taxa de Sucesso</div>
            </div>
          </div>

          {/* Schedule List */}
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-start gap-4">
                  <button
                    className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      schedule.completed
                        ? 'border-transparent'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                    style={schedule.completed ? { backgroundColor: accentColor } : {}}
                  >
                    {schedule.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className={`text-xl font-bold mb-1 ${schedule.completed ? 'text-white/50 line-through' : ''}`}>
                          {schedule.title}
                        </h3>
                        <p className="text-white/60 text-sm">{schedule.description}</p>
                      </div>
                      
                      <div 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                      >
                        {schedule.frequency}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Próximo: {schedule.nextDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (if no schedules) */}
          {schedules.length === 0 && (
            <div className="text-center py-16">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Calendar className="w-10 h-10" style={{ color: accentColor }} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Nenhum cronograma ainda</h3>
              <p className="text-white/60 mb-6">
                Crie seu primeiro cronograma de cuidados capilares
              </p>
              <button
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
              >
                <Plus className="w-5 h-5" />
                <span>Criar Cronograma</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

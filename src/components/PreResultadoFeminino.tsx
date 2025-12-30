'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import HorizontalFeed from '@/components/HorizontalFeed';
import { useQuiz } from '@/lib/quiz-context';

export default function PreResultadoFeminino() {
  const { getThemeColors, updateQuizData, isAdmin } = useQuiz();
  const colors = getThemeColors();

  // Marca o quiz como concluído quando chegar nesta página (exceto admin)
  useEffect(() => {
    if (!isAdmin) {
      console.log('✅ Usuário chegou no pré-resultado feminino - Marcando quiz como concluído');
      updateQuizData({ hasCompletedQuiz: true });
    } else {
      console.log('🔓 Admin acessando pré-resultado feminino - não marca quiz como concluído');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const depoimentos = [
    {
      id: 1,
      texto: 'Minha autoestima mudou completamente após seguir a rotina. Nunca pensei que teria tanto resultado em pouco tempo.',
      nome: 'Mariana S.',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      texto: 'A análise da IA foi certeira, meu cabelo mudou em 30 dias.',
      nome: 'Juliana R.',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      texto: 'O antes e depois fala por si só. Recomendo 100%.',
      nome: 'Camila P.',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Header */}
      <div className="animate-in fade-in slide-in-from-top-4 duration-600 container mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm text-white/80">Transformações Reais</span>
          {isAdmin && (
            <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded ml-2">
              MODO ADMIN
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Veja Resultados Reais
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto">
          Pessoas reais que transformaram seus cabelos seguindo rotinas personalizadas
        </p>
      </div>

      {/* Seção Antes e Depois - Carrossel Horizontal */}
      <div className="py-16">
        <div className="animate-in fade-in duration-800 delay-200">
          <h2 className="text-3xl font-bold text-center mb-8 px-4 uppercase">Antes & Depois</h2>
          
          <HorizontalFeed />
        </div>
      </div>

      {/* Seção Depoimentos */}
      <div className="container mx-auto px-4 py-16">
        <div className="animate-in fade-in duration-800 delay-400">
          <h2 className="text-3xl font-bold text-center mb-12">O Que Dizem Sobre a Transformação</h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {depoimentos.map((depoimento, index) => (
              <div
                key={depoimento.id}
                className="animate-in fade-in zoom-in-95 duration-500 bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:scale-105 transition-transform"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                {/* Foto de perfil */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img 
                      src={depoimento.foto} 
                      alt={depoimento.nome}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{depoimento.nome}</p>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                      <span className="text-xs text-white/50">Cliente Verificada</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-1" />
                  <p className="text-white/80 italic leading-relaxed">
                    "{depoimento.texto}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-600 delay-600">
          <Link href="/planos-femininos">
            <button
              style={{ backgroundColor: colors.primary }}
              className="group inline-flex items-center gap-3 px-8 py-4 text-[#0D0D0D] font-bold rounded-full hover:shadow-2xl transition-all duration-300 hover:scale-105 uppercase"
            >
              Continuar para o próximo passo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

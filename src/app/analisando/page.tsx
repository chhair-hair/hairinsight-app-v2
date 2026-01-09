'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, Loader2 } from 'lucide-react';

export default function AnalisandoPage() {
  const router = useRouter();
  const { quizData, updateQuizData, getThemeColors } = useQuiz();
  const colors = getThemeColors();

  useEffect(() => {
    // Gerar análise baseada nos dados do quiz
    const generateAnalysis = () => {
      const hairTypeMap = {
        liso: 'Cabelo Liso',
        ondulado: 'Cabelo Ondulado',
        cacheado: 'Cabelo Cacheado',
        crespo: 'Cabelo Crespo'
      };

      const damageLevel = quizData.heatTools === 'sim-regularmente' ? 'Alto' :
                         quizData.heatTools === 'sim-ocasionalmente' ? 'Médio' : 'Baixo';

      const tendency = quizData.hairGoal === 'hidratacao' ? 'Desidratação' :
                      quizData.hairGoal === 'fortalecimento' ? 'Quebra' :
                      quizData.hairGoal === 'controle-frizz' ? 'Frizz' : 'Crescimento lento';

      const fullRoutine = `
Rotina Diária:
1. Lavagem: Use shampoo suave 2-3x por semana
2. Condicionamento: Aplique condicionador em todo o comprimento
3. Hidratação: Máscara hidratante 1-2x por semana

Rotina Semanal:
1. Umectação: Aplicar óleo capilar para selar a hidratação
2. Proteção térmica: Sempre antes de usar ferramentas de calor
3. Corte: Manutenção a cada 6-8 semanas

Produtos Recomendados:
- Shampoo: Para ${hairTypeMap[quizData.hairType || 'liso']}
- Condicionador: Com ${quizData.productType === 'naturais' ? 'ingredientes naturais' : 'hidratação intensa'}
- Máscara: ${quizData.hairGoal === 'hidratacao' ? 'Hidratação profunda' : 'Fortalecimento'}
      `;

      updateQuizData({
        analysis: {
          hairType: hairTypeMap[quizData.hairType || 'liso'],
          damageLevel,
          tendency,
          fullRoutine: fullRoutine.trim()
        }
      });
    };

    generateAnalysis();

    // Simula análise IA por 3 segundos
    const timer = setTimeout(() => {
      router.push('/pre-resultado-feminino');
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // Dependência vazia para executar apenas uma vez no mount

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border mb-6"
            style={{ borderColor: `${colors.primary}30` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm text-white/80">Análise IA</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Analisando suas fotos...
          </h1>

          <p className="text-white/60 text-lg">
            Nossa IA está processando as imagens para criar sua rotina personalizada.
          </p>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative">
            <Loader2
              className="w-16 h-16 animate-spin mx-auto"
              style={{ color: colors.primary }}
            />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent animate-pulse"
              style={{ borderTopColor: colors.primary }}
            />
          </div>
        </div>

        {/* Progress Messages */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-left">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-white/80">Analisando tipo de cabelo...</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-white/80">Avaliando nível de dano...</span>
          </div>
          <div className="flex items-center gap-3 text-left">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-white/80">Criando rotina personalizada...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, Loader2 } from 'lucide-react';
import { analyzeHairPhotos } from '@/lib/openai';

export default function ReanaliseAnalisandoFemPage() {
  const router = useRouter();
  const { quizData, updateQuizData, getThemeColors } = useQuiz();
  const colors = getThemeColors();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Analisar fotos usando OpenAI Vision API
    const performAnalysis = async () => {
      try {
        // Verificar se existem fotos
        if (!quizData.photos?.left || !quizData.photos?.right || !quizData.photos?.down) {
          setError('Fotos não encontradas. Redirecionando...');
          setTimeout(() => router.push('/reanalise-photos-feminina'), 2000);
          return;
        }

        // Chamar API da OpenAI para analisar as fotos
        const analysis = await analyzeHairPhotos(quizData.photos);

        if (analysis) {

          // Gerar rotina completa baseada na análise da OpenAI
          const fullRoutine = `
Rotina Diária:
${analysis.recommendations?.immediate?.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n') || '1. Lavar com shampoo suave\n2. Aplicar condicionador\n3. Usar leave-in'}

Rotina Semanal:
${analysis.recommendations?.weekly?.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n') || '1. Máscara de hidratação\n2. Umectação\n3. Cronograma capilar'}

Rotina Mensal:
${analysis.recommendations?.monthly?.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n') || '1. Corte de pontas\n2. Tratamento profundo\n3. Nutrição intensiva'}

Análise Detalhada:
- Tipo: ${analysis.hairType}
- Dano: ${analysis.damageLevel}
- Tendência: ${analysis.tendency}
- Porosidade: ${analysis.porosity}
- Espessura: ${analysis.thickness}

Problemas Identificados:
${analysis.criticalIssues?.map((issue: string) => `• ${issue}`).join('\n') || '• Nenhum problema crítico'}

Pontos Fortes:
${analysis.strengths?.map((strength: string) => `• ${strength}`).join('\n') || '• Cabelo saudável'}
          `;

          // Atualizar dados do quiz com análise real da OpenAI
          updateQuizData({
            analysis: {
              hairType: analysis.hairType,
              damageLevel: analysis.damageLevel,
              tendency: analysis.tendency,
              fullRoutine: fullRoutine.trim()
            }
          });

          // Redirecionar após análise completa
          setTimeout(() => {
            router.push('/app?updated=true');
          }, 2000);
        } else {
          setError('Erro ao analisar fotos');
          setTimeout(() => router.push('/reanalise-photos-feminina'), 3000);
        }
      } catch (err: any) {
        console.error('Erro na análise:', err);
        const errorMessage = err.message || 'Erro ao processar análise';
        setError(`${errorMessage}. Redirecionando...`);
        setTimeout(() => router.push('/reanalise-photos-feminina'), 5000);
      }
    };

    performAnalysis();
  }, []);

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
            <span className="text-sm text-white/80">Reanálise IA</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Reanalisando suas fotos...
          </h1>

          <p className="text-white/60 text-lg">
            Nossa IA está atualizando sua rotina personalizada com base nas novas informações.
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
        {error ? (
          <div className="text-red-400 text-sm">{error}</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-white/80">Analisando tipo de cabelo com OpenAI Vision...</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-white/80">Avaliando porosidade e espessura dos fios...</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-white/80">Gerando recomendações personalizadas...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

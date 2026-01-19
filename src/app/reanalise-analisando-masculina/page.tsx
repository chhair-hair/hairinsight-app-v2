'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, Loader2 } from 'lucide-react';
import { analyzeHairPhotos } from '@/lib/openai';

export default function ReanaliseAnalisandoMascPage() {
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
          setTimeout(() => router.push('/reanalise-photos-masculina'), 2000);
          return;
        }

        // Chamar API da OpenAI para analisar as fotos COM dados do quiz
        const analysis = await analyzeHairPhotos(quizData.photos, quizData);

        if (analysis) {

          // Gerar rotina completa baseada na análise da OpenAI COM CONTEXTO DO QUIZ
          const fullRoutine = `
📊 ANÁLISE VISUAL:
• Tipo Observado: ${analysis.hairType}
${analysis.hairTypeMatch === false ? `⚠️ Nota: Nas fotos, seu cabelo aparenta ser ${analysis.hairType}, diferente do que foi informado no questionário (${quizData.hairType}). Vamos trabalhar com o tipo observado!` : ''}
• Nível de Dano: ${analysis.damageLevel}
• Tendência: ${analysis.tendency}
• Porosidade: ${analysis.porosity}
• Espessura: ${analysis.thickness}
• Saúde do Couro Cabeludo: ${analysis.scalpHealth}

🎯 SEU OBJETIVO: ${quizData.hairGoal?.toUpperCase().replace('-', ' ') || 'SAÚDE CAPILAR'}
${analysis.goalAlignment?.message || 'Continue seguindo as recomendações abaixo'}
${analysis.goalAlignment?.isOnTrack ? '✅ Você está no caminho certo!' : '⚠️ Vamos ajustar sua rotina para alcançar seu objetivo'}

🚨 ATENÇÃO NECESSÁRIA:
${analysis.criticalIssues?.map((issue: string) => `• ${issue}`).join('\n') || '• Nenhum problema crítico identificado'}

✨ PONTOS FORTES:
${analysis.strengths?.map((strength: string) => `• ${strength}`).join('\n') || '• Mantenha os cuidados atuais'}

📅 ROTINA DIÁRIA (aplicar hoje mesmo):
${analysis.recommendations?.immediate?.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n') || '1. Lavar com shampoo adequado ao seu tipo\n2. Aplicar condicionador nas pontas\n3. Usar leave-in ou creme de pentear'}

📅 ROTINA SEMANAL (repetir toda semana):
${analysis.recommendations?.weekly?.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n') || '1. Máscara de hidratação profunda\n2. Tratamento específico para seu objetivo\n3. Descanso capilar (sem químicas)'}

📅 ROTINA MENSAL (1x por mês):
${analysis.recommendations?.monthly?.map((rec: string, i: number) => `${i + 1}. ${rec}`).join('\n') || '1. Corte de pontas\n2. Tratamento profissional\n3. Avaliação de progresso'}

💊 PRODUTOS - O QUE PRIORIZAR:
${analysis.productSuggestions?.prioritize?.map((item: string) => `✅ ${item}`).join('\n') || '✅ Produtos adequados ao seu tipo de cabelo'}

🚫 PRODUTOS - O QUE EVITAR:
${analysis.productSuggestions?.avoid?.map((item: string) => `❌ ${item}`).join('\n') || '❌ Produtos com muitos químicos agressivos'}

⚙️ AJUSTES NA SUA ROTINA ATUAL:
${analysis.routineAdjustments?.map((adj: string) => `• ${adj}`).join('\n') || '• Continue sua rotina atual'}
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
          setTimeout(() => router.push('/reanalise-photos-masculina'), 3000);
        }
      } catch (err: any) {
        console.error('[Página] Erro na análise:', err);
        const errorMessage = err.message || 'Erro ao processar análise';

        // Mostrar erro mais detalhado para o usuário
        setError(errorMessage);

        // Redirecionar após 8 segundos para dar tempo de ler o erro
        setTimeout(() => {
          router.push('/reanalise-photos-masculina');
        }, 8000);
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

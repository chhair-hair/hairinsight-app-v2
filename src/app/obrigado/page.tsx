'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useQuiz } from '@/lib/quiz-context';

function ObrigadoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { quizData, updateQuizData } = useQuiz();
  const [theme, setTheme] = useState<'feminino' | 'masculino'>('feminino');

  useEffect(() => {
    // Detectar o tema baseado no parâmetro da URL ou do contexto do quiz
    const themeParam = searchParams.get('theme');
    if (themeParam === 'masculino' || themeParam === 'feminino') {
      setTheme(themeParam);
    } else if (quizData.gender) {
      setTheme(quizData.gender);
    }

    // Marcar o quiz como completo para liberar acesso ao app
    if (!quizData.hasCompletedQuiz) {
      updateQuizData({ hasCompletedQuiz: true });
    }
  }, [searchParams, quizData.gender, quizData.hasCompletedQuiz, updateQuizData]);

  const colors = {
    feminino: {
      primary: '#FF69B4',
      gradient: 'from-[#FF69B4] to-[#FF1493]',
      border: 'border-[#FF69B4]/30',
      text: 'text-[#FF69B4]',
      bg: 'bg-[#FF69B4]/10'
    },
    masculino: {
      primary: '#9B59B6',
      gradient: 'from-[#9B59B6] to-[#6F3A8D]',
      border: 'border-[#9B59B6]/30',
      text: 'text-[#9B59B6]',
      bg: 'bg-[#9B59B6]/10'
    }
  };

  const currentColors = colors[theme];

  const handleGoToApp = () => {
    // Redirecionar para o login com indicador de que veio de obrigado
    router.push('/login?from=obrigado');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Ícone de Sucesso */}
        <div className="mb-8 flex justify-center">
          <div className={`relative`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${currentColors.gradient} blur-2xl opacity-30 rounded-full`}></div>
            <CheckCircle className={`w-24 h-24 ${currentColors.text} relative z-10`} />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          Pagamento Confirmado!
        </h1>

        {/* Subtítulo */}
        <p className="text-xl text-white/80 mb-8">
          Obrigado por escolher o HairInsight! 🎉
        </p>

        {/* Card de Informações */}
        <div className={`bg-white/5 border ${currentColors.border} rounded-2xl p-8 mb-8`}>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Sparkles className={`w-6 h-6 ${currentColors.text} flex-shrink-0 mt-1`} />
              <div className="text-left">
                <h3 className="font-semibold text-white mb-2">Acesso Liberado</h3>
                <p className="text-white/70">
                  Seu acesso ao app foi liberado imediatamente. Você já pode começar a usar todas as funcionalidades!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Sparkles className={`w-6 h-6 ${currentColors.text} flex-shrink-0 mt-1`} />
              <div className="text-left">
                <h3 className="font-semibold text-white mb-2">Rotina Personalizada</h3>
                <p className="text-white/70">
                  Suas respostas do quiz já estão salvas! Acesse o app para ver sua rotina capilar personalizada.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Sparkles className={`w-6 h-6 ${currentColors.text} flex-shrink-0 mt-1`} />
              <div className="text-left">
                <h3 className="font-semibold text-white mb-2">Suporte Disponível</h3>
                <p className="text-white/70">
                  Qualquer dúvida, nossa equipe está pronta para ajudar você a aproveitar ao máximo o HairInsight.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          onClick={handleGoToApp}
          className={`w-full md:w-auto px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r ${currentColors.gradient} text-white flex items-center justify-center gap-2 mx-auto shadow-lg`}
        >
          Acessar o App Agora
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Mensagem de Boas-Vindas */}
        <p className="text-white/50 text-sm mt-8">
          Bem-vindo(a) à comunidade HairInsight! 💜
        </p>
      </div>
    </div>
  );
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <ObrigadoContent />
    </Suspense>
  );
}

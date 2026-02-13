'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, Loader2 } from 'lucide-react';

export default function ReanaliseAnalisandoFemPage() {
  const router = useRouter();
  const { getThemeColors } = useQuiz();
  const colors = getThemeColors();

  useEffect(() => {
    // Redirecionar direto para o app após 2 segundos
    const timer = setTimeout(() => {
      router.push('/app?updated=true');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

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
            <span className="text-sm text-white/80">Reanálise Concluída</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">
            Atualizando sua rotina...
          </h1>

          <p className="text-white/60 text-lg">
            Estamos atualizando sua rotina personalizada com base nas novas respostas.
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
          <div className="flex items-center gap-3 text-left justify-center">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-white/80">Processando suas respostas...</span>
          </div>
          <div className="flex items-center gap-3 text-left justify-center">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-white/80">Gerando rotina personalizada...</span>
          </div>
          <div className="flex items-center gap-3 text-left justify-center">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="text-white/80">Quase pronto...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

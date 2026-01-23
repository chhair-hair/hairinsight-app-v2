'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, Loader2 } from 'lucide-react';

export default function ReanaliseAnalisandoMascPage() {
  const router = useRouter();
  const { quizData, getThemeColors } = useQuiz();
  const colors = getThemeColors();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ APENAS salvar fotos e redirecionar - SEM OpenAI Vision
    const processPhotos = async () => {
      try {
        // Verificar se existem fotos
        if (!quizData.photos?.left || !quizData.photos?.right || !quizData.photos?.down) {
          setError('Fotos não encontradas. Redirecionando...');
          setTimeout(() => router.push('/reanalise-photos-masculina'), 2000);
          return;
        }

        console.log('[Reanálise] Fotos salvas no contexto. Redirecionando para app...');

        // Redirecionar direto para o app - as fotos já estão salvas no contexto
        setTimeout(() => {
          router.push('/app?updated=true');
        }, 2000);

      } catch (err: any) {
        console.error('[Reanálise] Erro ao processar:', err);
        setError('Erro ao processar. Redirecionando...');
        setTimeout(() => router.push('/reanalise-photos-masculina'), 3000);
      }
    };

    processPhotos();
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
            Salvando suas novas fotos e atualizando seu perfil.
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
              <span className="text-white/80">Salvando suas novas fotos...</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-white/80">Atualizando seu perfil...</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-white/80">Preparando seu app...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

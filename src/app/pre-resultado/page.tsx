'use client';

import { useEffect } from 'react';
import { useQuiz } from '@/lib/quiz-context';
import PreResultadoFeminino from '@/components/PreResultadoFeminino';
import PreResultadoMasculino from '@/components/PreResultadoMasculino';

export default function PreResultadoPage() {
  const { quizData } = useQuiz();

  // Debug: verificar qual gênero está sendo usado
  useEffect(() => {
    console.log('🔍 Gênero detectado na página /pre-resultado:', quizData.gender);
  }, [quizData.gender]);

  // Renderiza a versão correta baseada no gênero
  if (quizData.gender === 'masculino') {
    console.log('✅ Renderizando versão MASCULINA');
    return <PreResultadoMasculino />;
  }

  // Por padrão, renderiza a versão feminina
  console.log('✅ Renderizando versão FEMININA');
  return <PreResultadoFeminino />;
}

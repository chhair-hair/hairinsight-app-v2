// ✅ SEGURANÇA: Cliente-side faz chamadas APENAS para API routes
// NUNCA expõe API keys no frontend

export async function analyzeHairPhotos(photos: { left?: string; right?: string; down?: string }) {
  const images = [photos.left, photos.right, photos.down].filter(Boolean);

  if (images.length === 0) {
    throw new Error('Nenhuma foto fornecida para análise');
  }

  // Chamar API route segura (server-side)
  const response = await fetch('/api/analyze-photos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ photos }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao analisar fotos');
  }

  const data = await response.json();
  return data.analysis;
}

export async function generateFullRoutine(quizData: any, analysis: any) {
  // Chamar API route segura (server-side)
  const response = await fetch('/api/generate-routine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quizData, analysis }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao gerar rotina');
  }

  const data = await response.json();
  return data.routine;
}

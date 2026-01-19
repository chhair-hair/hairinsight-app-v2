// ✅ SEGURANÇA: Cliente-side faz chamadas APENAS para API routes
// NUNCA expõe API keys no frontend

export async function analyzeHairPhotos(photos: { left?: string; right?: string; down?: string }) {
  const images = [photos.left, photos.right, photos.down].filter(Boolean);

  if (images.length === 0) {
    throw new Error('Nenhuma foto fornecida para análise');
  }

  console.log('Enviando fotos para análise...');

  try {
    // Chamar API route segura (server-side)
    const response = await fetch('/api/analyze-photos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photos }),
    });

    console.log('[Frontend] Resposta recebida:', response.status, response.statusText);

    if (!response.ok) {
      const error = await response.json();
      console.error('[Frontend] Erro da API:', error);

      // Criar mensagem de erro mais clara
      const errorMsg = error.details || error.error || 'Erro ao analisar fotos';
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('[Frontend] Análise recebida com sucesso!');
    return data.analysis;
  } catch (err: any) {
    console.error('[Frontend] Erro completo:', err);

    // Se for erro de rede, criar mensagem específica
    if (err.message.includes('fetch')) {
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }

    throw err;
  }
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

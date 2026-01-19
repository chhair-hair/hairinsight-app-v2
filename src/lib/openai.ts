// ✅ SEGURANÇA: Cliente-side faz chamadas APENAS para API routes
// NUNCA expõe API keys no frontend

export async function analyzeHairPhotos(
  photos: { left?: string; right?: string; down?: string },
  quizData?: any
) {
  const images = [photos.left, photos.right, photos.down].filter(Boolean);

  if (images.length === 0) {
    throw new Error('Nenhuma foto fornecida para análise');
  }

  console.log('Enviando fotos e dados do quiz para análise...');
  console.log('Dados do quiz:', {
    hairType: quizData?.hairType,
    hairGoal: quizData?.hairGoal,
    washFrequency: quizData?.washFrequency
  });

  try {
    // Chamar API route segura (server-side) com dados do quiz
    const response = await fetch('/api/analyze-photos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ photos, quizData }),
    });

    console.log('[Frontend] Resposta recebida:', response.status, response.statusText);

    if (!response.ok) {
      let error;
      try {
        error = await response.json();
      } catch (parseError) {
        // Se não conseguir parsear JSON, ler como texto
        const textError = await response.text();
        console.error('[Frontend] Resposta não é JSON:', textError.substring(0, 200));
        throw new Error(`Erro no servidor (${response.status}). Verifique se a API está funcionando corretamente.`);
      }

      console.error('[Frontend] Erro da API:', error);

      // Criar mensagem de erro mais clara
      const errorMsg = error.details || error.error || 'Erro ao analisar fotos';
      throw new Error(errorMsg);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const textResponse = await response.text();
      console.error('[Frontend] Resposta de sucesso não é JSON:', textResponse.substring(0, 200));
      throw new Error('Erro ao processar resposta do servidor. A API pode não estar retornando dados no formato correto.');
    }

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

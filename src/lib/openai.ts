import OpenAI from 'openai';

// Cliente OpenAI (será configurado via env vars)
export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Para uso client-side
});

export async function analyzeHairPhotos(photos: { left?: string; right?: string; down?: string }) {
  const images = [photos.left, photos.right, photos.down].filter(Boolean) as string[];
  
  if (images.length === 0) {
    throw new Error('Nenhuma foto fornecida para análise');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analise estas fotos de cabelo e forneça uma análise detalhada em formato JSON com as seguintes informações:
            
            {
              "hairType": "tipo de cabelo (liso, ondulado, cacheado, crespo)",
              "damageLevel": "nível de dano (baixo, médio, alto)",
              "tendency": "tendência (oleoso, normal, seco, misto)",
              "faceShape": "formato do rosto",
              "recommendations": {
                "cuts": ["sugestões de cortes"],
                "colors": ["sugestões de cores"],
                "treatments": ["tratamentos recomendados"]
              }
            }
            
            Seja específico e profissional na análise.`,
          },
          ...images.map((image) => ({
            type: 'image_url' as const,
            image_url: { url: image },
          })),
        ],
      },
    ],
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content || '{}';
  return JSON.parse(content);
}

export async function generateFullRoutine(quizData: any, analysis: any) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: 'Você é um especialista em cuidados capilares. Crie rotinas personalizadas detalhadas.',
      },
      {
        role: 'user',
        content: `Com base nos seguintes dados, crie uma rotina capilar completa e personalizada:
        
        Dados do Quiz:
        - Tipo de cabelo: ${quizData.hairType}
        - Frequência de lavagem: ${quizData.washFrequency}
        - Produtos usados: ${quizData.productType}
        - Uso de calor: ${quizData.heatTools}
        - Objetivo: ${quizData.hairGoal}
        
        Análise de Fotos:
        - Tipo identificado: ${analysis.hairType}
        - Nível de dano: ${analysis.damageLevel}
        - Tendência: ${analysis.tendency}
        
        Forneça uma rotina semanal detalhada com:
        1. Cronograma de lavagens
        2. Tratamentos específicos por dia
        3. Produtos recomendados
        4. Dicas de manutenção
        5. Sugestões de cortes e cores
        
        Formato: texto estruturado e fácil de seguir.`,
      },
    ],
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content || '';
}

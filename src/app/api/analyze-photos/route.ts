import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // ✅ SEGURANÇA: API Key APENAS no servidor via variável de ambiente
    // Inicializa OpenAI apenas quando a rota é chamada
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key não configurada' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const body = await request.json();
    const { photos } = body;

    if (!photos || (!photos.left && !photos.right && !photos.down)) {
      return NextResponse.json(
        { error: 'Nenhuma foto fornecida para análise' },
        { status: 400 }
      );
    }

    const images = [photos.left, photos.right, photos.down].filter(Boolean);

    // Chamar OpenAI Vision API
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
                "scalpHealth": "saúde do couro cabeludo",
                "porosity": "porosidade (baixa, média, alta)",
                "thickness": "espessura dos fios (finos, médios, grossos)",
                "criticalIssues": ["lista de problemas críticos identificados"],
                "strengths": ["lista de pontos fortes do cabelo"],
                "recommendations": {
                  "immediate": ["ações imediatas recomendadas"],
                  "weekly": ["cuidados semanais"],
                  "monthly": ["tratamentos mensais"]
                }
              }

              Seja específico e profissional na análise.`,
            },
            ...images.map((image: string) => ({
              type: 'image_url' as const,
              image_url: { url: image },
            })),
          ],
        },
      ],
      max_tokens: 1500,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const analysis = JSON.parse(content);

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Erro ao analisar fotos:', error);
    return NextResponse.json(
      { error: 'Erro ao processar análise de fotos', details: error.message },
      { status: 500 }
    );
  }
}

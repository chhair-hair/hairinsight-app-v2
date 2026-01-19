import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// ✅ SEGURANÇA: API Key APENAS no servidor via variável de ambiente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Variável de ambiente SERVER-SIDE
});

export async function POST(request: NextRequest) {
  try {
    // Verificar se a chave API está configurada
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.error('OPENAI_API_KEY não configurada ou inválida');
      return NextResponse.json(
        { error: 'Chave da OpenAI não configurada. Configure OPENAI_API_KEY no arquivo .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { photos } = body;

    if (!photos || (!photos.left && !photos.right && !photos.down)) {
      return NextResponse.json(
        { error: 'Nenhuma foto fornecida para análise' },
        { status: 400 }
      );
    }

    const images = [photos.left, photos.right, photos.down].filter(Boolean);

    console.log(`Analisando ${images.length} fotos com OpenAI Vision...`);

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

    console.log('Resposta da OpenAI recebida, parseando JSON...');

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      console.error('Erro ao parsear JSON da OpenAI:', content);
      // Se não conseguir parsear, criar análise padrão
      analysis = {
        hairType: 'Cabelo Normal',
        damageLevel: 'Médio',
        tendency: 'Normal',
        scalpHealth: 'Saudável',
        porosity: 'Média',
        thickness: 'Médios',
        criticalIssues: ['Análise indisponível no momento'],
        strengths: ['Consulte um profissional para análise detalhada'],
        recommendations: {
          immediate: ['Usar shampoo suave', 'Hidratar regularmente'],
          weekly: ['Máscara de hidratação', 'Cronograma capilar'],
          monthly: ['Corte de pontas', 'Tratamento profundo']
        }
      };
    }

    console.log('Análise concluída com sucesso');

    return NextResponse.json({ success: true, analysis });
  } catch (error: any) {
    console.error('Erro detalhado ao analisar fotos:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return NextResponse.json(
      {
        error: 'Erro ao processar análise de fotos',
        details: error.message,
        hint: 'Verifique se a chave OPENAI_API_KEY está configurada corretamente'
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // ✅ SEGURANÇA: Busca chave da variável de ambiente da plataforma
    const apiKey = process.env.OPENAI_API_KEY_SECRET || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key não configurada nas variáveis de ambiente' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = await request.json();
    const { quizData, analysis } = body;

    if (!quizData || !analysis) {
      return NextResponse.json(
        { error: 'Dados incompletos para gerar rotina' },
        { status: 400 }
      );
    }

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

    const routine = response.choices[0]?.message?.content || '';

    return NextResponse.json({ success: true, routine });
  } catch (error: any) {
    console.error('Erro ao gerar rotina:', error);
    return NextResponse.json(
      { error: 'Erro ao processar geração de rotina', details: error.message },
      { status: 500 }
    );
  }
}

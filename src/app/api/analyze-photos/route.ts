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
        {
          error: 'Chave da OpenAI não configurada',
          details: 'Configure OPENAI_API_KEY no arquivo .env.local com sua chave da OpenAI'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { photos } = body;

    if (!photos || (!photos.left && !photos.right && !photos.down)) {
      return NextResponse.json(
        {
          error: 'Nenhuma foto fornecida',
          details: 'É necessário enviar pelo menos uma foto para análise'
        },
        { status: 400 }
      );
    }

    const images = [photos.left, photos.right, photos.down].filter(Boolean);

    console.log(`[OpenAI] Analisando ${images.length} fotos com Vision API...`);
    console.log(`[OpenAI] Chave configurada: ${process.env.OPENAI_API_KEY ? 'Sim' : 'Não'}`);
    console.log(`[OpenAI] Prefixo da chave: ${process.env.OPENAI_API_KEY?.substring(0, 10)}...`);

    // Chamar OpenAI Vision API
    console.log('[OpenAI] Iniciando chamada para API Vision...');

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

    console.log('[OpenAI] Resposta recebida com sucesso!');
    console.log('[OpenAI] Tokens usados:', response.usage);

    const content = response.choices[0]?.message?.content || '{}';

    console.log('[OpenAI] Parseando JSON da resposta...');
    console.log('[OpenAI] Preview do conteúdo:', content.substring(0, 200));

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
    console.error('[OpenAI] Erro detalhado:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      type: error.type,
      status: error.status
    });

    // Mensagens de erro específicas
    let errorMessage = 'Erro ao processar análise de fotos';
    let errorDetails = error.message;

    if (error.code === 'invalid_api_key') {
      errorMessage = 'Chave da OpenAI inválida';
      errorDetails = 'A chave OPENAI_API_KEY configurada não é válida. Verifique se você copiou a chave completa corretamente.';
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'Sem créditos na OpenAI';
      errorDetails = 'Sua conta da OpenAI não possui créditos suficientes. Adicione créditos em https://platform.openai.com/account/billing';
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Limite de requisições atingido';
      errorDetails = 'Aguarde alguns segundos e tente novamente.';
    } else if (error.status === 401) {
      errorMessage = 'Não autorizado';
      errorDetails = 'A chave da OpenAI está incorreta ou expirada. Verifique sua chave em https://platform.openai.com/api-keys';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        technicalInfo: error.message
      },
      { status: error.status || 500 }
    );
  }
}

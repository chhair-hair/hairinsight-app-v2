import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    // Buscar chave da OpenAI das variáveis de ambiente (prioriza OPENAI_API_KEY_SECRET da plataforma)
    const apiKey = process.env.OPENAI_API_KEY_SECRET || process.env.OPENAI_API_KEY;

    console.log('[OpenAI] Verificando chave API...');
    console.log('[OpenAI] OPENAI_API_KEY_SECRET:', process.env.OPENAI_API_KEY_SECRET ? 'Encontrada' : 'Não encontrada');
    console.log('[OpenAI] OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Encontrada' : 'Não encontrada');

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      console.error('OPENAI_API_KEY não configurada ou inválida');
      return NextResponse.json(
        {
          error: 'Chave da OpenAI não configurada',
          details: 'A variável de ambiente OPENAI_API_KEY_SECRET ou OPENAI_API_KEY precisa estar configurada'
        },
        { status: 500 }
      );
    }

    // Criar cliente OpenAI com a chave encontrada
    const openai = new OpenAI({ apiKey });

    const body = await request.json();
    const { photos, quizData } = body;

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
    console.log(`[OpenAI] Dados do quiz recebidos:`, {
      hairType: quizData?.hairType,
      hairGoal: quizData?.hairGoal,
      washFrequency: quizData?.washFrequency,
      heatTools: quizData?.heatTools
    });

    // Chamar OpenAI Vision API
    console.log('[OpenAI] Iniciando chamada para API Vision...');

    // Mapear dados do quiz para português
    const hairTypeMap: Record<string, string> = {
      'liso': 'Liso',
      'ondulado': 'Ondulado',
      'cacheado': 'Cacheado',
      'crespo': 'Crespo'
    };

    const hairGoalMap: Record<string, string> = {
      'hidratacao': 'Hidratação',
      'fortalecimento': 'Fortalecimento',
      'controle-frizz': 'Controle de Frizz',
      'crescimento': 'Crescimento Saudável'
    };

    const washFrequencyMap: Record<string, string> = {
      'diariamente': 'Diariamente',
      '2-3-vezes': '2-3 vezes por semana',
      'semanalmente': 'Semanalmente',
      'menos-uma-vez': 'Menos de uma vez por semana'
    };

    const heatToolsMap: Record<string, string> = {
      'sim-regularmente': 'Sim, regularmente (quase todos os dias)',
      'sim-ocasionalmente': 'Sim, ocasionalmente (1-2 vezes por semana)',
      'nao': 'Não uso ferramentas de calor'
    };

    const productTypeMap: Record<string, string> = {
      'convencionais': 'Produtos convencionais',
      'naturais': 'Produtos naturais/orgânicos',
      'nenhum': 'Não uso produtos',
      'outros': 'Outros produtos'
    };

    // Criar contexto completo do usuário
    const userContext = `
INFORMAÇÕES DO USUÁRIO (coletadas no questionário):

Tipo de Cabelo declarado: ${quizData?.hairType ? hairTypeMap[quizData.hairType] : 'Não informado'}
Objetivo Principal: ${quizData?.hairGoal ? hairGoalMap[quizData.hairGoal] : 'Não informado'}
Frequência de Lavagem: ${quizData?.washFrequency ? washFrequencyMap[quizData.washFrequency] : 'Não informado'}
Uso de Ferramentas de Calor: ${quizData?.heatTools ? heatToolsMap[quizData.heatTools] : 'Não informado'}
Produtos Usados: ${quizData?.productType ? productTypeMap[quizData.productType] : 'Não informado'}
${quizData?.productTypeOther ? `Produtos específicos: ${quizData.productTypeOther}` : ''}
    `.trim();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Você é um tricologista especializado em análise capilar. Analise as fotos do cabelo desta pessoa E considere as informações que ela forneceu no questionário.

${userContext}

IMPORTANTE: Compare sua análise visual das fotos com o que a pessoa declarou no questionário. Se houver diferenças, mencione isso de forma educativa e sugira o caminho correto.

Forneça uma análise COMPLETA e PERSONALIZADA em formato JSON:

{
  "hairType": "tipo real observado nas fotos (liso, ondulado, cacheado, crespo)",
  "hairTypeMatch": "true/false - se o tipo observado nas fotos corresponde ao declarado",
  "damageLevel": "nível de dano real observado (saudável, dano leve, dano moderado, dano severo)",
  "tendency": "tendência observada (oleoso, normal, seco, misto)",
  "scalpHealth": "saúde do couro cabeludo observada",
  "porosity": "porosidade estimada (baixa, média, alta)",
  "thickness": "espessura dos fios (finos, médios, grossos)",
  "criticalIssues": ["problemas REAIS que você vê nas fotos e que precisam de atenção URGENTE"],
  "strengths": ["pontos fortes reais do cabelo que você observa nas fotos"],
  "goalAlignment": {
    "isOnTrack": "true/false - se a rotina atual está alinhada com o objetivo da pessoa",
    "message": "mensagem educativa sobre o progresso em relação ao objetivo (${quizData?.hairGoal ? hairGoalMap[quizData.hairGoal] : 'objetivo'})"
  },
  "recommendations": {
    "immediate": [
      "3-4 ações ESPECÍFICAS para aplicar HOJE, considerando o objetivo de ${quizData?.hairGoal ? hairGoalMap[quizData.hairGoal] : 'saúde capilar'}",
      "Seja ESPECÍFICO sobre tipos de produtos (ex: 'máscara de hidratação profunda com ceramidas', não apenas 'hidratar')"
    ],
    "weekly": [
      "3-4 práticas semanais ESPECÍFICAS para manter a saúde e alcançar ${quizData?.hairGoal ? hairGoalMap[quizData.hairGoal] : 'o objetivo'}",
      "Inclua cronograma capilar se necessário (hidratação/nutrição/reconstrução)"
    ],
    "monthly": [
      "2-3 tratamentos mensais PROFISSIONAIS ou intensivos",
      "Considere o objetivo de ${quizData?.hairGoal ? hairGoalMap[quizData.hairGoal] : 'saúde capilar'}"
    ]
  },
  "productSuggestions": {
    "avoid": ["ingredientes ou tipos de produtos que esta pessoa deve EVITAR baseado no que você vê"],
    "prioritize": ["ingredientes ou tipos de produtos que devem ser PRIORIDADE para alcançar ${quizData?.hairGoal ? hairGoalMap[quizData.hairGoal] : 'o objetivo'}"]
  },
  "routineAdjustments": [
    "Ajustes específicos na rotina considerando frequência de lavagem (${quizData?.washFrequency ? washFrequencyMap[quizData.washFrequency] : 'atual'})",
    "Cuidados especiais se usa calor (${quizData?.heatTools ? heatToolsMap[quizData.heatTools] : 'não informado'})"
  ]
}

Seja HONESTO, ESPECÍFICO e EDUCATIVO. Se a pessoa precisa mudar algo na rotina, diga claramente mas de forma gentil.`,
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

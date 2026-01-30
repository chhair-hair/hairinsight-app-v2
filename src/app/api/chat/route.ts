import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, gender, hairType, hairGoal, washFrequency } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Buscar chave da OpenAI (prioriza OPENAI_API_KEY_SECRET da plataforma)
    const apiKeySecret = process.env.OPENAI_API_KEY_SECRET;
    const apiKey = process.env.OPENAI_API_KEY;
    const finalKey = apiKeySecret || apiKey;

    if (!finalKey || finalKey === 'your_openai_api_key_here') {
      return NextResponse.json(
        { error: 'Chave da OpenAI não configurada corretamente' },
        { status: 500 }
      );
    }

    // Criar contexto personalizado baseado no perfil do usuário
    const userContext = [];
    if (gender) userContext.push(`Gênero: ${gender}`);
    if (hairType) userContext.push(`Tipo de cabelo: ${hairType}`);
    if (hairGoal) {
      const goals: Record<string, string> = {
        'hidratacao': 'hidratação',
        'fortalecimento': 'fortalecimento',
        'controle-frizz': 'controle de frizz',
        'crescimento': 'crescimento'
      };
      userContext.push(`Objetivo: ${goals[hairGoal] || hairGoal}`);
    }
    if (washFrequency) {
      const frequencies: Record<string, string> = {
        'diariamente': 'lava diariamente',
        '2-3-vezes': 'lava 2-3 vezes por semana',
        'semanalmente': 'lava semanalmente',
        'menos-uma-vez': 'lava menos de uma vez por semana'
      };
      userContext.push(`Frequência de lavagem: ${frequencies[washFrequency] || washFrequency}`);
    }

    const contextString = userContext.length > 0
      ? `\n\nInformações do usuário:\n${userContext.join('\n')}`
      : '';

    // Fazer requisição para OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${finalKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente virtual especializado em cuidados capilares chamado HairInsight AI.

Suas características:
- Você é amigável, empático e prestativo
- Fornece conselhos baseados em evidências científicas sobre cabelos
- Personaliza suas respostas com base no perfil do usuário
- Usa linguagem clara e acessível, evitando termos muito técnicos
- Sempre que possível, explica o "porquê" por trás das recomendações
- Incentiva práticas saudáveis de cuidados capilares
- Se não tiver certeza sobre algo médico, recomenda consultar um dermatologista

Tópicos que você domina:
- Tipos de cabelo e suas características
- Rotinas de cuidados (hidratação, nutrição, reconstrução)
- Produtos capilares e seus ingredientes
- Cronograma capilar
- Problemas capilares comuns (queda, ressecamento, frizz, etc.)
- Técnicas de finalização
- Transição capilar
- Cuidados com químicas e processos${contextString}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro OpenAI:', errorData);
      return NextResponse.json(
        { error: 'Erro ao processar sua mensagem com a IA' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'Desculpe, não consegui gerar uma resposta.';

    return NextResponse.json({
      message: aiMessage,
      model: data.model,
    });

  } catch (error: any) {
    console.error('Erro no chat:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar mensagem', details: error.message },
      { status: 500 }
    );
  }
}

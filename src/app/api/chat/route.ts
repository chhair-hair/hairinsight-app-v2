import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API Key não configurada. Configure OPENAI_API_KEY nas variáveis secretas.' },
        { status: 500 }
      );
    }

    const { messages, quizData } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Mensagens inválidas' },
        { status: 400 }
      );
    }

    console.log('[Chat API] Nova conversa iniciada');
    console.log('[Chat API] Dados do usuário:', {
      hairType: quizData?.hairType,
      gender: quizData?.gender,
      hairGoal: quizData?.hairGoal
    });

    const openai = new OpenAI({ apiKey });

    // System prompt com contexto do usuário
    const systemPrompt = `Você é uma assistente especialista em cuidados capilares, criada para ajudar usuários do app de rotina capilar.

INFORMAÇÕES DO USUÁRIO:
- Gênero: ${quizData?.gender || 'Não informado'}
- Tipo de Cabelo: ${quizData?.hairType || 'Não informado'}
- Objetivo: ${quizData?.hairGoal?.replace('-', ' ') || 'Não informado'}
- Frequência de Lavagem: ${quizData?.washFrequency || 'Não informado'}
${quizData?.analysis?.hairType ? `- Tipo Observado (IA): ${quizData.analysis.hairType}` : ''}
${quizData?.analysis?.damageLevel ? `- Nível de Dano: ${quizData.analysis.damageLevel}` : ''}
${quizData?.analysis?.tendency ? `- Tendência: ${quizData.analysis.tendency}` : ''}

INSTRUÇÕES:
- Responda SEMPRE em português brasileiro
- Seja amigável, empática e encorajadora
- Use emojis ocasionalmente para deixar a conversa mais leve
- Forneça respostas práticas e acionáveis
- Adapte suas respostas ao tipo de cabelo e objetivo do usuário
- Se não souber algo, seja honesta e sugira consultar um profissional
- Mantenha respostas concisas (máximo 3-4 parágrafos)
- Use linguagem acessível, não técnica demais

TÓPICOS QUE VOCÊ PODE AJUDAR:
✅ Identificação de tipo de cabelo
✅ Rotinas capilares personalizadas
✅ Cronograma capilar (hidratação, nutrição, reconstrução)
✅ Produtos e ingredientes
✅ Técnicas de lavagem e finalização
✅ Tratamento de problemas (frizz, queda, ressecamento, etc.)
✅ Dicas de cuidados específicos
✅ Interpretação de rótulos de produtos

IMPORTANTE:
❌ Não diagnostique problemas médicos
❌ Não recomende tratamentos médicos
❌ Não substitua consulta com dermatologista para problemas graves
✅ Sugira consultar profissional quando necessário`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Modelo mais rápido e econômico
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const assistantMessage = response.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error('Resposta vazia da OpenAI');
    }

    console.log('[Chat API] Resposta gerada com sucesso');

    return NextResponse.json({
      message: assistantMessage,
      usage: {
        prompt_tokens: response.usage?.prompt_tokens,
        completion_tokens: response.usage?.completion_tokens,
        total_tokens: response.usage?.total_tokens,
      }
    });

  } catch (error: any) {
    console.error('[Chat API] Erro:', error);

    // Erros específicos da OpenAI
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'Chave OpenAI inválida. Verifique a configuração.' },
        { status: 500 }
      );
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'Limite de requisições atingido. Tente novamente em alguns segundos.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Erro ao processar mensagem' },
      { status: 500 }
    );
  }
}

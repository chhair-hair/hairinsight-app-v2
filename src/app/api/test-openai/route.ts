import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar variáveis de ambiente (prioriza OPENAI_API_KEY_SECRET da plataforma)
    const apiKeySecret = process.env.OPENAI_API_KEY_SECRET;
    const apiKey = process.env.OPENAI_API_KEY;
    const finalKey = apiKeySecret || apiKey;

    const result: any = {
      OPENAI_API_KEY_SECRET: apiKeySecret ? 'Configurada ✅' : 'Não encontrada ❌',
      OPENAI_API_KEY: apiKey ? 'Configurada ✅' : 'Não encontrada ❌',
      keyUsed: apiKeySecret ? 'OPENAI_API_KEY_SECRET (plataforma)' : (apiKey ? 'OPENAI_API_KEY (local)' : 'Nenhuma')
    };

    if (!finalKey) {
      return NextResponse.json({
        success: false,
        error: 'Nenhuma chave OpenAI configurada',
        ...result
      });
    }

    if (finalKey === 'your_openai_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'Chave ainda está com valor padrão',
        ...result
      });
    }

    // Verificar formato da chave
    const keyFormat = finalKey.substring(0, 10) + '...';

    return NextResponse.json({
      success: true,
      message: 'Chave configurada corretamente ✅',
      keyFormat,
      keyLength: finalKey.length,
      ...result
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

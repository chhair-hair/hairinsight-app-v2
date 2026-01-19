import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar variável de ambiente
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY não está configurada',
        env: 'não encontrada'
      });
    }

    if (apiKey === 'your_openai_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEY ainda está com valor padrão',
        env: 'valor padrão'
      });
    }

    // Verificar formato da chave
    const keyFormat = apiKey.substring(0, 8) + '...';

    return NextResponse.json({
      success: true,
      message: 'Chave configurada corretamente',
      keyFormat,
      keyLength: apiKey.length
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

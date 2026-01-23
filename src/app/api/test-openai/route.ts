import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // ✅ Verificar variável secreta OPENAI_API_KEY
    const apiKey = process.env.OPENAI_API_KEY;

    console.log('[Test OpenAI] Verificando configuração...');
    console.log('[Test OpenAI] OPENAI_API_KEY:', apiKey ? 'Encontrada ✅' : 'Não encontrada ❌');

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Chave OpenAI não configurada',
        details: 'Configure a variável secreta OPENAI_API_KEY na plataforma Lasy',
        OPENAI_API_KEY: 'Não encontrada ❌'
      });
    }

    if (apiKey === 'your_openai_api_key_here') {
      return NextResponse.json({
        success: false,
        error: 'Chave com valor padrão',
        details: 'A chave ainda está com o valor placeholder. Configure uma chave real.',
        OPENAI_API_KEY: 'Configurada mas inválida ⚠️'
      });
    }

    // Verificar formato da chave
    const keyFormat = apiKey.substring(0, 10) + '...';
    const keyLength = apiKey.length;

    console.log('[Test OpenAI] Chave válida:', keyFormat, `(${keyLength} caracteres)`);

    return NextResponse.json({
      success: true,
      message: 'Chave configurada corretamente ✅',
      keyFormat,
      keyLength,
      OPENAI_API_KEY: 'Configurada ✅'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

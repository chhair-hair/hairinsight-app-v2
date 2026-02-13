import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Lista todas as variáveis de ambiente que começam com OPENAI
    const envVars = Object.keys(process.env)
      .filter(key => key.includes('OPENAI') || key.includes('SECRET'))
      .reduce((acc, key) => {
        // Não expor valores, apenas mostrar se existem
        acc[key] = process.env[key] ? `Configurada (${process.env[key]?.substring(0, 10)}...)` : 'Não encontrada';
        return acc;
      }, {} as Record<string, string>);

    return NextResponse.json({
      success: true,
      message: 'Variáveis de ambiente detectadas',
      variables: envVars,
      allEnvKeys: Object.keys(process.env).filter(k => !k.includes('ANTHROPIC') && !k.includes('SANDBOX')).sort()
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

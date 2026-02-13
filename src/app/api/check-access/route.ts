import { NextRequest, NextResponse } from 'next/server';
import { checkUserAccess } from '@/lib/access-control';

/**
 * Endpoint para verificar se um usuário tem acesso
 * GET /api/check-access?email=user@example.com&productId=123
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const email = searchParams.get('email');
    const productId = searchParams.get('productId');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    const result = await checkUserAccess(email, productId || undefined);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar acesso' },
      { status: 500 }
    );
  }
}

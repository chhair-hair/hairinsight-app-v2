import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const adminParam = searchParams.get('admin');
  
  // Lê a chave secreta do servidor (NUNCA exposta ao cliente)
  const ADMIN_KEY = process.env.ADMIN_KEY;
  
  // Verifica se a chave fornecida corresponde à chave secreta
  const isValid = adminParam === ADMIN_KEY;
  
  return NextResponse.json({ isAdmin: isValid });
}

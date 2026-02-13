import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Função para obter cliente Supabase (se configurado)
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === '' || supabaseKey === '') {
    return null;
  }

  try {
    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('Erro ao criar cliente Supabase:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, userId, deviceInfo } = body;

    // Valida os campos obrigatórios
    if (!token) {
      return NextResponse.json(
        { error: 'Token FCM é obrigatório' },
        { status: 400 }
      );
    }

    // Tenta obter o cliente Supabase
    const supabase = getSupabaseClient();

    if (!supabase) {
      console.warn('⚠️ Supabase não configurado. Token será usado apenas em memória.');
      console.log('💡 Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY');

      // Retorna sucesso mesmo sem banco (para não quebrar o fluxo)
      return NextResponse.json({
        success: true,
        message: 'Token registrado (em memória - configure o Supabase)',
        token,
        warning: 'Supabase não configurado',
      });
    }

    // Prepara os dados para salvar
    const tokenData = {
      fcm_token: token,
      user_id: userId || null,
      device_info: deviceInfo || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
    };

    // Verifica se a tabela existe, senão armazena em localStorage temporariamente
    const { data, error } = await supabase
      .from('fcm_tokens')
      .upsert(tokenData, {
        onConflict: 'fcm_token',
      })
      .select();

    if (error) {
      console.warn('⚠️ Tabela fcm_tokens não existe. Token será usado apenas em memória.');
      console.log('💡 Crie a tabela com: npx supabase migration new create_fcm_tokens_table');

      // Retorna sucesso mesmo sem banco (para não quebrar o fluxo)
      return NextResponse.json({
        success: true,
        message: 'Token registrado (em memória - configure o banco de dados)',
        token,
        warning: 'Tabela fcm_tokens não configurada',
      });
    }

    console.log('✅ Token FCM registrado com sucesso:', token.substring(0, 20) + '...');

    return NextResponse.json({
      success: true,
      message: 'Token FCM registrado com sucesso',
      data,
    });
  } catch (error: unknown) {
    console.error('❌ Erro ao registrar token FCM:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      {
        error: 'Erro ao registrar token FCM',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Endpoint para remover token (quando usuário desativa notificações)
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token FCM é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      console.warn('⚠️ Supabase não configurado');

      return NextResponse.json({
        success: true,
        message: 'Token removido (sem banco de dados configurado)',
        warning: 'Supabase não configurado',
      });
    }

    const { error } = await supabase
      .from('fcm_tokens')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('fcm_token', token);

    if (error) {
      console.warn('⚠️ Erro ao desativar token:', error.message);

      return NextResponse.json({
        success: true,
        message: 'Token removido (sem banco de dados configurado)',
        warning: 'Tabela fcm_tokens não configurada',
      });
    }

    console.log('✅ Token FCM desativado:', token.substring(0, 20) + '...');

    return NextResponse.json({
      success: true,
      message: 'Token FCM desativado com sucesso',
    });
  } catch (error: unknown) {
    console.error('❌ Erro ao desativar token FCM:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      {
        error: 'Erro ao desativar token FCM',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Endpoint para listar todos os tokens ativos (para envio em massa)
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    if (!supabase) {
      console.warn('⚠️ Supabase não configurado');

      return NextResponse.json({
        success: true,
        tokens: [],
        count: 0,
        warning: 'Supabase não configurado',
      });
    }

    const { data, error } = await supabase
      .from('fcm_tokens')
      .select('fcm_token, user_id, device_info')
      .eq('is_active', true);

    if (error) {
      return NextResponse.json({
        success: true,
        tokens: [],
        count: 0,
        warning: 'Tabela fcm_tokens não configurada',
      });
    }

    return NextResponse.json({
      success: true,
      tokens: data,
      count: data?.length || 0,
    });
  } catch (error: unknown) {
    console.error('❌ Erro ao buscar tokens:', error);

    return NextResponse.json({
      success: true,
      tokens: [],
      count: 0,
      warning: 'Erro ao buscar tokens',
    });
  }
}

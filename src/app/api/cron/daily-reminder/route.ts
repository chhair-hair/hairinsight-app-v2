import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para ser chamada pelo Vercel Cron
 *
 * Configuração no vercel.json:
 * {
 *   "crons": [
 *     {
 *       "path": "/api/cron/daily-reminder",
 *       "schedule": "0 9 * * *"
 *     }
 *   ]
 * }
 */

export async function GET(request: NextRequest) {
  try {
    // Verifica se a requisição vem do Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log('🔔 [CRON] Iniciando envio de lembretes diários...');

    // Busca todos os tokens ativos
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const tokensResponse = await fetch(`${baseUrl}/api/register-fcm-token`, {
      method: 'GET',
    });

    if (!tokensResponse.ok) {
      throw new Error(`Erro ao buscar tokens: ${tokensResponse.statusText}`);
    }

    const { tokens, count } = await tokensResponse.json();

    if (!tokens || count === 0) {
      console.log('⚠️ [CRON] Nenhum token ativo encontrado');
      return NextResponse.json({
        success: true,
        message: 'Nenhum usuário para notificar',
        sent: 0,
      });
    }

    console.log(`📊 [CRON] ${count} tokens ativos encontrados`);

    // Extrai apenas os tokens FCM
    const fcmTokens = tokens.map((t: any) => t.fcm_token);

    // Define mensagens baseadas no horário
    const hour = new Date().getHours();
    let message = {
      title: '💆‍♀️ Hora da sua rotina capilar',
      body: 'Não esqueça de aplicar seu produto hoje!',
    };

    if (hour >= 6 && hour < 12) {
      message = {
        title: '🌅 Bom dia! Hora da rotina matinal',
        body: 'Comece o dia cuidando dos seus cabelos',
      };
    } else if (hour >= 18 && hour < 23) {
      message = {
        title: '🌙 Rotina noturna capilar',
        body: 'Hora de preparar seus cabelos para dormir',
      };
    }

    // Envia notificação em massa
    const sendResponse = await fetch(`${baseUrl}/api/send-notification`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokens: fcmTokens,
        title: message.title,
        body: message.body,
        data: {
          url: '/app',
          type: 'daily-reminder',
          timestamp: new Date().toISOString(),
        },
      }),
    });

    if (!sendResponse.ok) {
      throw new Error(`Erro ao enviar notificações: ${sendResponse.statusText}`);
    }

    const result = await sendResponse.json();

    console.log(`✅ [CRON] ${result.successCount} notificações enviadas com sucesso`);

    if (result.failureCount > 0) {
      console.log(`❌ [CRON] ${result.failureCount} notificações falharam`);
    }

    return NextResponse.json({
      success: true,
      sent: result.successCount,
      failed: result.failureCount,
      message: `${result.successCount} notificações enviadas`,
    });
  } catch (error: unknown) {
    console.error('❌ [CRON] Erro ao enviar lembretes:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      {
        error: 'Erro ao enviar lembretes',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Também permite POST para testes manuais
export async function POST(request: NextRequest) {
  return GET(request);
}

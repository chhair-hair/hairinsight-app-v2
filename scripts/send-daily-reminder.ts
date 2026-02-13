/**
 * Script para enviar lembretes diários
 *
 * Exemplo de uso com cron ou agendador:
 * - Vercel Cron Jobs
 * - GitHub Actions
 * - Node-cron
 *
 * Execute manualmente:
 * npx tsx scripts/send-daily-reminder.ts
 */

async function sendDailyReminders() {
  try {
    console.log('🔔 Iniciando envio de lembretes diários...');

    // Busca todos os tokens ativos
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/register-fcm-token`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar tokens: ${response.statusText}`);
    }

    const { tokens, count } = await response.json();

    if (!tokens || count === 0) {
      console.log('⚠️ Nenhum token ativo encontrado');
      return;
    }

    console.log(`📊 ${count} tokens ativos encontrados`);

    // Extrai apenas os tokens FCM
    const fcmTokens = tokens.map((t: any) => t.fcm_token);

    // Define a mensagem do dia (você pode personalizar baseado no horário, dia da semana, etc)
    const messages = [
      {
        title: '🌅 Bom dia! Hora da rotina matinal',
        body: 'Aplique seu shampoo e condicionador favorito',
      },
      {
        title: '💆‍♀️ Hora da sua rotina capilar',
        body: 'Não esqueça de hidratar seus cabelos hoje!',
      },
      {
        title: '✨ Cuide dos seus cabelos',
        body: 'Aplique seu sérum anti-frizz para um dia perfeito',
      },
    ];

    // Escolhe uma mensagem aleatória
    const message = messages[Math.floor(Math.random() * messages.length)];

    // Envia notificação em massa
    const sendResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-notification`, {
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
        },
      }),
    });

    if (!sendResponse.ok) {
      throw new Error(`Erro ao enviar notificações: ${sendResponse.statusText}`);
    }

    const result = await sendResponse.json();

    console.log(`✅ ${result.successCount} notificações enviadas com sucesso`);

    if (result.failureCount > 0) {
      console.log(`❌ ${result.failureCount} notificações falharam`);
    }

    return {
      success: true,
      sent: result.successCount,
      failed: result.failureCount,
    };
  } catch (error) {
    console.error('❌ Erro ao enviar lembretes:', error);
    throw error;
  }
}

// Executa o script se for chamado diretamente
if (require.main === module) {
  sendDailyReminders()
    .then((result) => {
      console.log('✅ Script finalizado:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script falhou:', error);
      process.exit(1);
    });
}

export default sendDailyReminders;

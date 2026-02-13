import { NextRequest, NextResponse } from 'next/server';
import { getMessaging } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, title, body: messageBody, data, imageUrl } = body;

    // Obtém instância do messaging
    const messaging = getMessaging();

    if (!messaging) {
      return NextResponse.json(
        {
          error: 'Firebase Admin não configurado',
          details: 'Configure as variáveis de ambiente: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
        },
        { status: 503 }
      );
    }

    // Valida os campos obrigatórios
    if (!token) {
      return NextResponse.json(
        { error: 'Token FCM é obrigatório' },
        { status: 400 }
      );
    }

    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'Título e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    // Constrói a mensagem FCM usando HTTP v1
    const message = {
      token,
      notification: {
        title,
        body: messageBody,
        ...(imageUrl && { imageUrl }),
      },
      webpush: {
        notification: {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          requireInteraction: true,
          actions: [
            {
              action: 'open',
              title: 'Abrir App',
            },
            {
              action: 'close',
              title: 'Fechar',
            },
          ],
        },
        fcmOptions: {
          link: data?.url || '/app',
        },
      },
      // Dados customizados (opcional)
      ...(data && { data }),
    };

    // Envia a notificação via Firebase Cloud Messaging
    const response = await messaging.send(message);

    console.log('✅ Notificação enviada com sucesso:', response);

    return NextResponse.json({
      success: true,
      messageId: response,
      message: 'Notificação enviada com sucesso',
    });
  } catch (error: unknown) {
    console.error('❌ Erro ao enviar notificação:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      {
        error: 'Erro ao enviar notificação',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// Endpoint para enviar notificações em massa
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokens, title, body: messageBody, data, imageUrl } = body;

    // Obtém instância do messaging
    const messaging = getMessaging();

    if (!messaging) {
      return NextResponse.json(
        {
          error: 'Firebase Admin não configurado',
          details: 'Configure as variáveis de ambiente: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY'
        },
        { status: 503 }
      );
    }

    if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
      return NextResponse.json(
        { error: 'Lista de tokens é obrigatória' },
        { status: 400 }
      );
    }

    if (!title || !messageBody) {
      return NextResponse.json(
        { error: 'Título e mensagem são obrigatórios' },
        { status: 400 }
      );
    }

    // Envia notificações em lote (máximo 500 por vez)
    const messages = tokens.map(token => ({
      token,
      notification: {
        title,
        body: messageBody,
        ...(imageUrl && { imageUrl }),
      },
      webpush: {
        notification: {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
        },
        fcmOptions: {
          link: data?.url || '/app',
        },
      },
      ...(data && { data }),
    }));

    const response = await messaging.sendEach(messages);

    console.log(`✅ ${response.successCount} notificações enviadas de ${tokens.length}`);

    if (response.failureCount > 0) {
      console.log(`❌ ${response.failureCount} notificações falharam`);
    }

    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses,
    });
  } catch (error: unknown) {
    console.error('❌ Erro ao enviar notificações em massa:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      {
        error: 'Erro ao enviar notificações em massa',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

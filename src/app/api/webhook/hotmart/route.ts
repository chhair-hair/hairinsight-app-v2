import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Tipos de eventos da Hotmart
type HotmartEvent =
  | 'PURCHASE_APPROVED'
  | 'PURCHASE_REFUNDED'
  | 'PURCHASE_CHARGEBACK'
  | 'PURCHASE_CANCELLED';

interface HotmartWebhookPayload {
  event: HotmartEvent;
  data: {
    purchase: {
      order_id?: string;
      transaction?: string;
      status?: string;
      buyer?: {
        name?: string;
        email?: string;
      };
      product?: {
        id?: string | number;
        name?: string;
        has_co_production?: boolean;
      };
      price?: {
        value?: number;
        currency_code?: string;
      };
      commissions?: Array<{
        currency_code?: string;
        value?: number;
      }>;
      payment?: {
        type?: string;
      };
    };
    product?: {
      id?: string | number;
      name?: string;
    };
    buyer?: {
      name?: string;
      email?: string;
    };
    commissions?: Array<{
      currency_code?: string;
      value?: number;
    }>;
  };
  id?: string;
  creation_date?: number;
}

/**
 * Valida a assinatura HMAC do webhook da Hotmart
 */
function validateHotmartSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) {
    return false;
  }

  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('hex');

  // Comparação segura para evitar timing attacks
  return signature === calculatedSignature;
}

/**
 * Processa o evento de compra aprovada
 */
async function handlePurchaseApproved(payload: HotmartWebhookPayload) {
  const { purchase } = payload.data;

  // Extrai dados com fallbacks para diferentes estruturas do payload da Hotmart
  const buyerEmail = purchase.buyer?.email || payload.data.buyer?.email;
  const productId = purchase.product?.id || payload.data.product?.id;
  const orderId = purchase.order_id || payload.id;

  // Validação dos campos obrigatórios (NOT NULL)
  if (!buyerEmail) {
    console.error('Email do comprador não encontrado no payload:', JSON.stringify(payload, null, 2));
    throw new Error('Email do comprador é obrigatório');
  }

  if (!productId) {
    console.error('ID do produto não encontrado no payload:', JSON.stringify(payload, null, 2));
    throw new Error('ID do produto é obrigatório');
  }

  if (!orderId) {
    console.error('ID da compra não encontrado no payload:', JSON.stringify(payload, null, 2));
    throw new Error('ID da compra é obrigatório');
  }

  // Monta o objeto com todos os campos mapeados corretamente
  const purchaseData = {
    // Campos NOT NULL obrigatórios
    email: buyerEmail.toLowerCase(),
    product_id: String(productId),
    purchase_id: String(orderId),
    status: 'approved' as const,

    // Campos opcionais
    transaction_id: purchase.transaction || null,
    amount: purchase.price?.value || null,
    currency: purchase.price?.currency_code || 'BRL',
    buyer_name: purchase.buyer?.name || payload.data.buyer?.name || null,
    buyer_email: buyerEmail,
    webhook_data: payload,
  };

  console.log('Dados da compra processados:', {
    email: purchaseData.email,
    product_id: purchaseData.product_id,
    purchase_id: purchaseData.purchase_id,
    status: purchaseData.status,
  });

  // Verifica se já existe uma compra com esse ID
  const { data: existing, error: selectError } = await supabaseAdmin
    .from('hotmart_purchases')
    .select('id, status')
    .eq('purchase_id', purchaseData.purchase_id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    // PGRST116 = not found (esperado quando não existe)
    console.error('Erro ao buscar compra existente:', selectError);
    throw selectError;
  }

  if (existing) {
    // Atualiza se existir
    const { error } = await supabaseAdmin
      .from('hotmart_purchases')
      .update(purchaseData)
      .eq('purchase_id', purchaseData.purchase_id);

    if (error) {
      console.error('Erro ao atualizar compra:', error);
      throw error;
    }

    console.log('Compra atualizada com sucesso:', purchaseData.purchase_id);
    return { action: 'updated', email: purchaseData.email };
  } else {
    // Insere se não existir
    const { error } = await supabaseAdmin
      .from('hotmart_purchases')
      .insert(purchaseData);

    if (error) {
      console.error('Erro ao inserir compra:', error);
      console.error('Dados que tentou inserir:', JSON.stringify(purchaseData, null, 2));
      throw error;
    }

    console.log('Compra criada com sucesso:', purchaseData.purchase_id);
    return { action: 'created', email: purchaseData.email };
  }
}

/**
 * Processa eventos de remoção de acesso (reembolso, chargeback, cancelamento)
 */
async function handlePurchaseRevoked(payload: HotmartWebhookPayload, status: 'refunded' | 'chargeback' | 'cancelled') {
  const { purchase } = payload.data;
  const purchaseId = purchase.order_id || payload.id || '';

  const { error } = await supabaseAdmin
    .from('hotmart_purchases')
    .update({
      status,
      webhook_data: payload,
    })
    .eq('purchase_id', purchaseId);

  if (error) throw error;

  return { action: 'revoked', status, purchaseId };
}

/**
 * Endpoint POST do webhook da Hotmart
 */
export async function POST(request: NextRequest) {
  try {
    console.log('=== Webhook Hotmart recebido ===');

    // 1. Valida a presença do secret
    const secret = process.env.HOTMART_WEBHOOK_SECRET;
    if (!secret) {
      console.error('HOTMART_WEBHOOK_SECRET não configurado');
      return NextResponse.json(
        { error: 'Configuração inválida' },
        { status: 500 }
      );
    }

    // 2. Lê o corpo da requisição ANTES de fazer qualquer parse
    // CRÍTICO: A Hotmart valida a assinatura com o body RAW
    const rawBody = await request.text();
    console.log('Body recebido (primeiros 200 chars):', rawBody.substring(0, 200));

    // 3. Valida a assinatura HMAC com o body bruto
    const signature = request.headers.get('x-hotmart-hottok');
    console.log('Assinatura recebida:', signature ? `${signature.substring(0, 20)}...` : 'AUSENTE');

    if (!signature) {
      console.error('Header x-hotmart-hottok ausente');
      return NextResponse.json(
        { error: 'Assinatura ausente' },
        { status: 401 }
      );
    }

    // Valida a assinatura ANTES de fazer o parse do JSON
    if (!validateHotmartSignature(rawBody, signature, secret)) {
      console.error('Assinatura HMAC inválida - Secret ou body diferente do esperado');
      console.error('Tamanho do body:', rawBody.length);
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 401 }
      );
    }

    console.log('Assinatura validada com sucesso');

    // 4. Parse do payload SOMENTE APÓS validar a assinatura
    const payload: HotmartWebhookPayload = JSON.parse(rawBody);
    console.log('Evento recebido:', payload.event);

    // 5. Processa o evento
    let result;

    switch (payload.event) {
      case 'PURCHASE_APPROVED':
        result = await handlePurchaseApproved(payload);
        break;

      case 'PURCHASE_REFUNDED':
        result = await handlePurchaseRevoked(payload, 'refunded');
        break;

      case 'PURCHASE_CHARGEBACK':
        result = await handlePurchaseRevoked(payload, 'chargeback');
        break;

      case 'PURCHASE_CANCELLED':
        result = await handlePurchaseRevoked(payload, 'cancelled');
        break;

      default:
        console.log('Evento não processado:', payload.event);
        return NextResponse.json({ received: true });
    }

    // 6. Retorna sucesso
    console.log('✅ Webhook processado com sucesso:', result);
    return NextResponse.json({ success: true, ...result });

  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);

    // Retorna detalhes do erro para facilitar debug
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    return NextResponse.json(
      {
        error: 'Erro interno ao processar webhook',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Endpoint GET para testar se a rota está ativa
 */
export async function GET() {
  return NextResponse.json({
    message: 'Webhook da Hotmart está ativo',
    endpoint: '/api/webhook/hotmart',
  });
}

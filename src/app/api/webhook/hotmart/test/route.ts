import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

/**
 * Endpoint de DEBUG para testar o webhook da Hotmart
 * Acesse: /api/webhook/hotmart/test
 */
export async function POST(request: NextRequest) {
  try {
    console.log('\n=== 🔍 DEBUG WEBHOOK HOTMART ===\n');

    // 1. Verifica o secret
    const secret = process.env.HOTMART_WEBHOOK_SECRET;
    console.log('✓ Secret configurado:', secret ? 'SIM' : 'NÃO');

    if (secret) {
      console.log('  - Tamanho do secret:', secret.length, 'caracteres');
      console.log('  - Primeiros 10 chars:', secret.substring(0, 10) + '...');
      console.log('  - Últimos 10 chars:', '...' + secret.substring(secret.length - 10));
      console.log('  - Tem espaços no início?', secret.startsWith(' ') ? 'SIM ❌' : 'NÃO ✓');
      console.log('  - Tem espaços no fim?', secret.endsWith(' ') ? 'SIM ❌' : 'NÃO ✓');
    }

    // 2. Lê o body bruto
    const rawBody = await request.text();
    console.log('\n✓ Body recebido:');
    console.log('  - Tamanho:', rawBody.length, 'bytes');
    console.log('  - Primeiros 100 chars:', rawBody.substring(0, 100));

    // 3. Verifica o header da assinatura
    const signature = request.headers.get('x-hotmart-hottok');
    console.log('\n✓ Header x-hotmart-hottok:');
    console.log('  - Presente:', signature ? 'SIM' : 'NÃO');

    if (signature) {
      console.log('  - Tamanho:', signature.length, 'caracteres');
      console.log('  - Valor completo:', signature);
    }

    // 4. Calcula o HMAC correto
    if (secret && rawBody) {
      const hmac = createHmac('sha256', secret);
      hmac.update(rawBody);
      const calculatedSignature = hmac.digest('hex');

      console.log('\n✓ Cálculo do HMAC:');
      console.log('  - HMAC calculado:', calculatedSignature);
      console.log('  - HMAC recebido: ', signature || 'AUSENTE');
      console.log('  - Assinaturas batem?', calculatedSignature === signature ? 'SIM ✓' : 'NÃO ❌');

      // 5. Teste com secret com trim (remove espaços)
      const secretTrimmed = secret.trim();
      if (secretTrimmed !== secret) {
        const hmacTrimmed = createHmac('sha256', secretTrimmed);
        hmacTrimmed.update(rawBody);
        const calculatedSignatureTrimmed = hmacTrimmed.digest('hex');

        console.log('\n⚠️  TESTE COM SECRET TRIMMED:');
        console.log('  - HMAC com trim:', calculatedSignatureTrimmed);
        console.log('  - Bateria com trim?', calculatedSignatureTrimmed === signature ? 'SIM ✓' : 'NÃO ❌');
      }
    }

    // 6. Mostra todos os headers recebidos
    console.log('\n✓ Todos os headers:');
    request.headers.forEach((value, key) => {
      console.log(`  - ${key}: ${value}`);
    });

    // 7. Tenta fazer parse do JSON
    let parsedBody: any = null;
    try {
      parsedBody = JSON.parse(rawBody);
      console.log('\n✓ JSON parseado com sucesso:');
      console.log('  - event:', parsedBody.event);
      console.log('  - id:', parsedBody.id);
    } catch (e) {
      console.log('\n❌ Erro ao fazer parse do JSON:', e);
    }

    console.log('\n=== FIM DO DEBUG ===\n');

    // Retorna informações úteis
    return NextResponse.json({
      debug: true,
      checks: {
        secretConfigured: !!secret,
        secretLength: secret?.length,
        secretHasSpaces: secret ? (secret.startsWith(' ') || secret.endsWith(' ')) : false,
        bodyReceived: !!rawBody,
        bodyLength: rawBody.length,
        signatureReceived: !!signature,
        signatureLength: signature?.length,
        signatureValue: signature,
        calculatedSignature: secret ? createHmac('sha256', secret).update(rawBody).digest('hex') : null,
        signaturesMatch: secret && signature ? (createHmac('sha256', secret).update(rawBody).digest('hex') === signature) : false,
      },
      payload: parsedBody,
    });

  } catch (error) {
    console.error('❌ Erro no debug:', error);
    return NextResponse.json(
      {
        error: 'Erro no debug',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint de DEBUG do webhook Hotmart',
    instructions: [
      '1. Envie um POST com o payload de teste da Hotmart',
      '2. Inclua o header: x-hotmart-hottok com a assinatura',
      '3. Veja os logs no console para diagnóstico completo',
    ],
    secret_configured: !!process.env.HOTMART_WEBHOOK_SECRET,
  });
}

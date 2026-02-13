/**
 * Script de teste para o webhook da Hotmart
 * Execute com: npx tsx test-hotmart-webhook.ts
 */

import { createHmac } from 'crypto';

// Simula um payload real da Hotmart
const testPayload = {
  event: 'PURCHASE_APPROVED',
  id: 'TEST-' + Date.now(),
  creation_date: Date.now(),
  data: {
    purchase: {
      order_id: 'ORDER-TEST-' + Date.now(),
      transaction: 'TXN-TEST-' + Date.now(),
      status: 'approved',
      buyer: {
        name: 'João da Silva',
        email: 'joao.teste@example.com'
      },
      product: {
        id: '12345',
        name: 'Produto de Teste'
      },
      price: {
        value: 97.00,
        currency_code: 'BRL'
      }
    }
  }
};

const rawBody = JSON.stringify(testPayload);

// Gera a assinatura HMAC (use o mesmo secret do .env)
const secret = process.env.HOTMART_WEBHOOK_SECRET || 'seu-secret-aqui';
const hmac = createHmac('sha256', secret);
hmac.update(rawBody);
const signature = hmac.digest('hex');

console.log('=== Teste do Webhook Hotmart ===\n');
console.log('1. Payload de teste:');
console.log(JSON.stringify(testPayload, null, 2));
console.log('\n2. Assinatura gerada:', signature);
console.log('\n3. Para testar com curl:');
console.log(`
curl -X POST http://localhost:3000/api/webhook/hotmart \\
  -H "Content-Type: application/json" \\
  -H "x-hotmart-hottok: ${signature}" \\
  -d '${rawBody}'
`);

console.log('\n4. Verificação dos campos obrigatórios:');
console.log('✅ email:', testPayload.data.purchase.buyer.email);
console.log('✅ product_id:', testPayload.data.purchase.product.id);
console.log('✅ purchase_id:', testPayload.data.purchase.order_id);
console.log('✅ status: approved');

console.log('\n5. Teste com node-fetch (instale com: npm install node-fetch):');
console.log(`
const fetch = require('node-fetch');

fetch('http://localhost:3000/api/webhook/hotmart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-hotmart-hottok': '${signature}'
  },
  body: '${rawBody}'
})
  .then(res => res.json())
  .then(data => console.log('Resposta:', data))
  .catch(err => console.error('Erro:', err));
`);

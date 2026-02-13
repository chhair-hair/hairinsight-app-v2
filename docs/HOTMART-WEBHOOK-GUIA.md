# 🎯 Sistema de Webhook da Hotmart - Guia Completo

Sistema completo para integrar webhooks da Hotmart no seu app Next.js, com controle de acesso baseado em email.

---

## 📦 O que foi criado?

### 1. **Banco de Dados**
- **Tabela**: `hotmart_purchases` no Supabase
- **Arquivo de migração**: `supabase/migrations/20260209174707_hotmart_purchases.sql`

### 2. **Arquivos Criados**
- ✅ `/src/lib/supabase-admin.ts` - Cliente admin do Supabase
- ✅ `/src/lib/access-control.ts` - Funções para verificar acesso
- ✅ `/src/app/api/webhook/hotmart/route.ts` - Endpoint do webhook
- ✅ `/src/app/api/check-access/route.ts` - Verifica acesso do usuário
- ✅ `/src/app/api/setup-database/route.ts` - Helper para criar tabela
- ✅ `/src/components/AccessGuard.tsx` - Componente para proteger páginas
- ✅ `/src/app/premium/page.tsx` - Exemplo de página premium
- ✅ `/src/app/sem-acesso/page.tsx` - Página de acesso negado

---

## 🔧 Configuração Inicial

### Passo 1: Configurar Variável de Ambiente

Você já deve ter recebido um botão para configurar a chave. Se não configurou ainda, adicione:

```
HOTMART_WEBHOOK_SECRET=sua_chave_secreta_aqui
```

**Onde pegar essa chave?**
1. Acesse o painel da Hotmart
2. Vá em **Ferramentas** > **Webhooks**
3. Copie ou crie seu **Secret Key**

---

### Passo 2: Criar a Tabela no Supabase

**Opção A - Automática (Recomendado):**
1. Acesse no navegador: `https://seu-site.com/api/setup-database`
2. Se der erro, siga a Opção B

**Opção B - Manual:**
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Copie todo o conteúdo do arquivo: `supabase/migrations/20260209174707_hotmart_purchases.sql`
5. Cole no SQL Editor e clique em **Run**

---

## 🚀 Configurar Webhook na Hotmart

### Passo 1: URL do Webhook
No painel da Hotmart, configure:

```
URL: https://seu-dominio.com/api/webhook/hotmart
```

### Passo 2: Eventos para Monitorar
Selecione estes eventos:
- ✅ **PURCHASE_APPROVED** (Compra aprovada)
- ✅ **PURCHASE_REFUNDED** (Reembolsada)
- ✅ **PURCHASE_CHARGEBACK** (Chargeback)
- ✅ **PURCHASE_CANCELLED** (Cancelada)

### Passo 3: Testar
1. Faça uma compra de teste na Hotmart
2. Ou use o simulador de webhook deles
3. Verifique se o webhook foi recebido acessando: `https://seu-site.com/api/webhook/hotmart`
   - Deve retornar: `{"message": "Webhook da Hotmart está ativo"}`

---

## 🛡️ Como Proteger Páginas

### Método 1: Component AccessGuard (Client-Side)

```tsx
'use client';

import { AccessGuard } from '@/components/AccessGuard';

export default function MinhaPagePremium() {
  const [userEmail, setUserEmail] = useState('');

  return (
    <AccessGuard
      userEmail={userEmail}
      productId="123456" // Opcional
      fallbackUrl="/sem-acesso"
    >
      <div>
        {/* Seu conteúdo premium aqui */}
        <h1>Conteúdo Exclusivo!</h1>
      </div>
    </AccessGuard>
  );
}
```

### Método 2: Server-Side (Server Components)

```tsx
import { checkUserAccess } from '@/lib/access-control';
import { redirect } from 'next/navigation';

export default async function PaginaPremium({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email || '';

  // Verifica acesso
  const { hasAccess } = await checkUserAccess(email);

  if (!hasAccess) {
    redirect('/sem-acesso');
  }

  return (
    <div>
      <h1>Bem-vindo à área premium!</h1>
    </div>
  );
}
```

### Método 3: API Route Protection

```tsx
// /app/api/minha-api/route.ts
import { checkUserAccess } from '@/lib/access-control';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const email = request.headers.get('x-user-email') || '';

  const { hasAccess } = await checkUserAccess(email);

  if (!hasAccess) {
    return NextResponse.json(
      { error: 'Acesso negado' },
      { status: 403 }
    );
  }

  return NextResponse.json({ data: 'Conteúdo premium' });
}
```

---

## 🔍 Funções Disponíveis

### `checkUserAccess(email, productId?)`
Verifica se um usuário tem acesso.

```tsx
import { checkUserAccess } from '@/lib/access-control';

const result = await checkUserAccess('user@email.com');

if (result.hasAccess) {
  console.log('Usuário tem acesso!', result.purchase);
} else {
  console.log('Acesso negado');
}
```

**Retorno:**
```typescript
{
  hasAccess: boolean;
  purchase?: {
    id: string;
    email: string;
    product_id: string;
    purchase_id: string;
    status: string;
    created_at: string;
  };
}
```

### `getUserProducts(email)`
Lista todos os produtos que o usuário comprou.

```tsx
import { getUserProducts } from '@/lib/access-control';

const products = await getUserProducts('user@email.com');
console.log('Produtos:', products);
```

### `requireAccess(email, productId?)`
Força verificação de acesso (lança erro se não tiver).

```tsx
import { requireAccess } from '@/lib/access-control';

try {
  const result = await requireAccess('user@email.com');
  // Usuário tem acesso, continua
} catch (error) {
  // Redireciona ou bloqueia
  redirect('/sem-acesso');
}
```

---

## 🧪 Testando o Sistema

### 1. Testar se o webhook está ativo
```bash
curl https://seu-site.com/api/webhook/hotmart
```

Resposta esperada:
```json
{
  "message": "Webhook da Hotmart está ativo",
  "endpoint": "/api/webhook/hotmart"
}
```

### 2. Testar verificação de acesso
```bash
curl "https://seu-site.com/api/check-access?email=teste@email.com"
```

Resposta esperada:
```json
{
  "hasAccess": false
}
```

### 3. Simular compra manual (para testes)
Você pode inserir um registro manual no Supabase:

```sql
INSERT INTO hotmart_purchases (
  email,
  product_id,
  purchase_id,
  status
) VALUES (
  'teste@email.com',
  'PRODUTO_123',
  'TESTE_001',
  'approved'
);
```

---

## 📊 Estrutura do Banco

### Tabela: `hotmart_purchases`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | UUID | ID único |
| `email` | TEXT | Email do comprador (lowercase) |
| `product_id` | TEXT | ID do produto na Hotmart |
| `purchase_id` | TEXT | ID da compra (único) |
| `transaction_id` | TEXT | ID da transação |
| `status` | TEXT | approved / refunded / chargeback / cancelled |
| `amount` | DECIMAL | Valor pago |
| `currency` | TEXT | Moeda (BRL, USD, etc) |
| `buyer_name` | TEXT | Nome do comprador |
| `buyer_email` | TEXT | Email original do webhook |
| `webhook_data` | JSONB | Dados completos do webhook |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `updated_at` | TIMESTAMPTZ | Última atualização |

---

## 🔐 Segurança

### ✅ O que está protegido:
- Validação HMAC de todos os webhooks
- Secret nunca exposto no frontend
- Verificação server-side de acesso
- Emails normalizados (lowercase, trim)

### ⚠️ Importante:
- **NUNCA** exponha `HOTMART_WEBHOOK_SECRET` no frontend
- **NUNCA** confie em verificações client-side apenas
- Sempre valide acesso no servidor

---

## 🎨 Personalizando

### Alterar página de bloqueio
Edite: `/src/app/sem-acesso/page.tsx`

### Adicionar mais eventos
Edite: `/src/app/api/webhook/hotmart/route.ts`

### Mudar critérios de acesso
Edite: `/src/lib/access-control.ts`

---

## 📝 Exemplos de Uso

### Exemplo 1: Página Premium Simples
```tsx
// /app/meu-curso/page.tsx
'use client';

import { AccessGuard } from '@/components/AccessGuard';
import { useState } from 'react';

export default function MeuCurso() {
  const [email, setEmail] = useState('');

  if (!email) {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setEmail(formData.get('email') as string);
      }}>
        <input name="email" type="email" required />
        <button>Acessar</button>
      </form>
    );
  }

  return (
    <AccessGuard userEmail={email}>
      <h1>Bem-vindo ao curso!</h1>
      {/* Conteúdo do curso */}
    </AccessGuard>
  );
}
```

### Exemplo 2: Verificar na API
```tsx
// /app/api/meu-endpoint/route.ts
import { checkUserAccess } from '@/lib/access-control';

export async function POST(request: Request) {
  const { email } = await request.json();

  const { hasAccess } = await checkUserAccess(email);

  if (!hasAccess) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Processa a requisição...
  return Response.json({ success: true });
}
```

---

## 🐛 Troubleshooting

### Webhook não está sendo recebido
1. Verifique se a URL está correta na Hotmart
2. Teste acessando: `https://seu-site.com/api/webhook/hotmart`
3. Verifique os logs no console do servidor

### Usuário não tem acesso mesmo tendo comprado
1. Verifique se o email está exatamente igual ao da compra
2. Confira no Supabase se o registro foi criado
3. Veja se o status está `approved`

### Erro de HMAC inválido
1. Verifique se `HOTMART_WEBHOOK_SECRET` está configurado
2. Certifique-se que é a mesma chave do painel da Hotmart
3. A chave deve ser copiada exatamente como está

---

## ✅ Checklist Final

- [ ] Variável `HOTMART_WEBHOOK_SECRET` configurada
- [ ] Tabela `hotmart_purchases` criada no Supabase
- [ ] Webhook configurado na Hotmart
- [ ] URL do webhook testada e funcionando
- [ ] Compra de teste realizada
- [ ] Página premium protegida
- [ ] Acesso verificado e funcionando

---

## 🎉 Pronto!

Seu sistema de webhook da Hotmart está funcionando! Agora você pode:
- Liberar acesso automaticamente após compras
- Bloquear usuários que pedirem reembolso
- Proteger qualquer conteúdo premium
- Verificar acesso baseado no email

Qualquer dúvida, consulte este guia! 🚀

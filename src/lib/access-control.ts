import { supabaseAdmin } from './supabase-admin';

export interface AccessCheckResult {
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

/**
 * Verifica se um usuário tem acesso ao app baseado no email
 * @param email - Email do usuário para verificar
 * @param productId - (Opcional) ID do produto específico para verificar
 * @returns Objeto com status de acesso e dados da compra
 */
export async function checkUserAccess(
  email: string,
  productId?: string
): Promise<AccessCheckResult> {
  try {
    if (!email) {
      return { hasAccess: false };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Query básica
    let query = supabaseAdmin
      .from('hotmart_purchases')
      .select('id, email, product_id, purchase_id, status, created_at')
      .eq('email', normalizedEmail)
      .eq('status', 'approved');

    // Filtra por produto específico se fornecido
    if (productId) {
      query = query.eq('product_id', productId);
    }

    // Ordena pela mais recente
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query.limit(1).single();

    if (error || !data) {
      return { hasAccess: false };
    }

    return {
      hasAccess: true,
      purchase: data,
    };
  } catch (error) {
    console.error('Erro ao verificar acesso:', error);
    return { hasAccess: false };
  }
}

/**
 * Verifica se um usuário tem acesso a qualquer produto
 * @param email - Email do usuário
 * @returns Lista de produtos que o usuário tem acesso
 */
export async function getUserProducts(email: string) {
  try {
    if (!email) {
      return [];
    }

    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabaseAdmin
      .from('hotmart_purchases')
      .select('product_id, status, created_at')
      .eq('email', normalizedEmail)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar produtos do usuário:', error);
    return [];
  }
}

/**
 * Hook para usar em Server Components
 * Verifica acesso e retorna dados ou redireciona
 */
export async function requireAccess(
  email: string,
  productId?: string
): Promise<AccessCheckResult> {
  const result = await checkUserAccess(email, productId);

  if (!result.hasAccess) {
    throw new Error('Acesso negado: usuário não possui compra ativa');
  }

  return result;
}

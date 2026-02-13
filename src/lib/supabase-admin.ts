import { createClient } from '@supabase/supabase-js';

// Cliente admin do Supabase para operações server-side
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Tipos para a tabela de compras
export interface HotmartPurchase {
  id?: string;
  email: string;
  product_id: string;
  purchase_id: string;
  transaction_id?: string;
  status: 'approved' | 'refunded' | 'chargeback' | 'cancelled';
  amount?: number;
  currency?: string;
  buyer_name?: string;
  buyer_email?: string;
  webhook_data?: any;
  created_at?: string;
  updated_at?: string;
}

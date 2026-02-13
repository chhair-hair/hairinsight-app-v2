import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

/**
 * Endpoint para criar a tabela hotmart_purchases no Supabase
 * GET /api/setup-database
 *
 * Execute este endpoint UMA VEZ para criar a tabela no banco
 */
export async function GET() {
  try {
    // SQL para criar a tabela
    const createTableSQL = `
      -- Tabela para armazenar compras da Hotmart
      CREATE TABLE IF NOT EXISTS hotmart_purchases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        product_id TEXT NOT NULL,
        purchase_id TEXT NOT NULL UNIQUE,
        transaction_id TEXT,
        status TEXT NOT NULL CHECK (status IN ('approved', 'refunded', 'chargeback', 'cancelled')),
        amount DECIMAL(10, 2),
        currency TEXT DEFAULT 'BRL',
        buyer_name TEXT,
        buyer_email TEXT,
        webhook_data JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- Índices para melhorar performance
      CREATE INDEX IF NOT EXISTS idx_hotmart_purchases_email ON hotmart_purchases(email);
      CREATE INDEX IF NOT EXISTS idx_hotmart_purchases_purchase_id ON hotmart_purchases(purchase_id);
      CREATE INDEX IF NOT EXISTS idx_hotmart_purchases_status ON hotmart_purchases(status);

      -- Função para atualizar updated_at automaticamente
      CREATE OR REPLACE FUNCTION update_hotmart_purchases_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Trigger para atualizar updated_at
      DROP TRIGGER IF EXISTS hotmart_purchases_updated_at ON hotmart_purchases;
      CREATE TRIGGER hotmart_purchases_updated_at
        BEFORE UPDATE ON hotmart_purchases
        FOR EACH ROW
        EXECUTE FUNCTION update_hotmart_purchases_updated_at();
    `;

    // Executa o SQL
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql_query: createTableSQL,
    });

    // Tenta método alternativo se o primeiro falhar
    if (error) {
      console.log('Método 1 falhou, tentando método alternativo...');

      // Verifica se a tabela já existe
      const { data: tables, error: checkError } = await supabaseAdmin
        .from('hotmart_purchases')
        .select('id')
        .limit(1);

      if (checkError && checkError.code === '42P01') {
        // Tabela não existe, precisa ser criada manualmente
        return NextResponse.json({
          success: false,
          message: 'A tabela precisa ser criada manualmente no Supabase',
          instructions: [
            '1. Acesse o painel do Supabase',
            '2. Vá em SQL Editor',
            '3. Execute o SQL que está no arquivo: supabase/migrations/20260209174707_hotmart_purchases.sql',
            '4. Após criar a tabela, este endpoint não será mais necessário',
          ],
          sql_file: '/workspace/supabase/migrations/20260209174707_hotmart_purchases.sql',
        });
      }

      if (!checkError) {
        return NextResponse.json({
          success: true,
          message: 'Tabela hotmart_purchases já existe no banco de dados',
        });
      }

      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Tabela hotmart_purchases criada com sucesso!',
    });

  } catch (error: any) {
    console.error('Erro ao criar tabela:', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      details: 'Verifique as instruções no response para criar a tabela manualmente',
      instructions: [
        '1. Acesse o painel do Supabase: https://supabase.com/dashboard',
        '2. Selecione seu projeto',
        '3. Vá em SQL Editor no menu lateral',
        '4. Copie e execute o conteúdo do arquivo: supabase/migrations/20260209174707_hotmart_purchases.sql',
      ],
    }, { status: 500 });
  }
}

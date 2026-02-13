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

-- Comentários para documentação
COMMENT ON TABLE hotmart_purchases IS 'Armazena todas as compras vindas da Hotmart via webhook';
COMMENT ON COLUMN hotmart_purchases.email IS 'Email do comprador usado para liberar acesso';
COMMENT ON COLUMN hotmart_purchases.product_id IS 'ID do produto na Hotmart';
COMMENT ON COLUMN hotmart_purchases.purchase_id IS 'ID único da compra na Hotmart';
COMMENT ON COLUMN hotmart_purchases.status IS 'Status da compra: approved, refunded, chargeback, cancelled';
COMMENT ON COLUMN hotmart_purchases.webhook_data IS 'Dados completos do webhook para auditoria';

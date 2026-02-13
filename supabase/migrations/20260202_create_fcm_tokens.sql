-- Tabela para armazenar tokens FCM (Firebase Cloud Messaging)
-- Permite enviar notificações push para os usuários

CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fcm_token TEXT UNIQUE NOT NULL,
  user_id UUID,
  device_info JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_active ON fcm_tokens(is_active);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_token ON fcm_tokens(fcm_token);

-- Habilita Row Level Security
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer usuário pode registrar um token
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fcm_tokens' AND policyname = 'Usuários podem registrar tokens'
  ) THEN
    CREATE POLICY "Usuários podem registrar tokens"
      ON fcm_tokens FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Política: Usuários podem atualizar qualquer token
-- (necessário porque o token pode ser registrado antes do login)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fcm_tokens' AND policyname = 'Usuários podem atualizar tokens'
  ) THEN
    CREATE POLICY "Usuários podem atualizar tokens"
      ON fcm_tokens FOR UPDATE
      USING (true);
  END IF;
END $$;

-- Política: Usuários podem ler seus próprios tokens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fcm_tokens' AND policyname = 'Usuários podem ler próprios tokens'
  ) THEN
    CREATE POLICY "Usuários podem ler próprios tokens"
      ON fcm_tokens FOR SELECT
      USING (auth.uid() = user_id OR user_id IS NULL);
  END IF;
END $$;

-- Função para atualizar o updated_at automaticamente
CREATE OR REPLACE FUNCTION update_fcm_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o updated_at
DROP TRIGGER IF EXISTS fcm_tokens_updated_at ON fcm_tokens;
CREATE TRIGGER fcm_tokens_updated_at
  BEFORE UPDATE ON fcm_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_fcm_tokens_updated_at();

-- Comentários para documentação
COMMENT ON TABLE fcm_tokens IS 'Armazena tokens FCM para envio de notificações push';
COMMENT ON COLUMN fcm_tokens.fcm_token IS 'Token único do Firebase Cloud Messaging';
COMMENT ON COLUMN fcm_tokens.user_id IS 'ID do usuário (opcional, pode ser NULL antes do login)';
COMMENT ON COLUMN fcm_tokens.device_info IS 'Informações do dispositivo (userAgent, platform, etc)';
COMMENT ON COLUMN fcm_tokens.is_active IS 'Indica se o token está ativo ou foi desativado';

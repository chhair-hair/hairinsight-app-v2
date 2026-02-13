-- Criação da tabela de histórico de rotinas
-- Esta tabela armazena todas as rotinas completadas pelos usuários

CREATE TABLE IF NOT EXISTS routine_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('morning', 'night')),
  completed_steps INTEGER NOT NULL,
  total_steps INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- duração em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para melhorar performance de consultas por usuário
CREATE INDEX IF NOT EXISTS idx_routine_history_user_id ON routine_history(user_id);

-- Índice para melhorar performance de consultas por data
CREATE INDEX IF NOT EXISTS idx_routine_history_date ON routine_history(date DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE routine_history ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas seu próprio histórico
CREATE POLICY "Users can view their own routine history"
  ON routine_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Usuários podem inserir apenas no seu próprio histórico
CREATE POLICY "Users can insert their own routine history"
  ON routine_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem deletar apenas seu próprio histórico
CREATE POLICY "Users can delete their own routine history"
  ON routine_history
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE routine_history IS 'Armazena o histórico de rotinas completadas pelos usuários';
COMMENT ON COLUMN routine_history.type IS 'Tipo da rotina: morning (manhã) ou night (noite)';
COMMENT ON COLUMN routine_history.duration IS 'Duração total da rotina em segundos';

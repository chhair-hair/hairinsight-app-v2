-- Dropar a tabela antiga se existir e recriar corretamente
DROP TABLE IF EXISTS hair_profiles CASCADE;
DROP TABLE IF EXISTS user_hair_data CASCADE;
DROP TABLE IF EXISTS hair_calendar_events CASCADE;

-- Tabela de perfis capilares (72 perfis fixos de referência)
CREATE TABLE hair_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  curvature TEXT NOT NULL CHECK (curvature IN ('liso', 'ondulado', 'cacheado', 'crespo')),
  oiliness TEXT NOT NULL CHECK (oiliness IN ('oleoso', 'normal', 'seco', 'misto')),
  porosity TEXT NOT NULL CHECK (porosity IN ('baixa', 'media', 'alta')),
  has_chemistry BOOLEAN NOT NULL,
  wash_days_per_week INTEGER NOT NULL CHECK (wash_days_per_week BETWEEN 1 AND 7),
  needs_refresh BOOLEAN NOT NULL,
  capillary_schedule JSONB NOT NULL,
  products JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de dados do usuário
CREATE TABLE user_hair_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  selected_profile_id TEXT REFERENCES hair_profiles(id),
  quiz_answers JSONB,
  personal_schedule JSONB,
  wash_history JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Tabela de eventos do calendário
CREATE TABLE hair_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_hair_data_id UUID REFERENCES user_hair_data(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('H', 'N', 'R', 'refresh')),
  is_completed BOOLEAN DEFAULT FALSE,
  products_used JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_hair_profiles_characteristics ON hair_profiles(curvature, oiliness, porosity, has_chemistry);
CREATE INDEX idx_user_hair_data_user_id ON user_hair_data(user_id);
CREATE INDEX idx_calendar_events_user_date ON hair_calendar_events(user_hair_data_id, event_date);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_hair_profiles_updated_at BEFORE UPDATE ON hair_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_hair_data_updated_at BEFORE UPDATE ON user_hair_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON hair_calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE hair_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hair_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE hair_calendar_events ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Perfis públicos" ON hair_profiles FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Usuários veem seus dados" ON user_hair_data FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Usuários criam seus dados" ON user_hair_data FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários atualizam seus dados" ON user_hair_data FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Usuários veem seus eventos" ON hair_calendar_events FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM user_hair_data WHERE user_hair_data.id = hair_calendar_events.user_hair_data_id AND user_hair_data.user_id = auth.uid())
);
CREATE POLICY "Usuários criam seus eventos" ON hair_calendar_events FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM user_hair_data WHERE user_hair_data.id = hair_calendar_events.user_hair_data_id AND user_hair_data.user_id = auth.uid())
);
CREATE POLICY "Usuários atualizam seus eventos" ON hair_calendar_events FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM user_hair_data WHERE user_hair_data.id = hair_calendar_events.user_hair_data_id AND user_hair_data.user_id = auth.uid())
);
CREATE POLICY "Usuários deletam seus eventos" ON hair_calendar_events FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM user_hair_data WHERE user_hair_data.id = hair_calendar_events.user_hair_data_id AND user_hair_data.user_id = auth.uid())
);

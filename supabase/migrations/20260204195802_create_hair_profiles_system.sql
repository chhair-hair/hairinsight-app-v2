-- Sistema de Perfis Capilares e Geração de Calendário
-- Este sistema identifica o perfil do usuário baseado nas respostas do quiz
-- e gera automaticamente um calendário personalizado

-- Tabela de perfis capilares (72 perfis únicos)
CREATE TABLE IF NOT EXISTS hair_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Identificadores do perfil (chaves do perfil)
  hair_type TEXT NOT NULL, -- liso, ondulado, cacheado, crespo
  scalp_type TEXT NOT NULL, -- oleoso, normal, seco, misto
  porosity TEXT NOT NULL, -- baixa, media, alta
  has_chemistry BOOLEAN NOT NULL, -- true/false

  -- Nome do perfil
  profile_name TEXT NOT NULL,

  -- Configurações de lavagem
  wash_days_per_week INTEGER NOT NULL, -- quantos dias de lavagem por semana
  needs_refresh BOOLEAN DEFAULT false, -- se precisa de refresh (cachos/crespos)

  -- Cronograma capilar (ciclo de 3 semanas)
  capillary_schedule JSONB NOT NULL, -- { "week1": ["H","N","R"], "week2": [...], "week3": [...] }

  -- Produtos recomendados
  recommended_products JSONB NOT NULL, -- Lista de produtos necessários

  -- Índice único para cada combinação de características
  CONSTRAINT unique_profile UNIQUE (hair_type, scalp_type, porosity, has_chemistry)
);

-- Tabela de calendários gerados (um por usuário)
CREATE TABLE IF NOT EXISTS user_calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES hair_profiles(id),

  -- Calendário da semana (7 dias)
  -- Estrutura: { "monday": {...}, "tuesday": {...}, ... }
  weekly_calendar JSONB NOT NULL,

  -- Semana atual no ciclo de 3 semanas (1, 2 ou 3)
  current_week INTEGER DEFAULT 1,

  -- Data de início da semana atual
  week_start_date DATE DEFAULT CURRENT_DATE,

  CONSTRAINT unique_user_calendar UNIQUE (user_id)
);

-- Tabela de histórico de rotinas realizadas
CREATE TABLE IF NOT EXISTS routine_completed_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  calendar_id UUID REFERENCES user_calendars(id) ON DELETE CASCADE,

  -- Dia da semana que foi completado
  weekday TEXT NOT NULL, -- monday, tuesday, etc
  routine_type TEXT NOT NULL, -- wash, refresh, hydration, nutrition, reconstruction, rest

  -- Detalhes da rotina realizada
  routine_details JSONB
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_calendars_user_id ON user_calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_routine_history_user_id ON routine_completed_history(user_id);
CREATE INDEX IF NOT EXISTS idx_hair_profiles_characteristics ON hair_profiles(hair_type, scalp_type, porosity, has_chemistry);

-- Função para calcular a porosidade baseada nas respostas do quiz
CREATE OR REPLACE FUNCTION calculate_porosity(
  p_chemical_treatments TEXT,
  p_heat_tools TEXT,
  p_hair_texture TEXT
) RETURNS TEXT AS $$
BEGIN
  -- Alta porosidade: química + calor + fios grossos
  IF p_chemical_treatments IN ('multiplos', 'descoloracao', 'alisamento') OR
     (p_chemical_treatments = 'coloracao' AND p_heat_tools = 'sim-regularmente') THEN
    RETURN 'alta';
  END IF;

  -- Baixa porosidade: sem química + sem calor + fios finos
  IF p_chemical_treatments = 'nenhum' AND
     p_heat_tools = 'nao' AND
     p_hair_texture = 'fino' THEN
    RETURN 'baixa';
  END IF;

  -- Média porosidade: casos intermediários
  RETURN 'media';
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE hair_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_completed_history ENABLE ROW LEVEL SECURITY;

-- Políticas: perfis são públicos (leitura)
CREATE POLICY "Perfis são públicos para leitura"
  ON hair_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Políticas: calendários (usuário vê apenas o seu)
CREATE POLICY "Usuários veem apenas seu calendário"
  ON user_calendars FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seu calendário"
  ON user_calendars FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu calendário"
  ON user_calendars FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Políticas: histórico (usuário vê apenas o seu)
CREATE POLICY "Usuários veem apenas seu histórico"
  ON routine_completed_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem adicionar ao histórico"
  ON routine_completed_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

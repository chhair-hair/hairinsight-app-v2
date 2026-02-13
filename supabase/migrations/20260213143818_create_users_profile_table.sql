-- Tabela de Perfis de Usuários (profiles)
-- Complementa a tabela auth.users com informações adicionais
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Informações básicas
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,

  -- Informações do quiz salvas
  quiz_data JSONB,

  -- Análise capilar completa
  hair_analysis JSONB,

  -- Preferências
  notification_preferences JSONB DEFAULT '{"morning": true, "night": true, "email": true}'::jsonb,

  -- Status da assinatura/pagamento
  subscription_status TEXT DEFAULT 'active',
  subscription_expires_at TIMESTAMP WITH TIME ZONE,

  -- Hotmart integration
  hotmart_purchase_id TEXT,
  hotmart_buyer_email TEXT,

  -- Metadata
  last_login_at TIMESTAMP WITH TIME ZONE,
  onboarding_completed BOOLEAN DEFAULT false,

  CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('active', 'inactive', 'trial', 'expired'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_hotmart_purchase_id ON public.profiles(hotmart_purchase_id);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente ao criar usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Permitir inserção apenas pelo sistema (via trigger)
CREATE POLICY "Sistema pode criar perfis"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Permitir que service_role faça tudo (para integrações)
CREATE POLICY "Service role tem acesso total"
  ON public.profiles
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE public.profiles IS 'Perfis de usuários com informações complementares ao auth.users';

-- Adição de mais 15 perfis capilares (26-40 de 72)
-- Foco em Ondulados, Cacheados e Crespos

INSERT INTO hair_profiles (
  hair_type, scalp_type, porosity, has_chemistry,
  profile_name, wash_days_per_week, needs_refresh,
  capillary_schedule, recommended_products
) VALUES

-- PERFIL 26: Ondulado + Normal + Baixa Porosidade + Com Química
('ondulado', 'normal', 'baixa', true,
 'Ondulado Equilibrado Químico de Baixa Porosidade',
 2, true,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "leave-in-cachos", "serum-antifrizz"]'::jsonb),

-- PERFIL 27: Ondulado + Normal + Média Porosidade + Com Química
('ondulado', 'normal', 'media', true,
 'Ondulado Equilibrado Químico',
 2, true,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "N", "R"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "mascara-hidratante", "leave-in-cachos", "gel-cachos"]'::jsonb),

-- PERFIL 28: Ondulado + Normal + Alta Porosidade + Sem Química
('ondulado', 'normal', 'alta', false,
 'Ondulado Equilibrado Poroso Natural',
 2, true,
 '{
   "week1": ["H", "R", "N"],
   "week2": ["R", "H", "N"],
   "week3": ["H", "N", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-cachos", "mascara-hidratante", "mascara-reconstrucao", "leave-in-cachos", "gel-cachos"]'::jsonb),

-- PERFIL 29: Ondulado + Normal + Alta Porosidade + Com Química
('ondulado', 'normal', 'alta', true,
 'Ondulado Equilibrado Químico Poroso',
 2, true,
 '{
   "week1": ["R", "R", "H"],
   "week2": ["N", "H", "R"],
   "week3": ["H", "R", "N"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "mascara-reconstrucao", "leave-in-cachos", "serum-antifrizz"]'::jsonb),

-- PERFIL 30: Ondulado + Seco + Baixa Porosidade + Com Química
('ondulado', 'seco', 'baixa', true,
 'Ondulado Seco Químico de Baixa Porosidade',
 2, true,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "mascara-hidratante", "leave-in-cachos", "oleo-finalizador"]'::jsonb),

-- PERFIL 31: Ondulado + Seco + Média Porosidade + Sem Química
('ondulado', 'seco', 'media', false,
 'Ondulado Seco Equilibrado Natural',
 2, true,
 '{
   "week1": ["H", "N", "R"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-cachos", "mascara-hidratante", "leave-in-cachos", "oleo-finalizador"]'::jsonb),

-- PERFIL 32: Ondulado + Seco + Média Porosidade + Com Química
('ondulado', 'seco', 'media', true,
 'Ondulado Seco Químico Equilibrado',
 2, true,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "N", "R"],
   "week3": ["N", "R", "H"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "mascara-hidratante", "leave-in-cachos", "oleo-finalizador"]'::jsonb),

-- PERFIL 33: Ondulado + Seco + Alta Porosidade + Sem Química
('ondulado', 'seco', 'alta', false,
 'Ondulado Seco Poroso Natural',
 2, true,
 '{
   "week1": ["H", "R", "N"],
   "week2": ["R", "H", "N"],
   "week3": ["H", "N", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-cachos", "mascara-hidratante", "mascara-reconstrucao", "leave-in-cachos", "oleo-finalizador"]'::jsonb),

-- PERFIL 34: Ondulado + Seco + Alta Porosidade + Com Química
('ondulado', 'seco', 'alta', true,
 'Ondulado Seco Químico Poroso',
 2, true,
 '{
   "week1": ["R", "R", "H"],
   "week2": ["N", "H", "R"],
   "week3": ["H", "R", "N"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "mascara-reconstrucao", "mascara-hidratante", "leave-in-cachos", "oleo-finalizador"]'::jsonb),

-- PERFIL 35: Cacheado + Oleoso + Baixa Porosidade + Sem Química
('cacheado', 'oleoso', 'baixa', false,
 'Cacheado Oleoso de Baixa Porosidade',
 2, true,
 '{
   "week1": ["H", "N", "R"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-oleoso", "condicionador-cachos", "mascara-hidratante", "leave-in-cachos", "gel-cachos"]'::jsonb),

-- PERFIL 36: Cacheado + Oleoso + Baixa Porosidade + Com Química
('cacheado', 'oleoso', 'baixa', true,
 'Cacheado Oleoso Químico de Baixa Porosidade',
 2, true,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "leave-in-cachos", "gel-cachos"]'::jsonb),

-- PERFIL 37: Cacheado + Oleoso + Média Porosidade + Sem Química
('cacheado', 'oleoso', 'media', false,
 'Cacheado Oleoso Equilibrado Natural',
 2, true,
 '{
   "week1": ["H", "N", "R"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-oleoso", "condicionador-cachos", "mascara-hidratante", "leave-in-cachos", "gel-cachos"]'::jsonb),

-- PERFIL 38: Cacheado + Oleoso + Média Porosidade + Com Química
('cacheado', 'oleoso', 'media', true,
 'Cacheado Oleoso Químico Equilibrado',
 2, true,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "N", "R"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "mascara-hidratante", "leave-in-cachos", "gel-cachos"]'::jsonb),

-- PERFIL 39: Cacheado + Oleoso + Alta Porosidade + Sem Química
('cacheado', 'oleoso', 'alta', false,
 'Cacheado Oleoso Poroso Natural',
 2, true,
 '{
   "week1": ["H", "R", "N"],
   "week2": ["R", "H", "N"],
   "week3": ["H", "N", "R"]
 }'::jsonb,
 '["shampoo-oleoso", "condicionador-cachos", "mascara-hidratante", "mascara-reconstrucao", "leave-in-cachos", "gel-cachos"]'::jsonb),

-- PERFIL 40: Cacheado + Oleoso + Alta Porosidade + Com Química
('cacheado', 'oleoso', 'alta', true,
 'Cacheado Oleoso Químico Poroso',
 2, true,
 '{
   "week1": ["R", "R", "H"],
   "week2": ["N", "H", "R"],
   "week3": ["H", "R", "N"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "mascara-reconstrucao", "leave-in-cachos", "gel-cachos"]'::jsonb);

-- Atualizar comentário sobre progresso
COMMENT ON TABLE hair_profiles IS 'Perfis capilares personalizados - 40 de 72 perfis cadastrados (55.6%)';

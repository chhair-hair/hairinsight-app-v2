-- Adição de 15 novos perfis capilares (11-25 de 72)
-- Continuação do sistema de perfis personalizados

INSERT INTO hair_profiles (
  hair_type, scalp_type, porosity, has_chemistry,
  profile_name, wash_days_per_week, needs_refresh,
  capillary_schedule, recommended_products
) VALUES

-- PERFIL 11: Liso + Seco + Baixa Porosidade + Sem Química
('liso', 'seco', 'baixa', false,
 'Liso Seco de Baixa Porosidade',
 2, false,
 '{
   "week1": ["H", "R", "N"],
   "week2": ["H", "N", "R"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-nutritivo", "mascara-hidratante", "leave-in-termico", "oleo-finalizador"]'::jsonb),

-- PERFIL 12: Liso + Seco + Baixa Porosidade + Com Química
('liso', 'seco', 'baixa', true,
 'Liso Seco Químico de Baixa Porosidade',
 2, false,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-nutritivo", "mascara-reparadora", "mascara-reconstrucao", "leave-in-termico", "oleo-finalizador"]'::jsonb),

-- PERFIL 13: Liso + Seco + Média Porosidade + Sem Química
('liso', 'seco', 'media', false,
 'Liso Seco Equilibrado',
 2, false,
 '{
   "week1": ["H", "N", "R"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-nutritivo", "mascara-hidratante", "leave-in-termico", "serum-antifrizz"]'::jsonb),

-- PERFIL 14: Liso + Seco + Média Porosidade + Com Química
('liso', 'seco', 'media', true,
 'Liso Seco Químico Equilibrado',
 2, false,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "N", "R"],
   "week3": ["N", "R", "H"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-nutritivo", "mascara-reparadora", "mascara-hidratante", "leave-in-termico", "oleo-finalizador"]'::jsonb),

-- PERFIL 15: Liso + Seco + Alta Porosidade + Sem Química
('liso', 'seco', 'alta', false,
 'Liso Seco de Alta Porosidade',
 2, false,
 '{
   "week1": ["H", "R", "N"],
   "week2": ["R", "H", "N"],
   "week3": ["H", "N", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-nutritivo", "mascara-hidratante", "mascara-reconstrucao", "leave-in-termico", "oleo-finalizador"]'::jsonb),

-- PERFIL 16: Liso + Seco + Alta Porosidade + Com Química
('liso', 'seco', 'alta', true,
 'Liso Seco Químico Poroso',
 2, false,
 '{
   "week1": ["R", "R", "H"],
   "week2": ["N", "H", "R"],
   "week3": ["H", "R", "N"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-nutritivo", "mascara-reparadora", "mascara-reconstrucao", "mascara-hidratante", "leave-in-termico", "oleo-finalizador"]'::jsonb),

-- PERFIL 17: Liso + Normal + Média Porosidade + Sem Química
('liso', 'normal', 'media', false,
 'Liso Equilibrado de Média Porosidade',
 3, false,
 '{
   "week1": ["H", "N", "R"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-leve", "mascara-hidratante", "leave-in-termico", "serum-antifrizz"]'::jsonb),

-- PERFIL 18: Liso + Normal + Média Porosidade + Com Química
('liso', 'normal', 'media', true,
 'Liso Equilibrado Químico',
 3, false,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-nutritivo", "mascara-reparadora", "mascara-hidratante", "leave-in-termico", "oleo-finalizador"]'::jsonb),

-- PERFIL 19: Liso + Normal + Alta Porosidade + Sem Química
('liso', 'normal', 'alta', false,
 'Liso Equilibrado Poroso',
 3, false,
 '{
   "week1": ["H", "R", "N"],
   "week2": ["R", "H", "N"],
   "week3": ["H", "N", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-nutritivo", "mascara-hidratante", "mascara-reconstrucao", "leave-in-termico", "serum-antifrizz"]'::jsonb),

-- PERFIL 20: Liso + Normal + Alta Porosidade + Com Química
('liso', 'normal', 'alta', true,
 'Liso Equilibrado Químico Poroso',
 3, false,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["R", "N", "H"],
   "week3": ["H", "R", "N"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-nutritivo", "mascara-reparadora", "mascara-reconstrucao", "leave-in-termico", "oleo-finalizador"]'::jsonb),

-- PERFIL 21: Ondulado + Oleoso + Baixa Porosidade + Sem Química
('ondulado', 'oleoso', 'baixa', false,
 'Ondulado Oleoso Natural de Baixa Porosidade',
 3, true,
 '{
   "week1": ["H", "N", "R"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-oleoso", "condicionador-leve", "mascara-hidratante", "leave-in-cachos", "serum-antifrizz"]'::jsonb),

-- PERFIL 22: Ondulado + Oleoso + Baixa Porosidade + Com Química
('ondulado', 'oleoso', 'baixa', true,
 'Ondulado Oleoso Químico de Baixa Porosidade',
 3, true,
 '{
   "week1": ["R", "H", "N"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "leave-in-cachos", "serum-antifrizz"]'::jsonb),

-- PERFIL 23: Ondulado + Oleoso + Alta Porosidade + Sem Química
('ondulado', 'oleoso', 'alta', false,
 'Ondulado Oleoso Poroso Natural',
 3, true,
 '{
   "week1": ["H", "R", "N"],
   "week2": ["R", "H", "N"],
   "week3": ["H", "N", "R"]
 }'::jsonb,
 '["shampoo-oleoso", "condicionador-cachos", "mascara-hidratante", "mascara-reconstrucao", "leave-in-cachos", "gel-cachos"]'::jsonb),

-- PERFIL 24: Ondulado + Oleoso + Alta Porosidade + Com Química
('ondulado', 'oleoso', 'alta', true,
 'Ondulado Oleoso Químico Poroso',
 3, true,
 '{
   "week1": ["R", "R", "H"],
   "week2": ["N", "H", "R"],
   "week3": ["H", "R", "N"]
 }'::jsonb,
 '["shampoo-reparador", "condicionador-cachos", "mascara-reparadora", "mascara-reconstrucao", "leave-in-cachos", "serum-antifrizz"]'::jsonb),

-- PERFIL 25: Ondulado + Normal + Baixa Porosidade + Sem Química
('ondulado', 'normal', 'baixa', false,
 'Ondulado Equilibrado de Baixa Porosidade',
 2, true,
 '{
   "week1": ["H", "N", "R"],
   "week2": ["H", "R", "N"],
   "week3": ["N", "H", "R"]
 }'::jsonb,
 '["shampoo-hidratante", "condicionador-cachos", "mascara-hidratante", "leave-in-cachos", "gel-cachos"]'::jsonb);

-- Comentário sobre progresso
COMMENT ON TABLE hair_profiles IS 'Perfis capilares personalizados - 25 de 72 perfis cadastrados';

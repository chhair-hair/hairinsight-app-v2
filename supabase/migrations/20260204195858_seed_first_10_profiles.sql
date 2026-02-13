-- Seed: 10 primeiros perfis capilares (de 72 totais)
-- Cada perfil combina: Tipo de cabelo + Oleosidade + Porosidade + Química

-- PERFIL 1: Liso + Oleoso + Baixa + Sem Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'liso',
  'oleoso',
  'baixa',
  false,
  'Liso Oleoso Natural',
  4, -- lava 4x por semana (dia sim, dia não)
  false, -- liso não precisa refresh
  '{
    "week1": ["H", "N", "H", "H"],
    "week2": ["N", "H", "H", "N"],
    "week3": ["H", "H", "N", "H"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo para cabelos oleosos (sem sulfato)",
    "condicionador": "Condicionador leve (aplicar só nas pontas)",
    "mascara_hidratacao": "Máscara de hidratação leve (1x semana)",
    "mascara_nutricao": "Máscara de nutrição (1x semana)",
    "finalizador": "Leave-in leve ou sérum anti-frizz"
  }'::JSONB
);

-- PERFIL 2: Liso + Oleoso + Baixa + Com Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'liso',
  'oleoso',
  'baixa',
  true,
  'Liso Oleoso Químico',
  4,
  false,
  '{
    "week1": ["H", "R", "H", "N"],
    "week2": ["N", "H", "R", "H"],
    "week3": ["H", "N", "H", "R"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo para cabelos oleosos + tratados",
    "condicionador": "Condicionador para cabelos quimicamente tratados",
    "mascara_hidratacao": "Máscara de hidratação intensiva",
    "mascara_nutricao": "Máscara de nutrição com óleos",
    "mascara_reconstrucao": "Máscara de reconstrução (queratina/proteína)",
    "finalizador": "Protetor térmico + leave-in"
  }'::JSONB
);

-- PERFIL 3: Liso + Oleoso + Média + Sem Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'liso',
  'oleoso',
  'media',
  false,
  'Liso Oleoso Equilibrado',
  4,
  false,
  '{
    "week1": ["H", "N", "H", "H"],
    "week2": ["N", "H", "H", "N"],
    "week3": ["H", "H", "N", "H"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo equilibrante para cabelos oleosos",
    "condicionador": "Condicionador balanceador",
    "mascara_hidratacao": "Máscara de hidratação média intensidade",
    "mascara_nutricao": "Máscara de nutrição leve",
    "finalizador": "Creme para pentear ou mousse leve"
  }'::JSONB
);

-- PERFIL 4: Liso + Normal + Baixa + Sem Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'liso',
  'normal',
  'baixa',
  false,
  'Liso Equilibrado Natural',
  3, -- lava 3x por semana
  false,
  '{
    "week1": ["H", "N", "H"],
    "week2": ["N", "H", "N"],
    "week3": ["H", "N", "H"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo suave para uso frequente",
    "condicionador": "Condicionador hidratante",
    "mascara_hidratacao": "Máscara de hidratação (1-2x semana)",
    "mascara_nutricao": "Máscara de nutrição (1x semana)",
    "finalizador": "Óleo capilar ou sérum"
  }'::JSONB
);

-- PERFIL 5: Ondulado + Oleoso + Média + Sem Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'ondulado',
  'oleoso',
  'media',
  false,
  'Ondulado Oleoso Natural',
  3,
  true, -- ondulado pode precisar refresh
  '{
    "week1": ["H", "N", "H"],
    "week2": ["N", "H", "N"],
    "week3": ["H", "N", "H"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo para cabelos ondulados oleosos",
    "condicionador": "Condicionador sem silicone",
    "mascara_hidratacao": "Máscara de hidratação leve",
    "mascara_nutricao": "Máscara de nutrição com óleos vegetais",
    "finalizador": "Gel ou creme para ondas",
    "refresh": "Spray revitalizador ou névoa de água + leave-in"
  }'::JSONB
);

-- PERFIL 6: Cacheado + Normal + Média + Sem Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'cacheado',
  'normal',
  'media',
  false,
  'Cacheado Equilibrado Natural',
  2, -- lava 2x por semana (método LOC)
  true, -- cachos precisam refresh
  '{
    "week1": ["H", "N"],
    "week2": ["N", "H"],
    "week3": ["H", "N"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo low-poo para cachos",
    "condicionador": "Condicionador nutritivo para cachos",
    "mascara_hidratacao": "Máscara de hidratação intensa (1x semana)",
    "mascara_nutricao": "Máscara de nutrição (1x semana)",
    "finalizador": "Creme para cachos + gel definidor",
    "refresh": "Névoa de água + ativador de cachos",
    "leave_in": "Leave-in para cachos"
  }'::JSONB
);

-- PERFIL 7: Cacheado + Normal + Alta + Com Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'cacheado',
  'normal',
  'alta',
  true,
  'Cacheado Químico Poroso',
  2,
  true,
  '{
    "week1": ["H", "R"],
    "week2": ["N", "H"],
    "week3": ["R", "N"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo reparador para cachos danificados",
    "condicionador": "Condicionador reparador intensivo",
    "mascara_hidratacao": "Máscara de hidratação profunda",
    "mascara_nutricao": "Máscara de nutrição com manteigas",
    "mascara_reconstrucao": "Máscara de reconstrução (proteína + queratina)",
    "finalizador": "Creme para cachos + gel com fixação forte",
    "refresh": "Ativador de cachos + água",
    "leave_in": "Leave-in reparador",
    "serum": "Sérum anti-frizz"
  }'::JSONB
);

-- PERFIL 8: Crespo + Seco + Alta + Sem Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'crespo',
  'seco',
  'alta',
  false,
  'Crespo Seco Natural',
  1, -- lava 1x por semana (co-wash)
  true,
  '{
    "week1": ["N"],
    "week2": ["H"],
    "week3": ["N"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo low-poo (uso quinzenal)",
    "cowash": "Co-wash para limpeza suave (uso semanal)",
    "condicionador": "Condicionador super nutritivo",
    "mascara_hidratacao": "Máscara de hidratação profunda",
    "mascara_nutricao": "Máscara de nutrição com manteigas e óleos",
    "finalizador": "Creme para definição + gel definidor + óleo",
    "refresh": "Ativador de cachos + água + óleo",
    "leave_in": "Leave-in ultra hidratante",
    "umectacao": "Óleo de coco ou rícino (pré-shampoo)"
  }'::JSONB
);

-- PERFIL 9: Crespo + Normal + Média + Sem Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'crespo',
  'normal',
  'media',
  false,
  'Crespo Equilibrado Natural',
  2, -- lava 2x por semana
  true,
  '{
    "week1": ["H", "N"],
    "week2": ["N", "H"],
    "week3": ["H", "N"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo low-poo para crespos",
    "condicionador": "Condicionador nutritivo para crespos",
    "mascara_hidratacao": "Máscara de hidratação intensa",
    "mascara_nutricao": "Máscara de nutrição com manteigas",
    "finalizador": "Creme de definição + gel + óleo finalizador",
    "refresh": "Névoa de água + ativador + creme para pentear",
    "leave_in": "Leave-in para crespos"
  }'::JSONB
);

-- PERFIL 10: Ondulado + Seco + Baixa + Sem Química
INSERT INTO hair_profiles (
  hair_type,
  scalp_type,
  porosity,
  has_chemistry,
  profile_name,
  wash_days_per_week,
  needs_refresh,
  capillary_schedule,
  recommended_products
) VALUES (
  'ondulado',
  'seco',
  'baixa',
  false,
  'Ondulado Seco Natural',
  2, -- lava 2x por semana
  true,
  '{
    "week1": ["H", "N"],
    "week2": ["N", "H"],
    "week3": ["H", "N"]
  }'::JSONB,
  '{
    "shampoo": "Shampoo hidratante suave",
    "condicionador": "Condicionador ultra hidratante",
    "mascara_hidratacao": "Máscara de hidratação profunda (2x semana)",
    "mascara_nutricao": "Máscara de nutrição (1x semana)",
    "finalizador": "Creme para ondas + óleo capilar",
    "refresh": "Spray hidratante + creme para pentear",
    "leave_in": "Leave-in hidratante"
  }'::JSONB
);

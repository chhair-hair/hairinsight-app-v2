-- Tabela de produtos capilares genéricos (sem marcas)
-- Para futura integração com links de afiliados

CREATE TABLE IF NOT EXISTS hair_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação do produto
  product_id TEXT UNIQUE NOT NULL, -- Ex: 'shampoo-hidratante'
  generic_name TEXT NOT NULL, -- Ex: 'Shampoo Hidratante Profundo'
  type TEXT NOT NULL, -- Ex: 'shampoo', 'conditioner', 'mask', 'leave-in', 'oil', 'serum'

  -- Descrição e objetivos
  main_goal TEXT NOT NULL, -- Objetivo principal
  description TEXT NOT NULL,

  -- Ingredientes ativos (array de strings)
  key_ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Perfis capilares compatíveis (array de strings)
  -- Ex: ['oleoso', 'seco', 'com-quimica', 'cacheado', 'liso']
  compatible_profiles JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Objetivos que este produto atende (array de strings)
  -- Ex: ['hidratacao', 'fortalecimento', 'controle-frizz', 'crescimento']
  hair_goals JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Links de afiliados (para versão 2)
  affiliate_links JSONB DEFAULT '[]'::jsonb,
  -- Estrutura: [{"platform": "amazon", "url": "...", "active": true}, ...]

  -- Metadados
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_hair_products_type ON hair_products(type);
CREATE INDEX IF NOT EXISTS idx_hair_products_product_id ON hair_products(product_id);
CREATE INDEX IF NOT EXISTS idx_hair_products_is_active ON hair_products(is_active);
CREATE INDEX IF NOT EXISTS idx_hair_products_compatible_profiles ON hair_products USING GIN (compatible_profiles);
CREATE INDEX IF NOT EXISTS idx_hair_products_hair_goals ON hair_products USING GIN (hair_goals);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_hair_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_hair_products_updated_at
  BEFORE UPDATE ON hair_products
  FOR EACH ROW
  EXECUTE FUNCTION update_hair_products_updated_at();

-- Inserir produtos iniciais da biblioteca
INSERT INTO hair_products (product_id, generic_name, type, main_goal, description, key_ingredients, compatible_profiles, hair_goals) VALUES

-- SHAMPOOS
('shampoo-hidratante', 'Shampoo Hidratante Profundo', 'shampoo',
 'Hidratação intensa e limpeza suave',
 'Ideal para cabelos secos e ressecados. Limpa sem agredir os fios.',
 '["ácido hialurônico", "pantenol", "óleo de argan", "glicerina"]'::jsonb,
 '["seco", "normal", "com-quimica"]'::jsonb,
 '["hidratacao"]'::jsonb),

('shampoo-fortalecedor', 'Shampoo Fortalecedor Anticaspa', 'shampoo',
 'Reduzir queda e fortalecer raiz',
 'Estimula o couro cabeludo e fortalece os fios desde a raiz.',
 '["biotina", "cafeína", "niacinamida", "zinco"]'::jsonb,
 '["normal", "seco", "oleoso"]'::jsonb,
 '["fortalecimento", "crescimento"]'::jsonb),

('shampoo-oleoso', 'Shampoo Controlador de Oleosidade', 'shampoo',
 'Controle de oleosidade e limpeza profunda',
 'Remove excesso de oleosidade sem ressecar as pontas.',
 '["argila verde", "ácido salicílico", "extrato de hortelã", "tea tree oil"]'::jsonb,
 '["oleoso"]'::jsonb,
 '["controle-frizz"]'::jsonb),

('shampoo-reparador', 'Shampoo Reparador para Química', 'shampoo',
 'Reparação de danos químicos',
 'Recupera cabelos com coloração, alisamento ou descoloração.',
 '["proteínas de trigo", "ceramidas", "óleo de argan", "aminoácidos"]'::jsonb,
 '["com-quimica"]'::jsonb,
 '["hidratacao", "fortalecimento"]'::jsonb),

-- CONDICIONADORES
('condicionador-nutritivo', 'Condicionador Nutritivo Intenso', 'conditioner',
 'Nutrição profunda e desembaraço',
 'Facilita o desembaraço e nutre os fios do meio para as pontas.',
 '["manteiga de karité", "óleo de coco", "proteínas", "pantenol"]'::jsonb,
 '["seco", "normal", "cacheado", "crespo"]'::jsonb,
 '["hidratacao"]'::jsonb),

('condicionador-leve', 'Condicionador Leve para Oleosos', 'conditioner',
 'Hidratação leve sem pesar',
 'Hidrata sem adicionar peso ou oleosidade.',
 '["aloe vera", "proteínas de seda", "vitamina B5"]'::jsonb,
 '["oleoso", "liso"]'::jsonb,
 '["hidratacao"]'::jsonb),

('condicionador-cachos', 'Condicionador Definidor de Cachos', 'conditioner',
 'Definição e controle de frizz',
 'Define cachos e ondas naturais com controle de volume.',
 '["linhaça", "babosa", "óleo de rícino", "manteiga de murumuru"]'::jsonb,
 '["cacheado", "crespo", "ondulado"]'::jsonb,
 '["controle-frizz", "hidratacao"]'::jsonb),

-- MÁSCARAS
('mascara-reparadora', 'Máscara Reparadora Intensiva', 'mask',
 'Reconstrução de fios danificados',
 'Tratamento intensivo para cabelos com danos químicos ou térmicos.',
 '["queratina hidrolisada", "colágeno", "aminoácidos", "creatina"]'::jsonb,
 '["com-quimica", "seco"]'::jsonb,
 '["fortalecimento", "hidratacao"]'::jsonb),

('mascara-hidratante', 'Máscara Hidratação Profunda', 'mask',
 'Hidratação extrema',
 'Restaura maciez e elasticidade dos fios ressecados.',
 '["manteiga de cacau", "óleo de abacate", "mel", "D-pantenol"]'::jsonb,
 '["seco", "normal", "cacheado", "crespo"]'::jsonb,
 '["hidratacao"]'::jsonb),

('mascara-reconstrucao', 'Máscara Reconstrução Capilar', 'mask',
 'Reposição de massa capilar',
 'Repõe massa capilar perdida por processos químicos.',
 '["queratina vegetal", "cistina", "colágeno marinho", "proteínas"]'::jsonb,
 '["com-quimica"]'::jsonb,
 '["fortalecimento"]'::jsonb),

-- LEAVE-IN E CREMES
('leave-in-termico', 'Leave-in Protetor Térmico', 'leave-in',
 'Proteção contra calor até 230°C',
 'Protege os fios de secadores, chapinhas e babyliss.',
 '["silicones termorresistentes", "filtro UV", "D-pantenol", "vitamina E"]'::jsonb,
 '["liso", "ondulado", "com-quimica"]'::jsonb,
 '["hidratacao"]'::jsonb),

('leave-in-cachos', 'Leave-in Ativador de Cachos', 'leave-in',
 'Definição e memorização de cachos',
 'Define e memoriza cachos com controle de frizz.',
 '["polímeros formadores", "óleo de coco", "babosa", "glicerina"]'::jsonb,
 '["cacheado", "crespo", "ondulado"]'::jsonb,
 '["controle-frizz", "hidratacao"]'::jsonb),

('creme-pentear', 'Creme para Pentear Multifuncional', 'cream',
 'Desembaraço e definição',
 'Facilita o pentear e protege contra quebra.',
 '["manteiga de karité", "proteínas", "silicones", "óleos vegetais"]'::jsonb,
 '["liso", "ondulado", "normal"]'::jsonb,
 '["hidratacao"]'::jsonb),

-- FINALIZADORES
('oleo-finalizador', 'Óleo Capilar Finalizador', 'oil',
 'Brilho e selagem das cutículas',
 'Finaliza o penteado com brilho intenso sem pesar.',
 '["óleo de argan", "óleo de macadâmia", "vitamina E", "silicones"]'::jsonb,
 '["liso", "ondulado", "cacheado", "crespo"]'::jsonb,
 '["hidratacao"]'::jsonb),

('serum-antifrizz', 'Sérum Anti-Frizz e Alinhamento', 'serum',
 'Controle de frizz e alinhamento',
 'Controla o frizz e alinha os fios sem deixar pesado.',
 '["óleo de pracaxi", "silicones voláteis", "ceramidas", "óleo de buriti"]'::jsonb,
 '["ondulado", "cacheado", "crespo", "com-quimica"]'::jsonb,
 '["controle-frizz"]'::jsonb),

('gel-cachos', 'Gel Fixador de Cachos', 'gel',
 'Fixação e definição forte',
 'Fixa e define cachos com acabamento natural.',
 '["polímeros fixadores", "linhaça", "aloe vera", "aminoácidos"]'::jsonb,
 '["cacheado", "crespo"]'::jsonb,
 '["controle-frizz"]'::jsonb),

-- TRATAMENTOS ESPECIAIS
('ampola-crescimento', 'Ampola Estimuladora de Crescimento', 'treatment',
 'Acelerar crescimento e reduzir queda',
 'Estimula o crescimento e reduz a queda capilar.',
 '["cafeína", "nicotinamida", "biotina", "extrato de alecrim"]'::jsonb,
 '["normal", "seco", "oleoso"]'::jsonb,
 '["crescimento", "fortalecimento"]'::jsonb),

('tonico-antiqueda', 'Tônico Antiqueda Fortificante', 'treatment',
 'Fortalecimento da raiz',
 'Fortalece a raiz e previne a queda excessiva.',
 '["minoxidil alternativo", "procapil", "biotina", "peptídeos"]'::jsonb,
 '["normal", "seco", "oleoso"]'::jsonb,
 '["fortalecimento", "crescimento"]'::jsonb),

('co-wash', 'Co-Wash Limpeza Suave', 'co-wash',
 'Limpeza sem sulfato',
 'Limpa os fios sem remover a oleosidade natural.',
 '["condicionantes", "óleo de coco", "extrato de frutas", "glicerina"]'::jsonb,
 '["cacheado", "crespo", "seco"]'::jsonb,
 '["hidratacao"]'::jsonb);

-- Comentários sobre uso futuro
COMMENT ON TABLE hair_products IS 'Produtos capilares genéricos para recomendação personalizada e futura integração com links de afiliados';
COMMENT ON COLUMN hair_products.affiliate_links IS 'Links de afiliados para versão 2.0 - estrutura: [{"platform": "amazon", "url": "https://...", "active": true}]';
COMMENT ON COLUMN hair_products.compatible_profiles IS 'Perfis compatíveis: oleoso, seco, normal, com-quimica, cacheado, crespo, liso, ondulado';
COMMENT ON COLUMN hair_products.hair_goals IS 'Objetivos: hidratacao, fortalecimento, controle-frizz, crescimento';

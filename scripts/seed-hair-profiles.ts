/**
 * Script para popular os 72 perfis capilares no Supabase
 * Execução: npx tsx scripts/seed-hair-profiles.ts
 */

import { createClient } from '@supabase/supabase-js';
import { HAIR_PROFILES } from '../src/lib/calendar/hair-profiles';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedProfiles() {
  console.log(`🌱 Iniciando seed de ${HAIR_PROFILES.length} perfis capilares...`);

  // Formatar perfis para o banco
  const profilesForDB = HAIR_PROFILES.map((profile) => ({
    id: profile.id,
    name: profile.name,
    curvature: profile.curvature,
    oiliness: profile.oiliness,
    porosity: profile.porosity,
    has_chemistry: profile.hasChemistry,
    wash_days_per_week: profile.washDaysPerWeek,
    needs_refresh: profile.needsRefresh,
    capillary_schedule: profile.capillarySchedule,
    products: profile.products,
  }));

  try {
    // Inserir todos os perfis (upsert para evitar duplicatas)
    const { data, error } = await supabase
      .from('hair_profiles')
      .upsert(profilesForDB, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('❌ Erro ao inserir perfis:', error);
      process.exit(1);
    }

    console.log(`✅ ${data?.length || 0} perfis inseridos com sucesso!`);

    // Verificar total no banco
    const { count } = await supabase
      .from('hair_profiles')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Total de perfis no banco: ${count}`);
    console.log('🎉 Seed concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
    process.exit(1);
  }
}

seedProfiles();

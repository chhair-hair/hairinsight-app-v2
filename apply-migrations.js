import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  // Filtrar apenas os novos arquivos de migração
  const newMigrations = files.filter(f => 
    f.startsWith('20260204195802') || f.startsWith('20260204195858')
  );

  console.log('🚀 Aplicando migrações:', newMigrations);

  for (const file of newMigrations) {
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`\n📄 Executando: ${file}`);

    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
      
      if (error) {
        // Tenta executar diretamente se exec_sql não existir
        console.log('⚠️  exec_sql não disponível, tentando método alternativo...');
        
        // Divide em statements individuais
        const statements = sql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (const stmt of statements) {
          if (stmt) {
            const { error: stmtError } = await supabase.rpc('exec', { query: stmt + ';' });
            if (stmtError) {
              console.error(`❌ Erro ao executar statement:`, stmtError.message);
            }
          }
        }
      } else {
        console.log('✅ Migração aplicada com sucesso!');
      }
    } catch (err) {
      console.error(`❌ Erro ao aplicar migração:`, err.message);
    }
  }

  console.log('\n✨ Processo concluído!');
}

runMigrations();

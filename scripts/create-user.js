#!/usr/bin/env node

/**
 * Script para criar usuários no Supabase via Admin API
 *
 * Uso:
 * node scripts/create-user.js email@exemplo.com senha123
 * ou
 * node scripts/create-user.js email@exemplo.com senha123 "Nome do Usuário"
 */

const { createClient } = require('@supabase/supabase-js');

// Tenta carregar dotenv se disponível
try {
  require('dotenv').config();
} catch (e) {
  // dotenv não instalado, usar variáveis de ambiente diretas
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  console.error('Certifique-se de que SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no .env');
  process.exit(1);
}

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('📝 Uso: node scripts/create-user.js <email> <senha> [nome]');
  console.log('');
  console.log('Exemplo:');
  console.log('  node scripts/create-user.js usuario@email.com senha123');
  console.log('  node scripts/create-user.js usuario@email.com senha123 "João Silva"');
  process.exit(1);
}

const [email, password, name] = args;

const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔐 Criando usuário no Supabase...\n');

supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: name ? { name } : {}
}).then(({ data, error }) => {
  if (error) {
    console.error('❌ Erro ao criar usuário:', error.message);
    if (error.message.includes('already registered')) {
      console.log('\n💡 Este email já está cadastrado. Tente outro email.');
    }
    process.exit(1);
  }

  console.log('✅ Usuário criado com sucesso!\n');
  console.log('📧 Email:', email);
  console.log('🔑 Senha:', password);
  if (name) console.log('👤 Nome:', name);
  console.log('🆔 ID:', data.user.id);
  console.log('\n🎉 O usuário já pode fazer login no app!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Erro inesperado:', err.message);
  process.exit(1);
});

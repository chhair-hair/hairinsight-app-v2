#!/usr/bin/env node

/**
 * Script para listar usuários do Supabase
 *
 * Uso:
 * node scripts/list-users.js
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
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('📋 Listando usuários...\n');

supabaseAdmin.auth.admin.listUsers().then(({ data, error }) => {
  if (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }

  if (data.users.length === 0) {
    console.log('📭 Nenhum usuário cadastrado ainda.');
    process.exit(0);
  }

  console.log(`👥 Total de usuários: ${data.users.length}\n`);

  data.users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Criado em: ${new Date(user.created_at).toLocaleString('pt-BR')}`);
    if (user.user_metadata?.name) {
      console.log(`   Nome: ${user.user_metadata.name}`);
    }
    console.log('');
  });

  process.exit(0);
}).catch(err => {
  console.error('❌ Erro inesperado:', err.message);
  process.exit(1);
});

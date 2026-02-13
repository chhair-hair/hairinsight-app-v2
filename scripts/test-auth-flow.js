#!/usr/bin/env node

/**
 * Script para testar o fluxo completo de autenticação
 */

const { createClient } = require('@supabase/supabase-js');

// Tenta carregar dotenv se disponível
try {
  require('dotenv').config();
} catch (e) {
  // dotenv não instalado, usar variáveis de ambiente diretas
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(url, anonKey);

console.log('🧪 Testando Fluxo de Autenticação\n');
console.log('═'.repeat(50));

// Teste 1: Verificar conexão
console.log('\n1️⃣  Testando conexão com Supabase...');
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.log('   ❌ Erro na conexão:', error.message);
      throw error;
    }
    console.log('   ✅ Conexão estabelecida com sucesso!');
    return true;
  })
  // Teste 2: Login
  .then(() => {
    console.log('\n2️⃣  Testando login...');
    return supabase.auth.signInWithPassword({
      email: 'teste@hairinsight.com',
      password: 'senha123'
    });
  })
  .then(({ data, error }) => {
    if (error) {
      console.log('   ❌ Erro no login:', error.message);
      throw error;
    }
    console.log('   ✅ Login realizado com sucesso!');
    console.log('   👤 Usuário:', data.user.email);
    console.log('   🆔 ID:', data.user.id);
    return data.session;
  })
  // Teste 3: Verificar sessão
  .then((session) => {
    console.log('\n3️⃣  Verificando sessão...');
    if (!session) {
      throw new Error('Sessão não foi criada');
    }
    console.log('   ✅ Sessão ativa!');
    console.log('   🎫 Token criado (primeiros 50 chars):', session.access_token.substring(0, 50) + '...');
    console.log('   ⏰ Expira em:', new Date(session.expires_at * 1000).toLocaleString('pt-BR'));
    return session;
  })
  // Teste 4: Obter dados do usuário
  .then(() => {
    console.log('\n4️⃣  Obtendo dados do usuário...');
    return supabase.auth.getUser();
  })
  .then(({ data, error }) => {
    if (error) {
      console.log('   ❌ Erro ao obter usuário:', error.message);
      throw error;
    }
    console.log('   ✅ Dados obtidos com sucesso!');
    console.log('   📧 Email:', data.user.email);
    if (data.user.user_metadata?.name) {
      console.log('   👤 Nome:', data.user.user_metadata.name);
    }
    return data.user;
  })
  // Teste 5: Logout
  .then(() => {
    console.log('\n5️⃣  Testando logout...');
    return supabase.auth.signOut();
  })
  .then(({ error }) => {
    if (error) {
      console.log('   ❌ Erro no logout:', error.message);
      throw error;
    }
    console.log('   ✅ Logout realizado com sucesso!');
  })
  // Teste 6: Verificar que não há mais sessão
  .then(() => {
    console.log('\n6️⃣  Verificando que não há sessão ativa...');
    return supabase.auth.getSession();
  })
  .then(({ data }) => {
    if (data.session) {
      throw new Error('Sessão ainda existe após logout');
    }
    console.log('   ✅ Sessão removida corretamente!');
  })
  // Sucesso
  .then(() => {
    console.log('\n' + '═'.repeat(50));
    console.log('\n🎉 Todos os testes passaram com sucesso!\n');
    console.log('✅ Sistema de autenticação funcionando perfeitamente!\n');
    console.log('📝 Credenciais de teste:');
    console.log('   Email: teste@hairinsight.com');
    console.log('   Senha: senha123\n');
    process.exit(0);
  })
  // Erro
  .catch((err) => {
    console.log('\n' + '═'.repeat(50));
    console.log('\n❌ Teste falhou:', err.message);
    console.log('\n💡 Verifique:');
    console.log('   1. Se as variáveis de ambiente estão corretas');
    console.log('   2. Se o usuário teste@hairinsight.com existe');
    console.log('   3. Se a senha está correta (senha123)\n');
    process.exit(1);
  });

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth-helpers';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

// Força renderização dinâmica (não-estática) para evitar erros de prerender
export const dynamic = 'force-dynamic';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Verifica se usuário já está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/app');
      }
    };
    checkUser();
  }, [supabase, router]);

  // Verifica se veio de redirect (ex: /obrigado)
  useEffect(() => {
    const from = searchParams.get('from');
    if (from === 'obrigado') {
      setSuccessMessage('🎉 Parabéns pela sua compra! Agora faça login para acessar sua rotina personalizada.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erro de login:', error);
        setError(error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : `Erro ao fazer login: ${error.message}`);
        return;
      }

      if (data.session) {
        // Aguardar um momento para garantir que os cookies foram salvos
        await new Promise(resolve => setTimeout(resolve, 500));

        // Forçar reload da página para garantir que o middleware pegue a sessão
        window.location.href = '/app';
      }
    } catch (err) {
      console.error('Erro inesperado:', err);
      setError(`Erro inesperado: ${err instanceof Error ? err.message : 'Tente novamente'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) {
        setError(error.message === 'User already registered'
          ? 'Este email já está cadastrado'
          : 'Erro ao criar conta. Tente novamente.');
        return;
      }

      if (data.session) {
        // Login automático após cadastro
        router.push('/app');
      } else {
        // Caso precise confirmar email
        setSuccessMessage('✅ Conta criada! Verifique seu email para confirmar.');
        setMode('login');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`,
        },
      });

      if (error) {
        setError('Erro ao conectar com Google');
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1a1a1a] to-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">HairInsight</h1>
          <p className="text-white/60 text-sm">
            {mode === 'login'
              ? 'Entre para acessar sua rotina personalizada'
              : 'Crie sua conta e comece hoje'}
          </p>
        </div>

        {/* Mensagem de sucesso */}
        {successMessage && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 animate-in fade-in slide-in-from-top duration-300">
            <p className="text-green-200 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top duration-300">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {/* Card de Login/Cadastro */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                mode === 'login'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${
                mode === 'signup'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-12 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Senha (apenas no cadastro) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Botão de Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Carregando...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Entrar' : 'Criar Conta'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-white/40 text-xs">ou continue com</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar com Google
          </button>

          {/* Link de recuperação de senha */}
          {mode === 'login' && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  // TODO: Implementar recuperação de senha
                  setError('Funcionalidade em breve! Entre em contato com o suporte.');
                }}
                className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
              >
                Esqueceu sua senha?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/40 text-xs">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-purple-400 hover:underline">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="#" className="text-purple-400 hover:underline">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#1a1a1a] to-[#0D0D0D] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

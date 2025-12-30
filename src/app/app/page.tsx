'use client';

import { useRoutine } from '@/lib/routine-context';
import { Sparkles, Home, Calendar, User, Settings, TrendingUp, Droplets, Wind, Clock, ShoppingBag, CheckCircle2, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AppPage() {
  const router = useRouter();
  const { userRoutine, generateMockRoutine } = useRoutine();
  const [activeTab, setActiveTab] = useState<'inicio' | 'rotina' | 'perfil' | 'config'>('inicio');

  // Gerar rotina mock ao carregar a página se não existir
  useEffect(() => {
    if (!userRoutine) {
      generateMockRoutine();
    }
  }, [userRoutine, generateMockRoutine]);

  const handleTabClick = (tab: 'inicio' | 'rotina' | 'perfil' | 'config') => {
    setActiveTab(tab);
  };

  const handleAnalyzeClick = () => {
    generateMockRoutine();
    setActiveTab('inicio');
  };

  const handleProductsClick = () => {
    setActiveTab('rotina');
  };

  const colors = {
    primary: '#D4AF37',
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header Premium */}
      <header className="border-b border-white/10 backdrop-blur-lg bg-white/5 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
                }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HairInsight</h1>
                <p className="text-xs text-white/50">Premium</p>
              </div>
            </div>
            
            {/* Navigation Buttons - Clicáveis */}
            <nav className="hidden md:flex gap-2">
              <button 
                onClick={() => handleTabClick('inicio')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'inicio' 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Início</span>
              </button>
              <button 
                onClick={() => handleTabClick('rotina')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'rotina' 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Rotina</span>
              </button>
              <button 
                onClick={() => handleTabClick('perfil')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'perfil' 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Perfil</span>
              </button>
              <button 
                onClick={() => handleTabClick('config')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'config' 
                    ? 'bg-white/10 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Config</span>
              </button>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex gap-2">
              <button 
                onClick={() => handleTabClick('inicio')}
                className={`p-2 rounded-lg ${activeTab === 'inicio' ? 'bg-white/10' : 'text-white/60'}`}
              >
                <Home className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleTabClick('rotina')}
                className={`p-2 rounded-lg ${activeTab === 'rotina' ? 'bg-white/10' : 'text-white/60'}`}
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleTabClick('perfil')}
                className={`p-2 rounded-lg ${activeTab === 'perfil' ? 'bg-white/10' : 'text-white/60'}`}
              >
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleTabClick('config')}
                className={`p-2 rounded-lg ${activeTab === 'config' ? 'bg-white/10' : 'text-white/60'}`}
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Tab: Início */}
        {activeTab === 'inicio' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Sua Rotina Personalizada
              </h2>
              <p className="text-white/60 text-lg max-w-2xl mx-auto">
                Baseada em análise inteligente do seu tipo de cabelo e necessidades específicas
              </p>
            </div>

            {/* Análise da IA - Com dados reais */}
            {userRoutine && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Resumo da Sua Análise</h3>
                    <p className="text-white/60 text-sm">Atualizada em {new Date(userRoutine.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                {/* Cards de Análise - Dados Reais */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-3">
                      <Wind className="w-6 h-6" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-lg">Tipo de Cabelo</h4>
                    </div>
                    <p className="text-white/80 text-xl font-bold">{userRoutine.hairType}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp className="w-6 h-6" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-lg">Objetivo Principal</h4>
                    </div>
                    <p className="text-white/80 text-xl font-bold">{userRoutine.mainGoal}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-3 mb-3">
                      <Droplets className="w-6 h-6" style={{ color: colors.primary }} />
                      <h4 className="font-semibold text-lg">Tendência</h4>
                    </div>
                    <p className="text-white/80 text-xl font-bold">{userRoutine.tendency}</p>
                  </div>
                </div>

                {/* Resumo da Rotina */}
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                  <h4 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <Calendar className="w-6 h-6" style={{ color: colors.primary }} />
                    Resumo da Rotina Diária
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">☀️</span> Manhã
                      </h5>
                      <ul className="space-y-2">
                        {userRoutine.morningRoutine.map((step) => (
                          <li key={step.id} className="flex items-start gap-2 text-white/80">
                            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                            <span>{step.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">🌙</span> Noite
                      </h5>
                      <ul className="space-y-2">
                        {userRoutine.nightRoutine.map((step) => (
                          <li key={step.id} className="flex items-start gap-2 text-white/80">
                            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.primary }} />
                            <span>{step.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <h4 className="font-bold text-xl mb-4">Atualizar Análise</h4>
                <p className="text-white/60 mb-6">
                  Refaça a análise para atualizar sua rotina com base em novas informações.
                </p>
                <button
                  onClick={handleAnalyzeClick}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: colors.primary }}
                >
                  Fazer Análise Agora
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
                <h4 className="font-bold text-xl mb-4">Produtos Recomendados</h4>
                <p className="text-white/60 mb-6">
                  {userRoutine ? `${userRoutine.allRecommendedProducts.length} tipos de produtos selecionados para você` : 'Produtos específicos para seu tipo de cabelo'}
                </p>
                <button
                  onClick={handleProductsClick}
                  className="w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Ver Produtos
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Rotina */}
        {activeTab === 'rotina' && userRoutine && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sua Rotina Completa</h2>
              <p className="text-white/60 text-lg">Siga os passos abaixo para resultados incríveis</p>
            </div>

            {/* Rotina da Manhã */}
            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">☀️</span>
                Rotina da Manhã
              </h3>
              <div className="space-y-6">
                {userRoutine.morningRoutine.map((step, index) => (
                  <div key={step.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-xl">{step.title}</h4>
                          {step.duration && (
                            <span className="flex items-center gap-1 text-white/60 text-sm">
                              <Clock className="w-4 h-4" />
                              {step.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 mb-4">{step.description}</p>
                        {step.recommendedProducts.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-white/60 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Tipos de produtos recomendados:
                            </p>
                            {step.recommendedProducts.map((product) => (
                              <div key={product.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="font-semibold text-lg mb-1">{product.genericName}</p>
                                <p className="text-sm text-white/70 mb-2">
                                  <span className="font-medium">Objetivo:</span> {product.mainGoal}
                                </p>
                                <p className="text-sm text-white/60">
                                  <span className="font-medium">Ativos ideais:</span> {product.keyIngredients.join(', ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rotina da Noite */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="text-3xl">🌙</span>
                Rotina da Noite
              </h3>
              <div className="space-y-6">
                {userRoutine.nightRoutine.map((step, index) => (
                  <div key={step.id} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-xl">{step.title}</h4>
                          {step.duration && (
                            <span className="flex items-center gap-1 text-white/60 text-sm">
                              <Clock className="w-4 h-4" />
                              {step.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-white/80 mb-4">{step.description}</p>
                        {step.recommendedProducts.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-white/60 flex items-center gap-2">
                              <Package className="w-4 h-4" />
                              Tipos de produtos recomendados:
                            </p>
                            {step.recommendedProducts.map((product) => (
                              <div key={product.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="font-semibold text-lg mb-1">{product.genericName}</p>
                                <p className="text-sm text-white/70 mb-2">
                                  <span className="font-medium">Objetivo:</span> {product.mainGoal}
                                </p>
                                <p className="text-sm text-white/60">
                                  <span className="font-medium">Ativos ideais:</span> {product.keyIngredients.join(', ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista Completa de Produtos Recomendados */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <ShoppingBag className="w-7 h-7" style={{ color: colors.primary }} />
                Todos os Produtos Recomendados
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {userRoutine.allRecommendedProducts.map((product) => (
                  <div key={product.id} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <div className="mb-4">
                      <h4 className="font-bold text-lg mb-2">{product.genericName}</h4>
                      <p className="text-sm text-white/70 mb-3">
                        <span className="font-medium">Objetivo:</span> {product.mainGoal}
                      </p>
                      <p className="text-sm text-white/60 mb-3">{product.description}</p>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-xs font-semibold text-white/50 mb-1">Ativos ideais:</p>
                        <p className="text-sm text-white/80">{product.keyIngredients.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão Neutro - Produtos em Breve */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 text-center">
                <p className="text-white/80 mb-4 text-lg">
                  Estamos preparando uma seleção especial de produtos compatíveis com sua rotina.
                </p>
                <button
                  disabled
                  className="px-8 py-4 rounded-xl font-semibold bg-white/10 text-white/60 cursor-not-allowed border border-white/20"
                >
                  Produtos compatíveis serão disponibilizados em breve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Perfil */}
        {activeTab === 'perfil' && userRoutine && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Seu Perfil Capilar</h2>
              <p className="text-white/60 text-lg">Informações baseadas na sua análise</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Tipo de Cabelo */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Wind className="w-8 h-8" style={{ color: colors.primary }} />
                  <h3 className="text-2xl font-bold">Tipo de Cabelo</h3>
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">{userRoutine.hairType}</p>
                <p className="text-white/60">
                  Seu cabelo possui características específicas que requerem cuidados personalizados.
                </p>
              </div>

              {/* Objetivo Principal */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-8 h-8" style={{ color: colors.primary }} />
                  <h3 className="text-2xl font-bold">Objetivo Principal</h3>
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">{userRoutine.mainGoal}</p>
                <p className="text-white/60">
                  Foco principal da sua rotina capilar personalizada.
                </p>
              </div>

              {/* Nível de Dano */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Droplets className="w-8 h-8" style={{ color: colors.primary }} />
                  <h3 className="text-2xl font-bold">Nível de Dano</h3>
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">{userRoutine.damageLevel}</p>
                <p className="text-white/60">
                  Estado atual dos seus fios e necessidade de tratamento.
                </p>
              </div>

              {/* Tendência */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8" style={{ color: colors.primary }} />
                  <h3 className="text-2xl font-bold">Tendência</h3>
                </div>
                <p className="text-white/80 text-xl font-semibold mb-2">{userRoutine.tendency}</p>
                <p className="text-white/60">
                  Características predominantes que precisam de atenção especial.
                </p>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">Estatísticas da Rotina</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                    {userRoutine.morningRoutine.length}
                  </p>
                  <p className="text-white/60">Passos pela Manhã</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                    {userRoutine.nightRoutine.length}
                  </p>
                  <p className="text-white/60">Passos à Noite</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                    {userRoutine.allRecommendedProducts.length}
                  </p>
                  <p className="text-white/60">Tipos de Produtos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Config */}
        {activeTab === 'config' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Configurações</h2>
              <p className="text-white/60 text-lg">Personalize sua experiência</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Preferências</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Notificações de Rotina</p>
                    <p className="text-sm text-white/60">Receba lembretes para seguir sua rotina</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    Ativar
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Modo Escuro</p>
                    <p className="text-sm text-white/60">Interface com tema escuro</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    Ativo
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-semibold">Idioma</p>
                    <p className="text-sm text-white/60">Português (Brasil)</p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                    Alterar
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Conta</h3>
              <div className="space-y-4">
                <button className="w-full p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left">
                  <p className="font-semibold">Editar Perfil</p>
                  <p className="text-sm text-white/60">Atualize suas informações pessoais</p>
                </button>
                <button className="w-full p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all text-left">
                  <p className="font-semibold">Privacidade</p>
                  <p className="text-sm text-white/60">Gerencie suas preferências de privacidade</p>
                </button>
                <button className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-left">
                  <p className="font-semibold text-red-400">Sair da Conta</p>
                  <p className="text-sm text-white/60">Desconectar do aplicativo</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

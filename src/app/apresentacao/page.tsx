'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Check, Star, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApresentacaoPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'HairInsight',
      subtitle: 'Análise Capilar por IA',
      description: 'Transforme seu cabelo com inteligência artificial',
      gradient: 'from-purple-600 via-pink-500 to-purple-700',
      icon: <Sparkles className="w-16 h-16" />
    },
    {
      id: 2,
      title: 'Diagnóstico Inteligente',
      subtitle: 'Quiz personalizado com IA',
      description: 'Responda perguntas rápidas sobre seu cabelo e receba uma análise completa baseada em inteligência artificial',
      mockup: 'quiz',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 3,
      title: 'Recomendações Personalizadas',
      subtitle: 'Rotinas e produtos ideais para você',
      description: 'Feed personalizado com produtos, rotinas e dicas específicas para o seu tipo de cabelo',
      mockup: 'feed',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 4,
      title: 'Planos Acessíveis',
      subtitle: 'Mensal e Anual disponíveis',
      description: 'Escolha o plano ideal para você e tenha acesso completo a todas as funcionalidades',
      mockup: 'planos',
      gradient: 'from-purple-600 to-indigo-600'
    },
    {
      id: 5,
      title: 'Cuide do Cabelo com Inteligência',
      subtitle: 'Sua jornada capilar começa aqui',
      description: 'Análise completa, recomendações personalizadas e acompanhamento contínuo do seu progresso',
      mockup: 'home',
      gradient: 'from-indigo-600 to-purple-700'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const renderMockup = (type: string) => {
    switch (type) {
      case 'quiz':
        return (
          <div className="bg-[#0D0D0D] rounded-3xl p-8 shadow-2xl max-w-md mx-auto border border-white/10">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-white/80">Análise Personalizada</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Qual é o seu tipo de cabelo?</h2>
              </div>
              
              <div className="space-y-3">
                {['Liso', 'Ondulado', 'Cacheado', 'Crespo'].map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      idx === 1
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <span className="font-medium text-white">{option}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-1/3" />
                </div>
                <div className="text-right text-sm text-white/60 mt-2">33%</div>
              </div>
            </div>
          </div>
        );

      case 'feed':
        return (
          <div className="bg-[#0D0D0D] rounded-3xl p-8 shadow-2xl max-w-md mx-auto border border-white/10">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Produtos Recomendados</h2>
                <p className="text-white/60">Especialmente para você</p>
              </div>

              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex-shrink-0 w-40">
                    <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl p-4 border border-pink-500/30 h-48 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-pink-400" />
                    </div>
                    <div className="mt-3">
                      <h3 className="font-semibold text-white text-sm">Produto {item}</h3>
                      <p className="text-xs text-white/60 mt-1">Ideal para seu cabelo</p>
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="font-semibold text-white mb-2">Rotina Matinal</h3>
                <div className="space-y-2">
                  {['Lavar com shampoo suave', 'Aplicar condicionador', 'Finalizar com leave-in'].map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-pink-400" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'planos':
        return (
          <div className="bg-[#0D0D0D] rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Escolha seu plano ideal</h2>
              <p className="text-white/60">Acesso completo à sua rotina personalizada</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Plano Mensal</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-white">R$ 19,87</span>
                  <span className="text-white/60">/mês</span>
                </div>
                <div className="space-y-2 mb-6">
                  {['Rotina personalizada', 'Análise IA', 'Recomendações', 'Suporte'].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-purple-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold border border-white/20">
                  Escolher Mensal
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500 rounded-2xl p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Mais Popular
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Plano Anual</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-white">R$ 95,37</span>
                  <span className="text-white/60">/ano</span>
                </div>
                <div className="text-sm text-purple-400 font-semibold mb-4">60% de desconto</div>
                <div className="space-y-2 mb-6">
                  {['Rotina personalizada', 'Análise IA', 'Recomendações', 'Suporte prioritário', 'Relatórios mensais'].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-purple-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-3 rounded-xl bg-white text-purple-600 font-semibold">
                  Escolher Anual
                </button>
              </div>
            </div>
          </div>
        );

      case 'home':
        return (
          <div className="bg-[#0D0D0D] rounded-3xl p-8 shadow-2xl max-w-md mx-auto border border-white/10">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/80">HairInsight</span>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white mb-4">
                  Transforme seu cabelo com IA
                </h1>
                <p className="text-white/60">
                  Análise personalizada, rotinas inteligentes e produtos recomendados especialmente para você
                </p>
              </div>

              <div className="space-y-4">
                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                  Começar Análise
                </button>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  {[
                    { label: 'Análise IA', icon: <Sparkles className="w-6 h-6" /> },
                    { label: 'Rotinas', icon: <Check className="w-6 h-6" /> },
                    { label: 'Produtos', icon: <Star className="w-6 h-6" /> }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                      <div className="text-purple-400 mb-2 flex justify-center">{item.icon}</div>
                      <span className="text-xs text-white/70">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Mais de 10.000 usuários</p>
                    <p className="text-xs text-white/60">Transformaram seus cabelos</p>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-[#0D0D0D]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Slide Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="p-12 md:p-16"
            >
              {currentSlideData.id === 1 ? (
                // Slide 1 - Cover
                <div className="text-center py-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${currentSlideData.gradient} mb-8 text-white`}
                  >
                    {currentSlideData.icon}
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                  >
                    {currentSlideData.title}
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-3xl font-semibold text-gray-700 mb-4"
                  >
                    {currentSlideData.subtitle}
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-xl text-gray-500"
                  >
                    {currentSlideData.description}
                  </motion.p>
                </div>
              ) : (
                // Slides 2-5 - Content
                <div className="space-y-8">
                  <div className="text-center mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${currentSlideData.gradient} text-white text-sm font-semibold mb-4`}
                    >
                      {currentSlideData.subtitle}
                    </motion.div>
                    
                    <motion.h2
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-4xl font-bold text-gray-900 mb-4"
                    >
                      {currentSlideData.title}
                    </motion.h2>
                    
                    <motion.p
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                      {currentSlideData.description}
                    </motion.p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {currentSlideData.mockup && renderMockup(currentSlideData.mockup)}
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="bg-gray-50 px-12 py-6 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentSlide
                      ? 'bg-purple-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            💡 <strong>Dica:</strong> Use a tecla de screenshot do seu sistema para capturar cada slide em alta qualidade
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Navegue pelos slides e capture as telas que deseja usar no seu checkout da Hotmart
          </p>
        </div>
      </div>
    </div>
  );
}

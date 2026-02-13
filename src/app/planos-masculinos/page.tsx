'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/lib/quiz-context';
import { Sparkles, Check, Star } from 'lucide-react';

export default function PlanosMasculinosPage() {
  const router = useRouter();
  const { getThemeColors, isAdmin } = useQuiz();
  const colors = getThemeColors();
  const [selectedPlan, setSelectedPlan] = useState<'mensal' | 'anual'>('mensal');

  const plans = {
    mensal: {
      name: 'Plano Mensal',
      price: 'R$ 19,87',
      period: '/mês',
      originalPrice: null,
      savings: null,
      features: [
        'Rotina capilar personalizada',
        'Análise IA das fotos',
        'Recomendações de produtos (V2)',
        'Acesso ao app completo',
        'Suporte via chat'
      ]
    },
    anual: {
      name: 'Plano Anual',
      price: 'R$ 95,37',
      period: '/ano',
      originalPrice: 'R$ 238,44',
      savings: '60% de desconto',
      features: [
        'Rotina capilar personalizada',
        'Análise IA das fotos',
        'Recomendações de produtos (V2)',
        'Acesso ao app completo',
        'Relatórios mensais de progresso (V2)',
        'Suporte via chat'
      ]
    }
  };

  const handleCheckout = (plan: 'mensal' | 'anual') => {
    const links = {
      mensal: 'https://pay.hotmart.com/W103408313S?off=pminkloy&checkoutMode=6',
      anual: 'https://pay.hotmart.com/W103408313S?off=q0pb15fq&checkoutMode=6'
    };
    // Redirecionar para o link de checkout
    window.location.href = links[plan];
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border mb-6 border-[#9B59B6]/30"
          >
            <Sparkles className="w-4 h-4 text-[#9B59B6]" />
            <span className="text-sm text-white/80">Planos Masculinos</span>
            {isAdmin && (
              <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded ml-2">
                MODO ADMIN
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4 text-white">
            Escolha seu plano ideal
          </h1>

          <p className="text-white/60 text-lg">
            Acesso completo à sua rotina personalizada e todos os benefícios do app.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`relative bg-white/5 border rounded-2xl p-8 transition-all duration-300 ${
                selectedPlan === key
                  ? 'border-[#9B59B6] bg-[#9B59B6]/10'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {key === 'anual' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div
                    className="bg-gradient-to-r from-[#9B59B6] to-[#6F3A8D] px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1 text-white"
                  >
                    <Star className="w-4 h-4" />
                    Mais Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="text-white/40 line-through">{plan.originalPrice}</div>
                )}
                {plan.savings && (
                  <div className="text-sm font-semibold mt-2 text-[#9B59B6]">
                    {plan.savings}
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 flex-shrink-0 text-[#9B59B6]" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedPlan(key as 'mensal' | 'anual');
                  handleCheckout(key as 'mensal' | 'anual');
                }}
                className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-white text-[#9B59B6]"
              >
                Escolher {plan.name}
              </button>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-[#9B59B6]" />
              <span className="font-semibold text-white">Garantia de 30 dias</span>
            </div>
            <p className="text-white/60">
              Não ficou satisfeito? Receba reembolso completo em até 30 dias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

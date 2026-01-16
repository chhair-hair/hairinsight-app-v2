'use client';

import { useState } from 'react';
import Navbar from '@/components/custom/navbar';
import { ShoppingBag, Star, TrendingUp, Package } from 'lucide-react';
import { Gender } from '@/lib/types';

export default function ProductsPage() {
  const [gender] = useState<Gender>('feminino'); // TODO: Get from context/state

  const accentColor = gender === 'feminino' ? '#FF6F91' : '#9B59B6';

  return (
    <div className="min-h-screen">
      <Navbar gender={gender} />
      
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4">
              <ShoppingBag className="w-4 h-4" style={{ color: accentColor }} />
              <span className="text-sm text-white/80">Em Breve</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Loja de <span style={{ color: accentColor }}>Produtos</span>
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Recomendações personalizadas de produtos para seus cuidados capilares
            </p>
          </div>

          {/* Coming Soon Card */}
          <div 
            className="relative overflow-hidden rounded-3xl border border-white/10 p-12 text-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}15, transparent)` }}
          >
            <div className="relative z-10">
              <div 
                className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <Package className="w-12 h-12" style={{ color: accentColor }} />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Em Desenvolvimento</h2>
              <p className="text-white/60 mb-8 max-w-2xl mx-auto">
                Estamos preparando uma seleção especial de produtos recomendados com base na sua análise capilar. Em breve você terá acesso a:
              </p>

              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <Star className="w-8 h-8 mx-auto mb-3" style={{ color: accentColor }} />
                  <h3 className="font-bold mb-2">Recomendações IA</h3>
                  <p className="text-sm text-white/60">Produtos selecionados para seu tipo de cabelo</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <TrendingUp className="w-8 h-8 mx-auto mb-3" style={{ color: accentColor }} />
                  <h3 className="font-bold mb-2">Avaliações</h3>
                  <p className="text-sm text-white/60">Reviews de outros usuários com cabelos similares</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-3" style={{ color: accentColor }} />
                  <h3 className="font-bold mb-2">Ofertas Exclusivas</h3>
                  <p className="text-sm text-white/60">Descontos especiais em produtos recomendados</p>
                </div>
              </div>

              <div 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white/50 cursor-not-allowed"
                style={{ backgroundColor: `${accentColor}20` }}
              >
                <span>Disponível em Breve</span>
              </div>
            </div>

            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: accentColor }}
            />
            <div 
              className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

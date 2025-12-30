'use client';

import { useState } from 'react';
import { User, Sparkles } from 'lucide-react';
import { Gender } from '@/lib/quiz-context';

interface GenderSelectorProps {
  onSelect: (gender: Gender) => void;
}

export default function GenderSelector({ onSelect }: GenderSelectorProps) {
  const [hoveredGender, setHoveredGender] = useState<Gender | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6F91] to-[#9B59B6] flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            Bem-vindo ao HairInsight
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Seu assistente pessoal de cuidados capilares com inteligência artificial.
            Escolha seu perfil para começar.
          </p>
        </div>

        {/* Gender Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Female Card */}
          <button
            onClick={() => onSelect('feminino')}
            onMouseEnter={() => setHoveredGender('feminino')}
            onMouseLeave={() => setHoveredGender(null)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-left transition-all duration-500 hover:scale-105 hover:border-[#FF6F91]/50 hover:bg-[#FF6F91]/10"
          >
            {/* Gradient Background */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br from-[#FF6F91]/20 to-transparent opacity-0 transition-opacity duration-500 ${
                hoveredGender === 'feminino' ? 'opacity-100' : ''
              }`}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-xl bg-[#FF6F91]/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#FF6F91]/30 group-hover:scale-110">
                <User className="w-8 h-8 text-[#FF6F91]" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-white">Perfil Feminino</h2>
              <p className="text-white/60 mb-6">
                Análises personalizadas, cronogramas de cuidados e recomendações específicas para cabelos femininos.
              </p>
              
              <div className="flex items-center gap-2 text-[#FF6F91] font-medium">
                <span>Começar agora</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#FF6F91]/10 blur-3xl transition-all duration-500 group-hover:scale-150" />
          </button>

          {/* Male Card */}
          <button
            onClick={() => onSelect('masculino')}
            onMouseEnter={() => setHoveredGender('masculino')}
            onMouseLeave={() => setHoveredGender(null)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 text-left transition-all duration-500 hover:scale-105 hover:border-[#9B59B6]/50 hover:bg-[#9B59B6]/10"
          >
            {/* Gradient Background */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br from-[#9B59B6]/20 to-transparent opacity-0 transition-opacity duration-500 ${
                hoveredGender === 'masculino' ? 'opacity-100' : ''
              }`}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-xl bg-[#9B59B6]/20 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#9B59B6]/30 group-hover:scale-110">
                <User className="w-8 h-8 text-[#9B59B6]" />
              </div>
              
              <h2 className="text-2xl font-bold mb-3 text-white">Perfil Masculino</h2>
              <p className="text-white/60 mb-6">
                Análises personalizadas, cronogramas de cuidados e recomendações específicas para cabelos masculinos.
              </p>
              
              <div className="flex items-center gap-2 text-[#9B59B6] font-medium">
                <span>Começar agora</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#9B59B6]/10 blur-3xl transition-all duration-500 group-hover:scale-150" />
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-white/40 mt-8">
          Você poderá alterar seu perfil a qualquer momento nas configurações
        </p>
      </div>
    </div>
  );
}

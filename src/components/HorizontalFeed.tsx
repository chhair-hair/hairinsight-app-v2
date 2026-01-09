'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuiz } from '@/lib/quiz-context';

interface CardItem {
  id: number;
  titulo: string;
  imagemAntes?: string;
  imagemDepois?: string;
  descricaoAntes: string;
  descricaoDepois: string;
}

const cards: CardItem[] = [
  { 
    id: 1, 
    titulo: 'Cabelo Ondulado',
    imagemAntes: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/5f5595d2-c3cf-4caa-8604-8512f9cade18.jpg',
    imagemDepois: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/19ab466e-e2c8-4b8c-9933-cdc7ec9c283f.jpg',
    descricaoAntes: 'Fios ressecados e sem definição',
    descricaoDepois: 'Ondas definidas e hidratadas'
  },
  { 
    id: 2, 
    titulo: 'Cabelo Cacheado',
    imagemAntes: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/31f6b67c-4598-418c-bcb7-c7a8f2a07515.jpg',
    imagemDepois: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/2819a58e-978f-422e-9393-e6eb0feeb8fa.jpg',
    descricaoAntes: 'Cachos sem forma e com frizz',
    descricaoDepois: 'Cachos modelados e brilhantes'
  },
  { 
    id: 3, 
    titulo: 'Cabelo Liso',
    imagemAntes: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/22e80be6-ce47-4871-ab08-c1fb5c65a832.jpg',
    imagemDepois: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/f8084de4-9ac2-41f4-bdd8-836e199319c9.jpg',
    descricaoAntes: 'Fios opacos e sem vida',
    descricaoDepois: 'Liso sedoso e com brilho intenso'
  },
  { 
    id: 4, 
    titulo: 'Cabelo Crespo',
    imagemAntes: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/1895eac7-45e1-46b0-873c-1516545528ae.jpg',
    imagemDepois: 'https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/14a0b78e-cd2c-4ed5-bb7d-cd7ba2221949.jpg',
    descricaoAntes: 'Textura irregular e ressecada',
    descricaoDepois: 'Crespos volumosos e saudáveis'
  },
];

export default function HorizontalFeed() {
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { getThemeColors } = useQuiz();
  const colors = getThemeColors();

  // Aguardar um momento para o DOM estar pronto antes de iniciar animação
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Duplicar cards 3x para criar loop infinito verdadeiro
  const infiniteCards = [...cards, ...cards, ...cards];

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div
        className={`flex gap-6 ${isReady && !isPaused ? 'animate-scroll-horizontal' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        style={{ width: 'max-content' }}
      >
        {infiniteCards.map((card, index) => (
          <div
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-[85vw] sm:w-[400px] md:w-[450px]"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm h-full">
              {/* Título do tipo de cabelo */}
              <div 
                className="p-4 border-b border-white/10"
                style={{ 
                  background: `linear-gradient(to right, ${colors.primary}15, transparent)` 
                }}
              >
                <h3 className="text-xl font-semibold text-center text-white">{card.titulo}</h3>
              </div>

              {/* Container Antes e Depois */}
              <div className="grid grid-cols-2 gap-0">
                {/* Box ANTES */}
                <div className="relative border-r border-white/10">
                  <div 
                    className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold shadow-lg text-white"
                    style={{ backgroundColor: `${colors.primaryLight}90` }}
                  >
                    ANTES
                  </div>
                  <div className="w-full h-72 bg-white/5 flex items-center justify-center relative overflow-hidden">
                    {card.imagemAntes ? (
                      <Image
                        src={card.imagemAntes}
                        alt={`${card.titulo} - Antes`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <p className="text-white/40 text-sm">Imagem Antes aqui</p>
                    )}
                  </div>
                  <div className="p-3 bg-black/60 backdrop-blur-sm">
                    <p className="text-xs text-white/90 text-center leading-snug">
                      {card.descricaoAntes}
                    </p>
                  </div>
                </div>

                {/* Box DEPOIS */}
                <div className="relative">
                  <div 
                    className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-semibold shadow-lg text-white"
                    style={{ backgroundColor: `${colors.primary}90` }}
                  >
                    DEPOIS
                  </div>
                  <div className="w-full h-72 bg-white/5 flex items-center justify-center relative overflow-hidden">
                    {card.imagemDepois ? (
                      <Image
                        src={card.imagemDepois}
                        alt={`${card.titulo} - Depois`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <p className="text-white/40 text-sm">Imagem Depois aqui</p>
                    )}
                  </div>
                  <div className="p-3 bg-black/60 backdrop-blur-sm">
                    <p className="text-xs text-white/90 text-center leading-snug">
                      {card.descricaoDepois}
                    </p>
                  </div>
                </div>
              </div>

              {/* Descrição geral */}
              <div className="p-5 bg-gradient-to-b from-transparent to-white/5">
                <p className="text-sm text-white/80 text-center leading-relaxed">
                  Transformação após rotina personalizada
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gradientes nas bordas para efeito de fade */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#0D0D0D] to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#0D0D0D] to-transparent pointer-events-none z-10" />
    </div>
  );
}

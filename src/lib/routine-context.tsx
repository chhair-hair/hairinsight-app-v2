'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos atualizados para recomendação de produtos (SEM marcas, preços ou valores)
export interface ProductRecommendation {
  id: string;
  genericName: string; // Ex: "Shampoo Fortalecedor"
  mainGoal: string; // Ex: "Reduzir queda"
  keyIngredients: string[]; // Ex: ["biotina", "cafeína", "pH equilibrado"]
  type: string; // Ex: "shampoo", "conditioner", "mask"
  description: string;
}

export interface RoutineStep {
  id: string;
  time: 'morning' | 'night';
  order: number;
  title: string;
  description: string;
  recommendedProducts: ProductRecommendation[]; // Produtos genéricos recomendados
  duration?: string;
}

export interface UserRoutine {
  hairType: string;
  mainGoal: string;
  damageLevel: string;
  tendency: string;
  morningRoutine: RoutineStep[];
  nightRoutine: RoutineStep[];
  allRecommendedProducts: ProductRecommendation[]; // Lista completa para futura integração
  photoUrl?: string;
  createdAt: Date;
}

interface RoutineContextType {
  userRoutine: UserRoutine | null;
  setUserRoutine: (routine: UserRoutine) => void;
  generateMockRoutine: () => void;
  updateRoutine: (updates: Partial<UserRoutine>) => void;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

// Dados mock atualizados - APENAS tipos genéricos de produtos
const mockProductRecommendations: ProductRecommendation[] = [
  {
    id: '1',
    genericName: 'Shampoo Hidratante Profundo',
    mainGoal: 'Hidratação intensa e limpeza suave',
    keyIngredients: ['ácido hialurônico', 'pantenol', 'óleo de argan'],
    type: 'shampoo',
    description: 'Ideal para cabelos secos e ressecados. Limpa sem agredir os fios.',
  },
  {
    id: '2',
    genericName: 'Condicionador Nutritivo',
    mainGoal: 'Nutrição profunda e desembaraço',
    keyIngredients: ['manteiga de karité', 'óleo de coco', 'proteínas'],
    type: 'conditioner',
    description: 'Facilita o desembaraço e nutre os fios do meio para as pontas.',
  },
  {
    id: '3',
    genericName: 'Máscara Reparadora Intensiva',
    mainGoal: 'Reconstrução de fios danificados',
    keyIngredients: ['queratina', 'colágeno', 'aminoácidos'],
    type: 'mask',
    description: 'Tratamento intensivo para cabelos com danos químicos ou térmicos.',
  },
  {
    id: '4',
    genericName: 'Leave-in Protetor Térmico',
    mainGoal: 'Proteção contra calor e umidade',
    keyIngredients: ['silicones leves', 'filtro UV', 'D-pantenol'],
    type: 'leave-in',
    description: 'Protege os fios de secadores, chapinhas e babyliss até 230°C.',
  },
  {
    id: '5',
    genericName: 'Óleo Capilar Finalizador',
    mainGoal: 'Brilho e selagem das cutículas',
    keyIngredients: ['óleo de argan', 'óleo de macadâmia', 'vitamina E'],
    type: 'oil',
    description: 'Finaliza o penteado com brilho intenso sem pesar os fios.',
  },
  {
    id: '6',
    genericName: 'Shampoo Fortalecedor',
    mainGoal: 'Reduzir queda e fortalecer raiz',
    keyIngredients: ['biotina', 'cafeína', 'niacinamida'],
    type: 'shampoo',
    description: 'Estimula o couro cabeludo e fortalece os fios desde a raiz.',
  },
  {
    id: '7',
    genericName: 'Sérum Anti-Frizz',
    mainGoal: 'Controle de frizz e alinhamento',
    keyIngredients: ['óleo de pracaxi', 'silicones', 'ceramidas'],
    type: 'serum',
    description: 'Controla o frizz e alinha os fios sem deixar pesado.',
  },
];

const mockMorningRoutine: RoutineStep[] = [
  {
    id: 'm1',
    time: 'morning',
    order: 1,
    title: 'Umidificação dos Fios',
    description: 'Borrife água nos cabelos para reativar os cachos e facilitar o penteado.',
    recommendedProducts: [],
    duration: '2 min',
  },
  {
    id: 'm2',
    time: 'morning',
    order: 2,
    title: 'Aplicação do Leave-in',
    description: 'Aplique o leave-in protetor térmico de forma uniforme, focando nas pontas.',
    recommendedProducts: [mockProductRecommendations[3]],
    duration: '3 min',
  },
  {
    id: 'm3',
    time: 'morning',
    order: 3,
    title: 'Finalização com Óleo ou Sérum',
    description: 'Use 2-3 gotas de óleo capilar ou sérum anti-frizz para selar as cutículas e dar brilho.',
    recommendedProducts: [mockProductRecommendations[4], mockProductRecommendations[6]],
    duration: '2 min',
  },
];

const mockNightRoutine: RoutineStep[] = [
  {
    id: 'n1',
    time: 'night',
    order: 1,
    title: 'Lavagem com Shampoo',
    description: 'Lave os cabelos com shampoo hidratante ou fortalecedor, massageando o couro cabeludo suavemente.',
    recommendedProducts: [mockProductRecommendations[0], mockProductRecommendations[5]],
    duration: '5 min',
  },
  {
    id: 'n2',
    time: 'night',
    order: 2,
    title: 'Condicionamento',
    description: 'Aplique o condicionador do meio para as pontas, deixe agir por 3 minutos.',
    recommendedProducts: [mockProductRecommendations[1]],
    duration: '5 min',
  },
  {
    id: 'n3',
    time: 'night',
    order: 3,
    title: 'Máscara Intensiva (2x por semana)',
    description: 'Substitua o condicionador pela máscara reparadora 2 vezes na semana.',
    recommendedProducts: [mockProductRecommendations[2]],
    duration: '15 min',
  },
  {
    id: 'n4',
    time: 'night',
    order: 4,
    title: 'Secagem Natural',
    description: 'Seque os cabelos naturalmente ou com difusor em temperatura baixa.',
    recommendedProducts: [],
    duration: '30-60 min',
  },
];

export function RoutineProvider({ children }: { children: ReactNode }) {
  const [userRoutine, setUserRoutine] = useState<UserRoutine | null>(null);

  const generateMockRoutine = () => {
    const mockRoutine: UserRoutine = {
      hairType: 'Ondulado (Tipo 2B/2C)',
      mainGoal: 'Hidratação e Definição de Cachos',
      damageLevel: 'Moderado',
      tendency: 'Ressecamento e Frizz',
      morningRoutine: mockMorningRoutine,
      nightRoutine: mockNightRoutine,
      allRecommendedProducts: mockProductRecommendations,
      createdAt: new Date(),
    };
    setUserRoutine(mockRoutine);
  };

  const updateRoutine = (updates: Partial<UserRoutine>) => {
    if (userRoutine) {
      setUserRoutine({ ...userRoutine, ...updates });
    }
  };

  return (
    <RoutineContext.Provider
      value={{
        userRoutine,
        setUserRoutine,
        generateMockRoutine,
        updateRoutine,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

export function useRoutine() {
  const context = useContext(RoutineContext);
  if (context === undefined) {
    throw new Error('useRoutine must be used within a RoutineProvider');
  }
  return context;
}

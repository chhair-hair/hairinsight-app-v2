'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getTodayRoutineStatus,
  DEFAULT_ROUTINE_SCHEDULE,
  type RoutineScheduleDay,
  type TodayRoutineStatus,
} from './routine-calendar';

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
  routineSchedule: RoutineScheduleDay[];
  setRoutineSchedule: (schedule: RoutineScheduleDay[]) => void;
  todayStatus: TodayRoutineStatus;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

// Biblioteca completa de produtos genéricos (SEM marcas)
// Organizada por tipo e objetivo para personalização
const ALL_GENERIC_PRODUCTS: ProductRecommendation[] = [
  // SHAMPOOS
  {
    id: 'shampoo-hidratante',
    genericName: 'Shampoo Hidratante Profundo',
    mainGoal: 'Hidratação intensa e limpeza suave',
    keyIngredients: ['ácido hialurônico', 'pantenol', 'óleo de argan', 'glicerina'],
    type: 'shampoo',
    description: 'Ideal para cabelos secos e ressecados. Limpa sem agredir os fios.',
  },
  {
    id: 'shampoo-fortalecedor',
    genericName: 'Shampoo Fortalecedor Anticaspa',
    mainGoal: 'Reduzir queda e fortalecer raiz',
    keyIngredients: ['biotina', 'cafeína', 'niacinamida', 'zinco'],
    type: 'shampoo',
    description: 'Estimula o couro cabeludo e fortalece os fios desde a raiz.',
  },
  {
    id: 'shampoo-oleoso',
    genericName: 'Shampoo Controlador de Oleosidade',
    mainGoal: 'Controle de oleosidade e limpeza profunda',
    keyIngredients: ['argila verde', 'ácido salicílico', 'extrato de hortelã', 'tea tree oil'],
    type: 'shampoo',
    description: 'Remove excesso de oleosidade sem ressecar as pontas.',
  },
  {
    id: 'shampoo-reparador',
    genericName: 'Shampoo Reparador para Química',
    mainGoal: 'Reparação de danos químicos',
    keyIngredients: ['proteínas de trigo', 'ceramidas', 'óleo de argan', 'aminoácidos'],
    type: 'shampoo',
    description: 'Recupera cabelos com coloração, alisamento ou descoloração.',
  },

  // CONDICIONADORES
  {
    id: 'condicionador-nutritivo',
    genericName: 'Condicionador Nutritivo Intenso',
    mainGoal: 'Nutrição profunda e desembaraço',
    keyIngredients: ['manteiga de karité', 'óleo de coco', 'proteínas', 'pantenol'],
    type: 'conditioner',
    description: 'Facilita o desembaraço e nutre os fios do meio para as pontas.',
  },
  {
    id: 'condicionador-leve',
    genericName: 'Condicionador Leve para Oleosos',
    mainGoal: 'Hidratação leve sem pesar',
    keyIngredients: ['aloe vera', 'proteínas de seda', 'vitamina B5'],
    type: 'conditioner',
    description: 'Hidrata sem adicionar peso ou oleosidade.',
  },
  {
    id: 'condicionador-cachos',
    genericName: 'Condicionador Definidor de Cachos',
    mainGoal: 'Definição e controle de frizz',
    keyIngredients: ['linhaça', 'babosa', 'óleo de rícino', 'manteiga de murumuru'],
    type: 'conditioner',
    description: 'Define cachos e ondas naturais com controle de volume.',
  },

  // MÁSCARAS DE TRATAMENTO
  {
    id: 'mascara-reparadora',
    genericName: 'Máscara Reparadora Intensiva',
    mainGoal: 'Reconstrução de fios danificados',
    keyIngredients: ['queratina hidrolisada', 'colágeno', 'aminoácidos', 'creatina'],
    type: 'mask',
    description: 'Tratamento intensivo para cabelos com danos químicos ou térmicos.',
  },
  {
    id: 'mascara-hidratante',
    genericName: 'Máscara Hidratação Profunda',
    mainGoal: 'Hidratação extrema',
    keyIngredients: ['manteiga de cacau', 'óleo de abacate', 'mel', 'D-pantenol'],
    type: 'mask',
    description: 'Restaura maciez e elasticidade dos fios ressecados.',
  },
  {
    id: 'mascara-reconstrucao',
    genericName: 'Máscara Reconstrução Capilar',
    mainGoal: 'Reposição de massa capilar',
    keyIngredients: ['queratina vegetal', 'cistina', 'colágeno marinho', 'proteínas'],
    type: 'mask',
    description: 'Repõe massa capilar perdida por processos químicos.',
  },

  // LEAVE-IN E CREMES
  {
    id: 'leave-in-termico',
    genericName: 'Leave-in Protetor Térmico',
    mainGoal: 'Proteção contra calor até 230°C',
    keyIngredients: ['silicones termorresistentes', 'filtro UV', 'D-pantenol', 'vitamina E'],
    type: 'leave-in',
    description: 'Protege os fios de secadores, chapinhas e babyliss.',
  },
  {
    id: 'leave-in-cachos',
    genericName: 'Leave-in Ativador de Cachos',
    mainGoal: 'Definição e memorização de cachos',
    keyIngredients: ['polímeros formadores', 'óleo de coco', 'babosa', 'glicerina'],
    type: 'leave-in',
    description: 'Define e memoriza cachos com controle de frizz.',
  },
  {
    id: 'creme-pentear',
    genericName: 'Creme para Pentear Multifuncional',
    mainGoal: 'Desembaraço e definição',
    keyIngredients: ['manteiga de karité', 'proteínas', 'silicones', 'óleos vegetais'],
    type: 'cream',
    description: 'Facilita o pentear e protege contra quebra.',
  },

  // FINALIZADORES
  {
    id: 'oleo-finalizador',
    genericName: 'Óleo Capilar Finalizador',
    mainGoal: 'Brilho e selagem das cutículas',
    keyIngredients: ['óleo de argan', 'óleo de macadâmia', 'vitamina E', 'silicones'],
    type: 'oil',
    description: 'Finaliza o penteado com brilho intenso sem pesar.',
  },
  {
    id: 'serum-antifrizz',
    genericName: 'Sérum Anti-Frizz e Alinhamento',
    mainGoal: 'Controle de frizz e alinhamento',
    keyIngredients: ['óleo de pracaxi', 'silicones voláteis', 'ceramidas', 'óleo de buriti'],
    type: 'serum',
    description: 'Controla o frizz e alinha os fios sem deixar pesado.',
  },
  {
    id: 'gel-cachos',
    genericName: 'Gel Fixador de Cachos',
    mainGoal: 'Fixação e definição forte',
    keyIngredients: ['polímeros fixadores', 'linhaça', 'aloe vera', 'aminoácidos'],
    type: 'gel',
    description: 'Fixa e define cachos com acabamento natural.',
  },

  // TRATAMENTOS ESPECIAIS
  {
    id: 'ampola-crescimento',
    genericName: 'Ampola Estimuladora de Crescimento',
    mainGoal: 'Acelerar crescimento e reduzir queda',
    keyIngredients: ['cafeína', 'nicotinamida', 'biotina', 'extrato de alecrim'],
    type: 'treatment',
    description: 'Estimula o crescimento e reduz a queda capilar.',
  },
  {
    id: 'tonico-antiqueda',
    genericName: 'Tônico Antiqueda Fortificante',
    mainGoal: 'Fortalecimento da raiz',
    keyIngredients: ['minoxidil alternativo', 'procapil', 'biotina', 'peptídeos'],
    type: 'treatment',
    description: 'Fortalece a raiz e previne a queda excessiva.',
  },
  {
    id: 'co-wash',
    genericName: 'Co-Wash Limpeza Suave',
    mainGoal: 'Limpeza sem sulfato',
    keyIngredients: ['condicionantes', 'óleo de coco', 'extrato de frutas', 'glicerina'],
    type: 'co-wash',
    description: 'Limpa os fios sem remover a oleosidade natural.',
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
    recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'leave-in-termico')!],
    duration: '3 min',
  },
  {
    id: 'm3',
    time: 'morning',
    order: 3,
    title: 'Finalização com Óleo ou Sérum',
    description: 'Use 2-3 gotas de óleo capilar ou sérum anti-frizz para selar as cutículas e dar brilho.',
    recommendedProducts: [
      ALL_GENERIC_PRODUCTS.find(p => p.id === 'oleo-finalizador')!,
      ALL_GENERIC_PRODUCTS.find(p => p.id === 'serum-antifrizz')!
    ],
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
    recommendedProducts: [
      ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-hidratante')!,
      ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-fortalecedor')!
    ],
    duration: '5 min',
  },
  {
    id: 'n2',
    time: 'night',
    order: 2,
    title: 'Condicionamento',
    description: 'Aplique o condicionador do meio para as pontas, deixe agir por 3 minutos.',
    recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'condicionador-nutritivo')!],
    duration: '5 min',
  },
  {
    id: 'n3',
    time: 'night',
    order: 3,
    title: 'Máscara Intensiva (2x por semana)',
    description: 'Substitua o condicionador pela máscara reparadora 2 vezes na semana.',
    recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'mascara-reparadora')!],
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
  const [routineSchedule, setRoutineSchedule] = useState<RoutineScheduleDay[]>(DEFAULT_ROUTINE_SCHEDULE);
  const [todayStatus, setTodayStatus] = useState<TodayRoutineStatus>({
    hasRoutine: false,
    dayName: '',
    label: '',
    description: '',
    nextRoutineDate: undefined,
    nextRoutineDayName: '',
  });

  // Calcula o status de hoje baseado no perfil capilar
  useEffect(() => {
    // Carrega dados do quiz para determinar frequência
    let quizData = null;
    try {
      const saved = localStorage.getItem('hairinsight-quiz');
      if (saved) {
        quizData = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do quiz:', error);
    }

    // Determina qual cronograma usar baseado no perfil
    const today = new Date();
    const dayOfWeek = today.getDay();
    const hasChemistry = quizData?.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum';
    const isOily = quizData?.scalpType === 'oleoso';

    let hasRoutineToday = false;

    if (hasChemistry) {
      // Com química: Segunda (1) e Quinta (4)
      hasRoutineToday = dayOfWeek === 1 || dayOfWeek === 4;
    } else if (isOily) {
      // Oleoso: Segunda (1), Quarta (3), Sexta (5)
      hasRoutineToday = dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5;
    } else {
      // Seco/Normal: Segunda (1) e Quinta (4)
      hasRoutineToday = dayOfWeek === 1 || dayOfWeek === 4;
    }

    const DAY_NAMES = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

    if (hasRoutineToday) {
      setTodayStatus({
        hasRoutine: true,
        dayName: DAY_NAMES[dayOfWeek],
        label: 'Rotina Completa',
        description: 'Lavagem, hidratação e finalização',
      });
    } else {
      // Encontra próxima rotina
      let nextRoutineDay = -1;
      let daysToCheck = [1, 2, 3, 4, 5, 6, 7]; // Próximos 7 dias

      for (let i = 1; i <= 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() + i);
        const checkDayOfWeek = checkDate.getDay();

        let hasRoutineCheck = false;
        if (hasChemistry) {
          hasRoutineCheck = checkDayOfWeek === 1 || checkDayOfWeek === 4;
        } else if (isOily) {
          hasRoutineCheck = checkDayOfWeek === 1 || checkDayOfWeek === 3 || checkDayOfWeek === 5;
        } else {
          hasRoutineCheck = checkDayOfWeek === 1 || checkDayOfWeek === 4;
        }

        if (hasRoutineCheck) {
          nextRoutineDay = checkDayOfWeek;
          const nextDate = new Date(today);
          nextDate.setDate(nextDate.getDate() + i);

          setTodayStatus({
            hasRoutine: false,
            dayName: DAY_NAMES[dayOfWeek],
            label: '',
            description: '',
            nextRoutineDate: nextDate,
            nextRoutineDayName: DAY_NAMES[nextRoutineDay],
          });
          break;
        }
      }
    }
  }, [routineSchedule]);

  // Função para gerar rotina baseada nos dados do quiz (ou mock se não houver)
  const generateMockRoutine = () => {
    // Tenta carregar dados do quiz do localStorage
    let quizData = null;
    try {
      const saved = localStorage.getItem('hairinsight-quiz');
      if (saved) {
        quizData = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do quiz:', error);
    }

    // Se tiver dados de análise do quiz, usa eles e GERA ROTINA PERSONALIZADA
    if (quizData?.analysis && quizData.hasCompletedQuiz) {
      const personalizedMorning = generatePersonalizedMorningRoutine(quizData);
      const personalizedNight = generatePersonalizedNightRoutine(quizData);
      const personalizedProducts = selectProductsByProfile(quizData);

      const routine: UserRoutine = {
        hairType: quizData.analysis.hairType || 'Ondulado (Tipo 2B/2C)',
        mainGoal: getMainGoalLabel(quizData.hairGoal) || 'Hidratação e Definição de Cachos',
        damageLevel: quizData.analysis.damageLevel || 'Moderado',
        tendency: quizData.analysis.tendency || 'Ressecamento e Frizz',
        morningRoutine: personalizedMorning,
        nightRoutine: personalizedNight,
        allRecommendedProducts: personalizedProducts,
        createdAt: new Date(),
      };
      setUserRoutine(routine);
    } else {
      // Senão, usa o mock padrão
      const defaultProducts = ALL_GENERIC_PRODUCTS.slice(0, 7);
      const mockRoutine: UserRoutine = {
        hairType: 'Ondulado (Tipo 2B/2C)',
        mainGoal: 'Hidratação e Definição de Cachos',
        damageLevel: 'Moderado',
        tendency: 'Ressecamento e Frizz',
        morningRoutine: mockMorningRoutine,
        nightRoutine: mockNightRoutine,
        allRecommendedProducts: defaultProducts,
        createdAt: new Date(),
      };
      setUserRoutine(mockRoutine);
    }
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
        routineSchedule,
        setRoutineSchedule,
        todayStatus,
      }}
    >
      {children}
    </RoutineContext.Provider>
  );
}

// Função para selecionar produtos baseados no perfil capilar
function selectProductsByProfile(quizData: any): ProductRecommendation[] {
  const selectedProducts: ProductRecommendation[] = [];

  // Identificar características do perfil
  const hasChemistry = quizData.chemicalTreatments && quizData.chemicalTreatments !== 'nenhum';
  const isOily = quizData.scalpType === 'oleoso';
  const isCurly = quizData.hairType === 'cacheado' || quizData.hairType === 'crespo';
  const isStraight = quizData.hairType === 'liso';
  const usesHeat = quizData.heatTools === 'sim-regularmente';

  // SHAMPOOS - Seleciona baseado no couro cabeludo e química
  if (hasChemistry) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-reparador')!);
  } else if (isOily) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-oleoso')!);
  } else {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-hidratante')!);
  }

  // Se objetivo é fortalecimento ou crescimento, adiciona shampoo fortalecedor
  if (quizData.hairGoal === 'fortalecimento' || quizData.hairGoal === 'crescimento') {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-fortalecedor')!);
  }

  // CONDICIONADORES
  if (isCurly) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'condicionador-cachos')!);
  } else if (isOily) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'condicionador-leve')!);
  } else {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'condicionador-nutritivo')!);
  }

  // MÁSCARAS
  if (hasChemistry) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'mascara-reparadora')!);
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'mascara-reconstrucao')!);
  } else if (quizData.hairGoal === 'hidratacao') {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'mascara-hidratante')!);
  } else {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'mascara-reparadora')!);
  }

  // LEAVE-IN
  if (usesHeat) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'leave-in-termico')!);
  }
  if (isCurly) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'leave-in-cachos')!);
  } else {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'creme-pentear')!);
  }

  // FINALIZADORES
  if (quizData.hairGoal === 'controle-frizz' || isCurly) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'serum-antifrizz')!);
  }

  selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'oleo-finalizador')!);

  if (isCurly && quizData.hairGoal === 'controle-frizz') {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'gel-cachos')!);
  }

  // TRATAMENTOS ESPECIAIS
  if (quizData.hairGoal === 'crescimento' || quizData.hairGoal === 'fortalecimento') {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'ampola-crescimento')!);
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'tonico-antiqueda')!);
  }

  // CO-WASH para cabelos cacheados/crespos
  if (isCurly) {
    selectedProducts.push(ALL_GENERIC_PRODUCTS.find(p => p.id === 'co-wash')!);
  }

  // Remove duplicatas e undefined
  return selectedProducts.filter((p, index, self) =>
    p && self.findIndex(t => t?.id === p.id) === index
  );
}

// Função auxiliar para converter o objetivo do quiz em label
function getMainGoalLabel(hairGoal?: string): string {
  switch (hairGoal) {
    case 'hidratacao':
      return 'Hidratação Profunda';
    case 'fortalecimento':
      return 'Fortalecimento e Redução de Queda';
    case 'controle-frizz':
      return 'Controle de Frizz e Alinhamento';
    case 'crescimento':
      return 'Crescimento Capilar';
    default:
      return 'Cuidado Completo';
  }
}

// Gera rotina da MANHÃ personalizada baseada no perfil do quiz
function generatePersonalizedMorningRoutine(quizData: any): RoutineStep[] {
  const routine: RoutineStep[] = [];
  let order = 1;

  // Para cabelos CACHEADOS e CRESPOS
  if (quizData.hairType === 'cacheado' || quizData.hairType === 'crespo') {
    routine.push({
      id: `m${order}`,
      time: 'morning',
      order: order++,
      title: 'Umidificação dos Cachos',
      description: 'Borrife água ou leave-in spray para reativar os cachos do dia anterior.',
      recommendedProducts: [],
      duration: '2 min',
    });

    routine.push({
      id: `m${order}`,
      time: 'morning',
      order: order++,
      title: 'Aplicação de Creme para Pentear',
      description: 'Aplique creme para pentear com as mãos, amassando os cachos de baixo para cima.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'leave-in-cachos')!],
      duration: '3 min',
    });

    // Se usa ferramentas de calor, adiciona protetor térmico
    if (quizData.heatTools === 'sim-regularmente' || quizData.heatTools === 'sim-ocasionalmente') {
      routine.push({
        id: `m${order}`,
        time: 'morning',
        order: order++,
        title: 'Protetor Térmico',
        description: 'Use protetor térmico antes de qualquer ferramenta de calor (difusor, chapinha).',
        recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'leave-in-termico')!],
        duration: '1 min',
      });
    }

    routine.push({
      id: `m${order}`,
      time: 'morning',
      order: order++,
      title: 'Finalização com Óleo Capilar',
      description: 'Sele as pontas com 2-3 gotas de óleo para brilho e controle do frizz.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'oleo-finalizador')!],
      duration: '2 min',
    });
  }
  // Para cabelos LISOS
  else if (quizData.hairType === 'liso') {
    // Couro cabeludo oleoso = lava com mais frequência
    if (quizData.scalpType === 'oleoso') {
      routine.push({
        id: `m${order}`,
        time: 'morning',
        order: order++,
        title: 'Shampoo a Seco (se necessário)',
        description: 'Use shampoo a seco na raiz para absorver oleosidade entre as lavagens.',
        recommendedProducts: [],
        duration: '2 min',
      });
    }

    routine.push({
      id: `m${order}`,
      time: 'morning',
      order: order++,
      title: 'Leave-in Leve',
      description: 'Aplique leave-in leve apenas nas pontas para não pesar os fios.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'creme-pentear')!],
      duration: '2 min',
    });

    if (quizData.heatTools === 'sim-regularmente') {
      routine.push({
        id: `m${order}`,
        time: 'morning',
        order: order++,
        title: 'Protetor Térmico',
        description: 'Essencial antes de usar secador ou chapinha.',
        recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'leave-in-termico')!],
        duration: '1 min',
      });
    }

    routine.push({
      id: `m${order}`,
      time: 'morning',
      order: order++,
      title: 'Sérum Finalizador',
      description: 'Apenas 1-2 gotas de sérum nas pontas para brilho sem pesar.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'serum-antifrizz')!],
      duration: '1 min',
    });
  }
  // Para cabelos ONDULADOS
  else {
    routine.push({
      id: `m${order}`,
      time: 'morning',
      order: order++,
      title: 'Umidificação',
      description: 'Borrife água ou leave-in spray para reativar as ondas.',
      recommendedProducts: [],
      duration: '2 min',
    });

    routine.push({
      id: `m${order}`,
      time: 'morning',
      order: order++,
      title: 'Leave-in para Ondas',
      description: 'Aplique leave-in amassando os fios para definir as ondas.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'leave-in-cachos')!],
      duration: '3 min',
    });

    if (quizData.hairGoal === 'controle-frizz') {
      routine.push({
        id: `m${order}`,
        time: 'morning',
        order: order++,
        title: 'Anti-frizz',
        description: 'Finalize com sérum anti-frizz para controlar o volume.',
        recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'serum-antifrizz')!],
        duration: '2 min',
      });
    }
  }

  return routine;
}

// Gera rotina da NOITE personalizada baseada no perfil do quiz
function generatePersonalizedNightRoutine(quizData: any): RoutineStep[] {
  const routine: RoutineStep[] = [];
  let order = 1;

  // Frequência de lavagem influencia nos passos
  const washesFrequently = quizData.washFrequency === 'diariamente' || quizData.washFrequency === '2-3-vezes';

  // Passo 1: Lavagem
  if (quizData.scalpType === 'oleoso') {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Shampoo para Couro Cabeludo Oleoso',
      description: 'Lave com shampoo específico para controle de oleosidade, massageando bem a raiz.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-fortalecedor')!],
      duration: '5 min',
    });
  } else if (quizData.chemicalTreatments !== 'nenhum') {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Shampoo Reparador',
      description: 'Use shampoo reparador para cabelos com química (coloração, alisamento).',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-hidratante')!],
      duration: '5 min',
    });
  } else {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Shampoo Hidratante',
      description: 'Lave com shampoo hidratante, massageando o couro cabeludo suavemente.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'shampoo-hidratante')!],
      duration: '5 min',
    });
  }

  // Passo 2: Condicionamento
  if (quizData.hairType === 'liso' && quizData.scalpType === 'oleoso') {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Condicionador Apenas nas Pontas',
      description: 'Aplique condicionador SOMENTE do meio para as pontas, evitando a raiz.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'condicionador-nutritivo')!],
      duration: '3 min',
    });
  } else {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Condicionamento Profundo',
      description: 'Aplique condicionador do meio para as pontas, deixe agir por 3-5 minutos.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'condicionador-nutritivo')!],
      duration: '5 min',
    });
  }

  // Passo 3: Máscara (se tem dano químico ou objetivo de hidratação)
  if (quizData.chemicalTreatments !== 'nenhum' || quizData.hairGoal === 'hidratacao' || quizData.hairGoal === 'fortalecimento') {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Máscara de Tratamento (2-3x por semana)',
      description: 'Substitua o condicionador pela máscara reparadora 2-3 vezes na semana.',
      recommendedProducts: [ALL_GENERIC_PRODUCTS.find(p => p.id === 'mascara-reparadora')!],
      duration: '15 min',
    });
  }

  // Passo 4: Secagem
  if (quizData.hairType === 'cacheado' || quizData.hairType === 'crespo') {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Secagem com Difusor',
      description: 'Seque com difusor em temperatura baixa/média, amassando os cachos.',
      recommendedProducts: [],
      duration: '20-30 min',
    });
  } else if (quizData.heatTools === 'nao') {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Secagem Natural',
      description: 'Seque naturalmente ou com toalha de microfibra.',
      recommendedProducts: [],
      duration: '30-60 min',
    });
  } else {
    routine.push({
      id: `n${order}`,
      time: 'night',
      order: order++,
      title: 'Secagem com Secador',
      description: 'Seque com secador em temperatura média, mantendo distância dos fios.',
      recommendedProducts: [],
      duration: '15-20 min',
    });
  }

  return routine;
}

export function useRoutine() {
  const context = useContext(RoutineContext);
  if (context === undefined) {
    throw new Error('useRoutine must be used within a RoutineProvider');
  }
  return context;
}

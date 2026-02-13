'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Gender = 'feminino' | 'masculino';
export type HairType = 'liso' | 'ondulado' | 'cacheado' | 'crespo';
export type WashFrequency = 'diariamente' | '2-3-vezes' | 'semanalmente' | 'menos-uma-vez';
export type ProductType = 'convencionais' | 'naturais' | 'nenhum' | 'outros';
export type HeatTools = 'sim-regularmente' | 'sim-ocasionalmente' | 'nao';
export type HairGoal = 'hidratacao' | 'fortalecimento' | 'controle-frizz' | 'crescimento';
export type HairTexture = 'fino' | 'medio' | 'grosso' | 'muito-grosso';
export type ScalpType = 'oleoso' | 'normal' | 'seco' | 'misto';
export type HairLength = 'curto' | 'medio' | 'longo' | 'muito-longo';
export type ChemicalTreatments = 'nenhum' | 'coloracao' | 'alisamento' | 'descoloracao' | 'multiplos';
export type HairConcerns = 'queda' | 'caspa' | 'pontas-duplas' | 'volume' | 'brilho';
export type LifeStyle = 'sedentario' | 'ativo' | 'muito-ativo' | 'atleta';
export type Budget = 'basico' | 'moderado' | 'premium' | 'luxo';
export type TimeCommitment = 'minimo' | 'moderado' | 'dedicado' | 'intensivo';

export interface QuizData {
  gender?: Gender;
  hairType?: HairType;
  hairTexture?: HairTexture;
  scalpType?: ScalpType;
  hairLength?: HairLength;
  washFrequency?: WashFrequency;
  productType?: ProductType;
  productTypeOther?: string;
  chemicalTreatments?: ChemicalTreatments;
  heatTools?: HeatTools;
  hairConcerns?: HairConcerns;
  lifeStyle?: LifeStyle;
  budget?: Budget;
  timeCommitment?: TimeCommitment;
  hairGoal?: HairGoal;
  photos?: {
    left?: string;
    right?: string;
    down?: string;
  };
  analysis?: {
    hairType: string;
    damageLevel: string;
    tendency: string;
    fullRoutine?: string;
  };
  hasCompletedQuiz?: boolean;
}

interface QuizContextType {
  quizData: QuizData;
  updateQuizData: (data: Partial<QuizData>) => void;
  resetQuiz: () => void;
  getThemeColors: () => {
    primary: string;
    primaryLight: string;
    primaryDark: string;
  };
  isLoaded: boolean;
  isAdmin: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Função para salvar no localStorage com tratamento de erro
function saveToLocalStorage(key: string, data: QuizData) {
  try {
    // Tenta salvar os dados completos
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('LocalStorage quota exceeded. Salvando apenas dados essenciais...');
      
      try {
        // Se falhar, salva apenas dados essenciais (sem fotos e análise completa)
        const essentialData: QuizData = {
          gender: data.gender,
          hairType: data.hairType,
          washFrequency: data.washFrequency,
          productType: data.productType,
          productTypeOther: data.productTypeOther,
          heatTools: data.heatTools,
          hairGoal: data.hairGoal,
          hasCompletedQuiz: data.hasCompletedQuiz,
        };
        
        // Se tem análise, salva apenas os dados principais
        if (data.analysis) {
          essentialData.analysis = {
            hairType: data.analysis.hairType,
            damageLevel: data.analysis.damageLevel,
            tendency: data.analysis.tendency,
            // Não salva fullRoutine que pode ser muito grande
          };
        }
        
        localStorage.setItem(key, JSON.stringify(essentialData));
      } catch (retryError) {
        console.error('Não foi possível salvar dados no localStorage:', retryError);
        // Se ainda assim falhar, limpa o localStorage e tenta novamente
        try {
          const essentialData: QuizData = {
            gender: data.gender,
            hairType: data.hairType,
            washFrequency: data.washFrequency,
            productType: data.productType,
            productTypeOther: data.productTypeOther,
            heatTools: data.heatTools,
            hairGoal: data.hairGoal,
            hasCompletedQuiz: data.hasCompletedQuiz,
          };
          localStorage.clear();
          localStorage.setItem(key, JSON.stringify(essentialData));
        } catch (finalError) {
          console.error('Erro crítico ao salvar dados:', finalError);
        }
      }
    } else {
      console.error('Erro ao salvar dados do quiz:', error);
    }
  }
}

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizData, setQuizData] = useState<QuizData>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Carregar dados do localStorage apenas no cliente
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hairinsight-quiz');
      if (saved) {
        try {
          setQuizData(JSON.parse(saved));
        } catch (error) {
          console.error('Erro ao carregar dados do quiz:', error);
          // Se os dados estiverem corrompidos, limpa
          localStorage.removeItem('hairinsight-quiz');
        }
      }
    } catch (error) {
      console.error('Erro ao acessar localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Detectar modo admin pela URL - AGORA VERIFICA NO SERVIDOR
  useEffect(() => {
    let isMounted = true;
    
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const adminParam = searchParams.get('admin');
      
      if (adminParam) {
        // Faz requisição ao servidor para verificar a chave
        fetch(`/api/verify-admin?admin=${encodeURIComponent(adminParam)}`)
          .then(res => res.json())
          .then(data => {
            if (isMounted && data.isAdmin) {
              setIsAdmin(true);
              console.log('🔓 MODO ADMIN ATIVADO');
            } else if (isMounted) {
              console.log('❌ Chave admin inválida');
            }
          })
          .catch(err => {
            if (isMounted) {
              console.error('Erro ao verificar modo admin:', err);
            }
          });
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Memoizar updateQuizData para evitar loops infinitos
  const updateQuizData = useCallback((data: Partial<QuizData>) => {
    setQuizData((prev) => {
      const updated = { ...prev, ...data };
      // Salva com tratamento de erro
      saveToLocalStorage('hairinsight-quiz', updated);
      return updated;
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizData({});
    try {
      localStorage.removeItem('hairinsight-quiz');
    } catch (error) {
      console.error('Erro ao limpar dados do quiz:', error);
    }
  }, []);

  const getThemeColors = useCallback(() => {
    if (quizData.gender === 'feminino') {
      return {
        primary: '#FF6F91',
        primaryLight: '#FF6F91',
        primaryDark: '#FF4D73',
      };
    } else if (quizData.gender === 'masculino') {
      return {
        primary: '#9333EA',
        primaryLight: '#A855F7',
        primaryDark: '#7E22CE',
      };
    }
    // Default (antes de escolher gênero)
    return {
      primary: '#FF6F91',
      primaryLight: '#FF6F91',
      primaryDark: '#FF4D73',
    };
  }, [quizData.gender]);

  return (
    <QuizContext.Provider value={{ quizData, updateQuizData, resetQuiz, getThemeColors, isLoaded, isAdmin }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

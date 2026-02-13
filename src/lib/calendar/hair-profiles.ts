/**
 * Sistema de Perfis Capilares
 * Define os 72 perfis únicos baseados em:
 * - Curvatura (liso/ondulado/cacheado/crespo)
 * - Oleosidade (oleoso/normal/seco/misto)
 * - Porosidade (baixa/média/alta)
 * - Química (sim/não)
 */

export type HairCurvature = 'liso' | 'ondulado' | 'cacheado' | 'crespo';
export type ScalpOiliness = 'oleoso' | 'normal' | 'seco' | 'misto';
export type HairPorosity = 'baixa' | 'media' | 'alta';

export type ScheduleType = 'H' | 'N' | 'R'; // Hidratação, Nutrição, Reconstrução

export interface HairProfile {
  id: string;
  name: string;

  // Características
  curvature: HairCurvature;
  oiliness: ScalpOiliness;
  porosity: HairPorosity;
  hasChemistry: boolean;

  // Configurações de lavagem
  washDaysPerWeek: number; // 1-7
  needsRefresh: boolean;

  // Cronograma capilar (ciclo de 3 semanas)
  capillarySchedule: {
    week1: ScheduleType[];
    week2: ScheduleType[];
    week3: ScheduleType[];
  };

  // Produtos recomendados
  products: {
    shampoo: string;
    conditioner?: string;
    cowash?: string;
    hydrationMask: string;
    nutritionMask: string;
    reconstructionMask?: string;
    leaveIn: string;
    finisher: string;
    refresh?: string;
    other?: string[];
  };
}

/**
 * 10 PRIMEIROS PERFIS (de 72 totais)
 */
export const HAIR_PROFILES: HairProfile[] = [
  // PERFIL 1: Liso + Oleoso + Baixa + Sem Química
  {
    id: 'liso-oleoso-baixa-sem',
    name: 'Liso Oleoso Natural',
    curvature: 'liso',
    oiliness: 'oleoso',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 4,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H', 'H'],
      week2: ['N', 'H', 'H', 'N'],
      week3: ['H', 'H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo para cabelos oleosos (sem sulfato)',
      conditioner: 'Condicionador leve (aplicar só nas pontas)',
      hydrationMask: 'Máscara de hidratação leve',
      nutritionMask: 'Máscara de nutrição leve',
      leaveIn: 'Leave-in leve',
      finisher: 'Sérum anti-frizz',
    },
  },

  // PERFIL 2: Liso + Oleoso + Baixa + Com Química
  {
    id: 'liso-oleoso-baixa-com',
    name: 'Liso Oleoso Químico',
    curvature: 'liso',
    oiliness: 'oleoso',
    porosity: 'baixa',
    hasChemistry: true,
    washDaysPerWeek: 4,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'H', 'N'],
      week2: ['N', 'H', 'R', 'H'],
      week3: ['H', 'N', 'H', 'R'],
    },
    products: {
      shampoo: 'Shampoo para cabelos oleosos + tratados',
      conditioner: 'Condicionador para cabelos quimicamente tratados',
      hydrationMask: 'Máscara de hidratação intensiva',
      nutritionMask: 'Máscara de nutrição com óleos',
      reconstructionMask: 'Máscara de reconstrução (queratina/proteína)',
      leaveIn: 'Leave-in reparador',
      finisher: 'Protetor térmico + sérum',
    },
  },

  // PERFIL 3: Liso + Oleoso + Média + Sem Química
  {
    id: 'liso-oleoso-media-sem',
    name: 'Liso Oleoso Equilibrado',
    curvature: 'liso',
    oiliness: 'oleoso',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 4,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H', 'H'],
      week2: ['N', 'H', 'H', 'N'],
      week3: ['H', 'H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo equilibrante para cabelos oleosos',
      conditioner: 'Condicionador balanceador',
      hydrationMask: 'Máscara de hidratação média intensidade',
      nutritionMask: 'Máscara de nutrição leve',
      leaveIn: 'Leave-in',
      finisher: 'Creme para pentear ou mousse leve',
    },
  },

  // PERFIL 4: Liso + Normal + Baixa + Sem Química
  {
    id: 'liso-normal-baixa-sem',
    name: 'Liso Equilibrado Natural',
    curvature: 'liso',
    oiliness: 'normal',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo suave para uso frequente',
      conditioner: 'Condicionador hidratante',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in',
      finisher: 'Óleo capilar ou sérum',
    },
  },

  // PERFIL 5: Ondulado + Oleoso + Média + Sem Química
  {
    id: 'ondulado-oleoso-media-sem',
    name: 'Ondulado Oleoso Natural',
    curvature: 'ondulado',
    oiliness: 'oleoso',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo para cabelos ondulados oleosos',
      conditioner: 'Condicionador sem silicone',
      hydrationMask: 'Máscara de hidratação leve',
      nutritionMask: 'Máscara de nutrição com óleos vegetais',
      leaveIn: 'Leave-in para ondas',
      finisher: 'Gel ou creme para ondas',
      refresh: 'Spray revitalizador (água + leave-in)',
    },
  },

  // PERFIL 6: Cacheado + Normal + Média + Sem Química
  {
    id: 'cacheado-normal-media-sem',
    name: 'Cacheado Equilibrado Natural',
    curvature: 'cacheado',
    oiliness: 'normal',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo low-poo para cachos',
      conditioner: 'Condicionador nutritivo para cachos',
      hydrationMask: 'Máscara de hidratação intensa',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in para cachos',
      finisher: 'Creme para cachos + gel definidor',
      refresh: 'Névoa de água + ativador de cachos',
    },
  },

  // PERFIL 7: Cacheado + Normal + Alta + Com Química
  {
    id: 'cacheado-normal-alta-com',
    name: 'Cacheado Químico Poroso',
    curvature: 'cacheado',
    oiliness: 'normal',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo reparador para cachos danificados',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas',
      reconstructionMask: 'Máscara de reconstrução (proteína + queratina)',
      leaveIn: 'Leave-in reparador',
      finisher: 'Creme para cachos + gel com fixação forte',
      refresh: 'Ativador de cachos + água',
      other: ['Sérum anti-frizz'],
    },
  },

  // PERFIL 8: Crespo + Seco + Alta + Sem Química
  {
    id: 'crespo-seco-alta-sem',
    name: 'Crespo Seco Natural',
    curvature: 'crespo',
    oiliness: 'seco',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 1,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['N'],
      week2: ['H'],
      week3: ['N'],
    },
    products: {
      shampoo: 'Shampoo low-poo (uso quinzenal)',
      cowash: 'Co-wash para limpeza suave (uso semanal)',
      conditioner: 'Condicionador super nutritivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas e óleos',
      leaveIn: 'Leave-in ultra hidratante',
      finisher: 'Creme para definição + gel definidor + óleo',
      refresh: 'Ativador de cachos + água + óleo',
      other: ['Umectação (óleo de coco ou rícino pré-shampoo)'],
    },
  },

  // PERFIL 9: Crespo + Normal + Média + Sem Química
  {
    id: 'crespo-normal-media-sem',
    name: 'Crespo Equilibrado Natural',
    curvature: 'crespo',
    oiliness: 'normal',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo low-poo para crespos',
      conditioner: 'Condicionador nutritivo para crespos',
      hydrationMask: 'Máscara de hidratação intensa',
      nutritionMask: 'Máscara de nutrição com manteigas',
      leaveIn: 'Leave-in para crespos',
      finisher: 'Creme de definição + gel + óleo finalizador',
      refresh: 'Névoa de água + ativador + creme para pentear',
    },
  },

  // PERFIL 10: Ondulado + Seco + Baixa + Sem Química
  {
    id: 'ondulado-seco-baixa-sem',
    name: 'Ondulado Seco Natural',
    curvature: 'ondulado',
    oiliness: 'seco',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo hidratante suave',
      conditioner: 'Condicionador ultra hidratante',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in hidratante',
      finisher: 'Creme para ondas + óleo capilar',
      refresh: 'Spray hidratante + creme para pentear',
    },
  },

  // PERFIL 11: Liso + Oleoso + Alta + Sem Química
  {
    id: 'liso-oleoso-alta-sem',
    name: 'Liso Oleoso Poroso',
    curvature: 'liso',
    oiliness: 'oleoso',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 4,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H', 'H'],
      week2: ['N', 'H', 'H', 'N'],
      week3: ['H', 'H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo para cabelos oleosos (sem sulfato)',
      conditioner: 'Condicionador leve sem silicone',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição para fios porosos',
      leaveIn: 'Leave-in leve',
      finisher: 'Sérum reparador',
      other: ['Protetor térmico'],
    },
  },

  // PERFIL 12: Liso + Normal + Média + Sem Química
  {
    id: 'liso-normal-media-sem',
    name: 'Liso Versátil',
    curvature: 'liso',
    oiliness: 'normal',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo equilibrante',
      conditioner: 'Condicionador hidratante',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in universal',
      finisher: 'Sérum ou spray de brilho',
    },
  },

  // PERFIL 13: Liso + Seco + Baixa + Sem Química
  {
    id: 'liso-seco-baixa-sem',
    name: 'Liso Seco Sedento',
    curvature: 'liso',
    oiliness: 'seco',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo ultra hidratante (uso espaçado)',
      conditioner: 'Condicionador cremoso nutritivo',
      hydrationMask: 'Máscara de hidratação intensa',
      nutritionMask: 'Máscara de nutrição com óleos',
      leaveIn: 'Leave-in ultra hidratante',
      finisher: 'Óleo capilar ou creme de nutrição',
    },
  },

  // PERFIL 14: Liso + Seco + Média + Com Química
  {
    id: 'liso-seco-media-com',
    name: 'Liso Seco Tratado',
    curvature: 'liso',
    oiliness: 'seco',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo hidratante para cabelos tratados',
      conditioner: 'Condicionador reparador',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas',
      reconstructionMask: 'Máscara de reconstrução (proteína)',
      leaveIn: 'Leave-in reparador',
      finisher: 'Protetor térmico + óleo reparador',
    },
  },

  // PERFIL 15: Liso + Misto + Baixa + Sem Química
  {
    id: 'liso-misto-baixa-sem',
    name: 'Liso Raiz Oleosa',
    curvature: 'liso',
    oiliness: 'misto',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo para raiz oleosa e pontas secas',
      conditioner: 'Condicionador hidratante (aplicar só nas pontas)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição leve (só nas pontas)',
      leaveIn: 'Leave-in leve nas pontas',
      finisher: 'Sérum nas pontas + pó matificante na raiz',
    },
  },

  // PERFIL 16: Ondulado + Oleoso + Baixa + Sem Química
  {
    id: 'ondulado-oleoso-baixa-sem',
    name: 'Ondulado Oleoso Selado',
    curvature: 'ondulado',
    oiliness: 'oleoso',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo clarificante suave',
      conditioner: 'Condicionador leve sem silicone',
      hydrationMask: 'Máscara de hidratação leve',
      nutritionMask: 'Máscara de nutrição leve',
      leaveIn: 'Leave-in em spray leve',
      finisher: 'Gel leve para ondas',
      refresh: 'Spray de água + leave-in',
    },
  },

  // PERFIL 17: Ondulado + Oleoso + Alta + Com Química
  {
    id: 'ondulado-oleoso-alta-com',
    name: 'Ondulado Oleoso Químico',
    curvature: 'ondulado',
    oiliness: 'oleoso',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R', 'N'],
      week2: ['N', 'H', 'R'],
      week3: ['R', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo equilibrante para cabelos tratados',
      conditioner: 'Condicionador reparador leve',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador leve',
      finisher: 'Gel definidor + protetor térmico',
      refresh: 'Ativador de ondas',
    },
  },

  // PERFIL 18: Ondulado + Normal + Baixa + Sem Química
  {
    id: 'ondulado-normal-baixa-sem',
    name: 'Ondulado Equilibrado Selado',
    curvature: 'ondulado',
    oiliness: 'normal',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo suave low-poo',
      conditioner: 'Condicionador hidratante',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in para ondas',
      finisher: 'Creme para ondas leve',
      refresh: 'Spray revitalizador',
    },
  },

  // PERFIL 19: Ondulado + Normal + Alta + Sem Química
  {
    id: 'ondulado-normal-alta-sem',
    name: 'Ondulado Poroso Natural',
    curvature: 'ondulado',
    oiliness: 'normal',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo hidratante low-poo',
      conditioner: 'Condicionador nutritivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição intensa',
      leaveIn: 'Leave-in nutritivo',
      finisher: 'Creme para ondas + gel + óleo finalizador',
      refresh: 'Ativador de ondas + óleo',
    },
  },

  // PERFIL 20: Ondulado + Seco + Média + Sem Química
  {
    id: 'ondulado-seco-media-sem',
    name: 'Ondulado Seco Equilibrado',
    curvature: 'ondulado',
    oiliness: 'seco',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo hidratante suave',
      cowash: 'Co-wash para limpeza suave (alternado)',
      conditioner: 'Condicionador nutritivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in ultra hidratante',
      finisher: 'Creme para ondas + óleo',
      refresh: 'Spray hidratante + creme',
    },
  },

  // PERFIL 21: Ondulado + Seco + Alta + Com Química
  {
    id: 'ondulado-seco-alta-com',
    name: 'Ondulado Seco Danificado',
    curvature: 'ondulado',
    oiliness: 'seco',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo reparador hidratante',
      cowash: 'Co-wash para uso semanal',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Creme para ondas + gel + óleo',
      refresh: 'Ativador + água + óleo',
      other: ['Umectação pré-lavagem'],
    },
  },

  // PERFIL 22: Ondulado + Misto + Média + Sem Química
  {
    id: 'ondulado-misto-media-sem',
    name: 'Ondulado Raiz Oleosa Natural',
    curvature: 'ondulado',
    oiliness: 'misto',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador (raiz oleosa/pontas secas)',
      conditioner: 'Condicionador hidratante (só nas pontas)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição nas pontas',
      leaveIn: 'Leave-in leve no comprimento',
      finisher: 'Gel ou mousse para ondas',
      refresh: 'Spray de água + ativador',
    },
  },

  // PERFIL 23: Cacheado + Oleoso + Baixa + Sem Química
  {
    id: 'cacheado-oleoso-baixa-sem',
    name: 'Cacheado Oleoso Selado',
    curvature: 'cacheado',
    oiliness: 'oleoso',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo clarificante suave para cachos',
      conditioner: 'Condicionador leve sem silicone',
      hydrationMask: 'Máscara de hidratação média',
      nutritionMask: 'Máscara de nutrição leve',
      leaveIn: 'Leave-in leve para cachos',
      finisher: 'Gel definidor médio',
      refresh: 'Névoa de água + leave-in leve',
    },
  },

  // PERFIL 24: Cacheado + Oleoso + Média + Com Química
  {
    id: 'cacheado-oleoso-media-com',
    name: 'Cacheado Oleoso Tratado',
    curvature: 'cacheado',
    oiliness: 'oleoso',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo equilibrante para cachos tratados',
      conditioner: 'Condicionador reparador',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador',
      finisher: 'Creme para cachos + gel forte',
      refresh: 'Ativador de cachos',
    },
  },

  // PERFIL 25: Cacheado + Normal + Baixa + Sem Química
  {
    id: 'cacheado-normal-baixa-sem',
    name: 'Cacheado Equilibrado Selado',
    curvature: 'cacheado',
    oiliness: 'normal',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo low-poo para cachos',
      conditioner: 'Condicionador hidratante',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in para cachos',
      finisher: 'Creme para cachos + gel',
      refresh: 'Ativador de cachos + água',
    },
  },

  // PERFIL 26: Cacheado + Normal + Alta + Sem Química
  {
    id: 'cacheado-normal-alta-sem',
    name: 'Cacheado Poroso Natural',
    curvature: 'cacheado',
    oiliness: 'normal',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo low-poo hidratante',
      conditioner: 'Condicionador nutritivo intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas',
      leaveIn: 'Leave-in ultra nutritivo',
      finisher: 'Creme para cachos + gel + óleo',
      refresh: 'Ativador de cachos + óleo',
      other: ['Umectação semanal'],
    },
  },

  // PERFIL 27: Cacheado + Seco + Baixa + Sem Química
  {
    id: 'cacheado-seco-baixa-sem',
    name: 'Cacheado Seco Selado',
    curvature: 'cacheado',
    oiliness: 'seco',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 1,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['N'],
      week2: ['H'],
      week3: ['N'],
    },
    products: {
      shampoo: 'Shampoo hidratante (uso quinzenal)',
      cowash: 'Co-wash nutritivo (uso semanal)',
      conditioner: 'Condicionador ultra nutritivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com óleos e manteigas',
      leaveIn: 'Leave-in ultra hidratante',
      finisher: 'Creme para cachos + gel + óleo',
      refresh: 'Névoa hidratante + ativador + óleo',
      other: ['Umectação pré-lavagem'],
    },
  },

  // PERFIL 28: Cacheado + Seco + Média + Sem Química
  {
    id: 'cacheado-seco-media-sem',
    name: 'Cacheado Seco Equilibrado',
    curvature: 'cacheado',
    oiliness: 'seco',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 1,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['N'],
      week2: ['H'],
      week3: ['N'],
    },
    products: {
      shampoo: 'Shampoo low-poo hidratante',
      cowash: 'Co-wash para uso semanal',
      conditioner: 'Condicionador nutritivo',
      hydrationMask: 'Máscara de hidratação intensa',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in ultra hidratante',
      finisher: 'Creme para cachos + gel + óleo finalizador',
      refresh: 'Ativador de cachos + creme + água',
    },
  },

  // PERFIL 29: Cacheado + Seco + Alta + Com Química
  {
    id: 'cacheado-seco-alta-com',
    name: 'Cacheado Seco Danificado',
    curvature: 'cacheado',
    oiliness: 'seco',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 1,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['R'],
      week2: ['N'],
      week3: ['H'],
    },
    products: {
      shampoo: 'Shampoo reparador hidratante (uso quinzenal)',
      cowash: 'Co-wash reparador (uso semanal)',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas e óleos',
      reconstructionMask: 'Máscara de reconstrução intensiva',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Creme para cachos + gel + óleo + protetor térmico',
      refresh: 'Ativador + água + óleo + creme',
      other: ['Umectação pré-lavagem obrigatória', 'Ampola de tratamento semanal'],
    },
  },

  // PERFIL 30: Cacheado + Misto + Baixa + Sem Química
  {
    id: 'cacheado-misto-baixa-sem',
    name: 'Cacheado Raiz Oleosa Selado',
    curvature: 'cacheado',
    oiliness: 'misto',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo balanceador para raiz oleosa',
      conditioner: 'Condicionador hidratante (só no comprimento)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição no comprimento',
      leaveIn: 'Leave-in leve no comprimento',
      finisher: 'Gel definidor + creme nas pontas',
      refresh: 'Ativador de cachos (evitar raiz)',
    },
  },

  // PERFIL 31: Cacheado + Misto + Média + Com Química
  {
    id: 'cacheado-misto-media-com',
    name: 'Cacheado Raiz Oleosa Tratado',
    curvature: 'cacheado',
    oiliness: 'misto',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo balanceador para cabelos tratados',
      conditioner: 'Condicionador reparador (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador no comprimento',
      finisher: 'Creme para cachos + gel',
      refresh: 'Ativador de cachos',
    },
  },

  // PERFIL 32: Crespo + Oleoso + Baixa + Sem Química
  {
    id: 'crespo-oleoso-baixa-sem',
    name: 'Crespo Oleoso Selado',
    curvature: 'crespo',
    oiliness: 'oleoso',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo clarificante suave para crespos',
      conditioner: 'Condicionador leve sem silicone',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição leve',
      leaveIn: 'Leave-in leve',
      finisher: 'Creme de definição + gel',
      refresh: 'Névoa de água + leave-in',
    },
  },

  // PERFIL 33: Crespo + Oleoso + Média + Sem Química
  {
    id: 'crespo-oleoso-media-sem',
    name: 'Crespo Oleoso Natural',
    curvature: 'crespo',
    oiliness: 'oleoso',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo low-poo equilibrante',
      conditioner: 'Condicionador nutritivo',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in para crespos',
      finisher: 'Creme de definição + gel + óleo finalizador',
      refresh: 'Ativador + água + creme',
    },
  },

  // PERFIL 34: Crespo + Oleoso + Alta + Com Química
  {
    id: 'crespo-oleoso-alta-com',
    name: 'Crespo Oleoso Químico',
    curvature: 'crespo',
    oiliness: 'oleoso',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo equilibrante reparador',
      conditioner: 'Condicionador reparador',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador',
      finisher: 'Creme para crespos + gel forte',
      refresh: 'Ativador de cachos',
    },
  },

  // PERFIL 35: Crespo + Normal + Baixa + Sem Química
  {
    id: 'crespo-normal-baixa-sem',
    name: 'Crespo Equilibrado Selado',
    curvature: 'crespo',
    oiliness: 'normal',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo low-poo para crespos',
      conditioner: 'Condicionador hidratante',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in para crespos',
      finisher: 'Creme de definição + gel + óleo',
      refresh: 'Névoa de água + ativador',
    },
  },

  // PERFIL 36: Crespo + Normal + Alta + Com Química
  {
    id: 'crespo-normal-alta-com',
    name: 'Crespo Poroso Tratado',
    curvature: 'crespo',
    oiliness: 'normal',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo reparador para crespos',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas',
      reconstructionMask: 'Máscara de reconstrução intensiva',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Creme para crespos + gel forte + óleo',
      refresh: 'Ativador + água + óleo',
      other: ['Umectação pré-lavagem'],
    },
  },

  // PERFIL 37: Crespo + Seco + Baixa + Sem Química
  {
    id: 'crespo-seco-baixa-sem',
    name: 'Crespo Seco Selado',
    curvature: 'crespo',
    oiliness: 'seco',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 1,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['N'],
      week2: ['H'],
      week3: ['N'],
    },
    products: {
      shampoo: 'Shampoo low-poo hidratante (uso quinzenal)',
      cowash: 'Co-wash nutritivo (uso semanal)',
      conditioner: 'Condicionador ultra nutritivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas e óleos',
      leaveIn: 'Leave-in ultra hidratante',
      finisher: 'Creme para crespos + gel + óleo',
      refresh: 'Névoa hidratante + ativador + óleo',
      other: ['Umectação pré-lavagem'],
    },
  },

  // PERFIL 38: Crespo + Seco + Média + Com Química
  {
    id: 'crespo-seco-media-com',
    name: 'Crespo Seco Tratado',
    curvature: 'crespo',
    oiliness: 'seco',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 1,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['R'],
      week2: ['N'],
      week3: ['H'],
    },
    products: {
      shampoo: 'Shampoo reparador hidratante (uso quinzenal)',
      cowash: 'Co-wash reparador (uso semanal)',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Creme para crespos + gel + óleo + protetor térmico',
      refresh: 'Ativador + água + óleo + creme',
      other: ['Umectação obrigatória', 'Ampola de tratamento'],
    },
  },

  // PERFIL 39: Crespo + Seco + Alta + Sem Química (já existe como perfil 8)
  // Vamos criar: Crespo + Misto + Baixa + Sem Química
  {
    id: 'crespo-misto-baixa-sem',
    name: 'Crespo Raiz Oleosa Selado',
    curvature: 'crespo',
    oiliness: 'misto',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo balanceador para raiz oleosa',
      conditioner: 'Condicionador nutritivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição no comprimento',
      leaveIn: 'Leave-in no comprimento',
      finisher: 'Creme de definição + gel + óleo nas pontas',
      refresh: 'Ativador (evitar raiz) + água',
    },
  },

  // PERFIL 40: Crespo + Misto + Média + Sem Química
  {
    id: 'crespo-misto-media-sem',
    name: 'Crespo Raiz Oleosa Natural',
    curvature: 'crespo',
    oiliness: 'misto',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo balanceador low-poo',
      conditioner: 'Condicionador nutritivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição',
      leaveIn: 'Leave-in no comprimento',
      finisher: 'Creme para crespos + gel + óleo finalizador',
      refresh: 'Ativador + água + creme',
    },
  },

  // PERFIL 41: Liso + Oleoso + Média + Com Química
  {
    id: 'liso-oleoso-media-com',
    name: 'Liso Oleoso Químico Equilibrado',
    curvature: 'liso',
    oiliness: 'oleoso',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 4,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'H', 'N'],
      week2: ['N', 'H', 'R', 'H'],
      week3: ['H', 'N', 'H', 'R'],
    },
    products: {
      shampoo: 'Shampoo equilibrante para cabelos tratados',
      conditioner: 'Condicionador reparador leve',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador leve',
      finisher: 'Protetor térmico + sérum',
    },
  },

  // PERFIL 42: Liso + Oleoso + Alta + Com Química
  {
    id: 'liso-oleoso-alta-com',
    name: 'Liso Oleoso Danificado',
    curvature: 'liso',
    oiliness: 'oleoso',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 4,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'H', 'N'],
      week2: ['N', 'H', 'R', 'H'],
      week3: ['R', 'H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo reparador para cabelos oleosos',
      conditioner: 'Condicionador reparador sem silicone',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição para fios porosos',
      reconstructionMask: 'Máscara de reconstrução intensiva',
      leaveIn: 'Leave-in reparador leve',
      finisher: 'Protetor térmico + sérum reparador',
      other: ['Ampola de tratamento quinzenal'],
    },
  },

  // PERFIL 43: Liso + Normal + Baixa + Com Química
  {
    id: 'liso-normal-baixa-com',
    name: 'Liso Equilibrado Tratado',
    curvature: 'liso',
    oiliness: 'normal',
    porosity: 'baixa',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'H'],
      week2: ['N', 'H', 'R'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo para cabelos tratados',
      conditioner: 'Condicionador reparador',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador',
      finisher: 'Protetor térmico + óleo reparador',
    },
  },

  // PERFIL 44: Liso + Normal + Média + Com Química
  {
    id: 'liso-normal-media-com',
    name: 'Liso Versátil Tratado',
    curvature: 'liso',
    oiliness: 'normal',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'N'],
      week2: ['N', 'H', 'R'],
      week3: ['R', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo equilibrante para cabelos tratados',
      conditioner: 'Condicionador reparador',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador',
      finisher: 'Protetor térmico + sérum de brilho',
    },
  },

  // PERFIL 45: Liso + Normal + Alta + Sem Química
  {
    id: 'liso-normal-alta-sem',
    name: 'Liso Poroso Natural',
    curvature: 'liso',
    oiliness: 'normal',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo hidratante para fios porosos',
      conditioner: 'Condicionador nutritivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição intensiva',
      leaveIn: 'Leave-in nutritivo',
      finisher: 'Sérum reparador + óleo',
      other: ['Umectação quinzenal'],
    },
  },

  // PERFIL 46: Liso + Normal + Alta + Com Química
  {
    id: 'liso-normal-alta-com',
    name: 'Liso Poroso Tratado',
    curvature: 'liso',
    oiliness: 'normal',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'N'],
      week2: ['N', 'H', 'R'],
      week3: ['R', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo reparador hidratante',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas',
      reconstructionMask: 'Máscara de reconstrução intensiva',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Protetor térmico + óleo reparador',
      other: ['Umectação pré-lavagem', 'Ampola de tratamento semanal'],
    },
  },

  // PERFIL 47: Liso + Seco + Baixa + Com Química
  {
    id: 'liso-seco-baixa-com',
    name: 'Liso Seco Tratado Selado',
    curvature: 'liso',
    oiliness: 'seco',
    porosity: 'baixa',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo hidratante para cabelos tratados (uso espaçado)',
      conditioner: 'Condicionador reparador cremoso',
      hydrationMask: 'Máscara de hidratação intensa',
      nutritionMask: 'Máscara de nutrição com óleos e manteigas',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Óleo reparador + protetor térmico',
      other: ['Umectação pré-lavagem'],
    },
  },

  // PERFIL 48: Liso + Seco + Média + Sem Química
  {
    id: 'liso-seco-media-sem',
    name: 'Liso Seco Natural',
    curvature: 'liso',
    oiliness: 'seco',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo hidratante suave',
      conditioner: 'Condicionador nutritivo cremoso',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com óleos',
      leaveIn: 'Leave-in ultra hidratante',
      finisher: 'Óleo capilar + creme de nutrição',
    },
  },

  // PERFIL 49: Liso + Seco + Alta + Sem Química
  {
    id: 'liso-seco-alta-sem',
    name: 'Liso Seco Poroso',
    curvature: 'liso',
    oiliness: 'seco',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo hidratante profundo (uso espaçado)',
      conditioner: 'Condicionador ultra nutritivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição intensiva com manteigas',
      leaveIn: 'Leave-in ultra hidratante',
      finisher: 'Óleo capilar + creme nutritivo',
      other: ['Umectação pré-lavagem obrigatória'],
    },
  },

  // PERFIL 50: Liso + Seco + Alta + Com Química
  {
    id: 'liso-seco-alta-com',
    name: 'Liso Seco Danificado',
    curvature: 'liso',
    oiliness: 'seco',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['R', 'N'],
      week2: ['H', 'R'],
      week3: ['N', 'H'],
    },
    products: {
      shampoo: 'Shampoo reparador hidratante (uso quinzenal)',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas e óleos',
      reconstructionMask: 'Máscara de reconstrução intensiva',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Protetor térmico + óleo reparador + sérum',
      other: ['Umectação obrigatória', 'Ampola de tratamento semanal', 'Cauterização capilar mensal'],
    },
  },

  // PERFIL 51: Liso + Misto + Baixa + Com Química
  {
    id: 'liso-misto-baixa-com',
    name: 'Liso Raiz Oleosa Tratado',
    curvature: 'liso',
    oiliness: 'misto',
    porosity: 'baixa',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'H'],
      week2: ['N', 'H', 'R'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador para cabelos tratados',
      conditioner: 'Condicionador reparador (só nas pontas)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição nas pontas',
      reconstructionMask: 'Máscara de reconstrução (evitar raiz)',
      leaveIn: 'Leave-in reparador nas pontas',
      finisher: 'Protetor térmico + sérum nas pontas + pó matificante na raiz',
    },
  },

  // PERFIL 52: Liso + Misto + Média + Sem Química
  {
    id: 'liso-misto-media-sem',
    name: 'Liso Raiz Oleosa Equilibrado',
    curvature: 'liso',
    oiliness: 'misto',
    porosity: 'media',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador',
      conditioner: 'Condicionador hidratante (só no comprimento)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição no comprimento',
      leaveIn: 'Leave-in leve no comprimento',
      finisher: 'Sérum nas pontas + spray matificante na raiz',
    },
  },

  // PERFIL 53: Liso + Misto + Média + Com Química
  {
    id: 'liso-misto-media-com',
    name: 'Liso Raiz Oleosa Químico',
    curvature: 'liso',
    oiliness: 'misto',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'N'],
      week2: ['N', 'H', 'R'],
      week3: ['R', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador para cabelos tratados',
      conditioner: 'Condicionador reparador (só no comprimento)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução (evitar raiz)',
      leaveIn: 'Leave-in reparador no comprimento',
      finisher: 'Protetor térmico + sérum nas pontas',
    },
  },

  // PERFIL 54: Liso + Misto + Alta + Sem Química
  {
    id: 'liso-misto-alta-sem',
    name: 'Liso Raiz Oleosa Poroso',
    curvature: 'liso',
    oiliness: 'misto',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador para fios porosos',
      conditioner: 'Condicionador nutritivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição intensiva no comprimento',
      leaveIn: 'Leave-in nutritivo no comprimento',
      finisher: 'Sérum + óleo nas pontas',
      other: ['Umectação nas pontas'],
    },
  },

  // PERFIL 55: Liso + Misto + Alta + Com Química
  {
    id: 'liso-misto-alta-com',
    name: 'Liso Raiz Oleosa Danificado',
    curvature: 'liso',
    oiliness: 'misto',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: false,
    capillarySchedule: {
      week1: ['H', 'R', 'N'],
      week2: ['N', 'H', 'R'],
      week3: ['R', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador reparador',
      conditioner: 'Condicionador reparador intensivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição com manteigas (comprimento)',
      reconstructionMask: 'Máscara de reconstrução intensiva (evitar raiz)',
      leaveIn: 'Leave-in reparador ultra hidratante no comprimento',
      finisher: 'Protetor térmico + óleo reparador nas pontas',
      other: ['Umectação nas pontas', 'Ampola de tratamento'],
    },
  },

  // PERFIL 56: Ondulado + Oleoso + Baixa + Com Química
  {
    id: 'ondulado-oleoso-baixa-com',
    name: 'Ondulado Oleoso Tratado Selado',
    curvature: 'ondulado',
    oiliness: 'oleoso',
    porosity: 'baixa',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R', 'H'],
      week2: ['N', 'H', 'R'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo clarificante para cabelos tratados',
      conditioner: 'Condicionador reparador leve',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição leve',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador leve',
      finisher: 'Gel definidor + protetor térmico',
      refresh: 'Spray de água + ativador',
    },
  },

  // PERFIL 57: Ondulado + Oleoso + Média + Com Química
  {
    id: 'ondulado-oleoso-media-com',
    name: 'Ondulado Oleoso Químico Equilibrado',
    curvature: 'ondulado',
    oiliness: 'oleoso',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R', 'N'],
      week2: ['N', 'H', 'R'],
      week3: ['R', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo equilibrante para ondulados tratados',
      conditioner: 'Condicionador reparador',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador',
      finisher: 'Creme para ondas + gel',
      refresh: 'Ativador de ondas',
    },
  },

  // PERFIL 58: Ondulado + Normal + Baixa + Com Química
  {
    id: 'ondulado-normal-baixa-com',
    name: 'Ondulado Equilibrado Tratado Selado',
    curvature: 'ondulado',
    oiliness: 'normal',
    porosity: 'baixa',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo low-poo para ondulados tratados',
      conditioner: 'Condicionador reparador',
      hydrationMask: 'Máscara de hidratação',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador para ondas',
      finisher: 'Creme para ondas + gel',
      refresh: 'Spray revitalizador',
    },
  },

  // PERFIL 59: Ondulado + Normal + Média + Com Química
  {
    id: 'ondulado-normal-media-com',
    name: 'Ondulado Versátil Tratado',
    curvature: 'ondulado',
    oiliness: 'normal',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo equilibrante para ondulados tratados',
      conditioner: 'Condicionador reparador',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador',
      finisher: 'Creme para ondas + gel + protetor térmico',
      refresh: 'Ativador de ondas',
    },
  },

  // PERFIL 60: Ondulado + Normal + Alta + Com Química
  {
    id: 'ondulado-normal-alta-com',
    name: 'Ondulado Poroso Tratado',
    curvature: 'ondulado',
    oiliness: 'normal',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo reparador hidratante para ondulados',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com manteigas',
      reconstructionMask: 'Máscara de reconstrução intensiva',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Creme para ondas + gel + óleo',
      refresh: 'Ativador + óleo',
      other: ['Umectação pré-lavagem'],
    },
  },

  // PERFIL 61: Ondulado + Seco + Baixa + Com Química
  {
    id: 'ondulado-seco-baixa-com',
    name: 'Ondulado Seco Tratado Selado',
    curvature: 'ondulado',
    oiliness: 'seco',
    porosity: 'baixa',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo hidratante para ondulados tratados',
      cowash: 'Co-wash para uso alternado',
      conditioner: 'Condicionador reparador cremoso',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição com óleos',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Creme para ondas + óleo + protetor térmico',
      refresh: 'Spray hidratante + ativador',
      other: ['Umectação pré-lavagem'],
    },
  },

  // PERFIL 62: Ondulado + Seco + Média + Com Química
  {
    id: 'ondulado-seco-media-com',
    name: 'Ondulado Seco Tratado',
    curvature: 'ondulado',
    oiliness: 'seco',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo reparador hidratante',
      cowash: 'Co-wash reparador (uso alternado)',
      conditioner: 'Condicionador reparador intensivo',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador ultra hidratante',
      finisher: 'Creme para ondas + gel + óleo',
      refresh: 'Ativador + água + óleo',
      other: ['Umectação quinzenal'],
    },
  },

  // PERFIL 63: Ondulado + Misto + Baixa + Sem Química
  {
    id: 'ondulado-misto-baixa-sem',
    name: 'Ondulado Raiz Oleosa Selado',
    curvature: 'ondulado',
    oiliness: 'misto',
    porosity: 'baixa',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador low-poo',
      conditioner: 'Condicionador hidratante (só no comprimento)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição no comprimento',
      leaveIn: 'Leave-in leve no comprimento',
      finisher: 'Gel ou mousse para ondas',
      refresh: 'Spray de água + ativador (evitar raiz)',
    },
  },

  // PERFIL 64: Ondulado + Misto + Baixa + Com Química
  {
    id: 'ondulado-misto-baixa-com',
    name: 'Ondulado Raiz Oleosa Tratado Selado',
    curvature: 'ondulado',
    oiliness: 'misto',
    porosity: 'baixa',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R', 'H'],
      week2: ['N', 'H', 'R'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador para cabelos tratados',
      conditioner: 'Condicionador reparador (só no comprimento)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução (evitar raiz)',
      leaveIn: 'Leave-in reparador no comprimento',
      finisher: 'Gel definidor + protetor térmico',
      refresh: 'Ativador (evitar raiz)',
    },
  },

  // PERFIL 65: Ondulado + Misto + Média + Com Química
  {
    id: 'ondulado-misto-media-com',
    name: 'Ondulado Raiz Oleosa Tratado',
    curvature: 'ondulado',
    oiliness: 'misto',
    porosity: 'media',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R', 'N'],
      week2: ['N', 'H', 'R'],
      week3: ['R', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador reparador',
      conditioner: 'Condicionador reparador (só no comprimento)',
      hydrationMask: 'Máscara de hidratação (evitar raiz)',
      nutritionMask: 'Máscara de nutrição',
      reconstructionMask: 'Máscara de reconstrução',
      leaveIn: 'Leave-in reparador no comprimento',
      finisher: 'Creme para ondas + gel',
      refresh: 'Ativador de ondas',
    },
  },

  // PERFIL 66: Ondulado + Misto + Alta + Sem Química
  {
    id: 'ondulado-misto-alta-sem',
    name: 'Ondulado Raiz Oleosa Poroso',
    curvature: 'ondulado',
    oiliness: 'misto',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N', 'H'],
      week2: ['N', 'H', 'N'],
      week3: ['H', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador para fios porosos',
      conditioner: 'Condicionador nutritivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição intensiva no comprimento',
      leaveIn: 'Leave-in nutritivo no comprimento',
      finisher: 'Creme para ondas + gel + óleo nas pontas',
      refresh: 'Ativador + óleo (evitar raiz)',
      other: ['Umectação nas pontas'],
    },
  },

  // PERFIL 67: Ondulado + Misto + Alta + Com Química
  {
    id: 'ondulado-misto-alta-com',
    name: 'Ondulado Raiz Oleosa Danificado',
    curvature: 'ondulado',
    oiliness: 'misto',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 3,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R', 'N'],
      week2: ['N', 'H', 'R'],
      week3: ['R', 'N', 'H'],
    },
    products: {
      shampoo: 'Shampoo balanceador reparador',
      conditioner: 'Condicionador reparador intensivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição com manteigas (comprimento)',
      reconstructionMask: 'Máscara de reconstrução intensiva (evitar raiz)',
      leaveIn: 'Leave-in reparador ultra hidratante no comprimento',
      finisher: 'Creme para ondas + gel + óleo + protetor térmico',
      refresh: 'Ativador + óleo (evitar raiz)',
      other: ['Umectação nas pontas', 'Ampola de tratamento'],
    },
  },

  // PERFIL 68: Cacheado + Oleoso + Alta + Sem Química
  {
    id: 'cacheado-oleoso-alta-sem',
    name: 'Cacheado Oleoso Poroso',
    curvature: 'cacheado',
    oiliness: 'oleoso',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo clarificante suave para cachos',
      conditioner: 'Condicionador nutritivo sem silicone',
      hydrationMask: 'Máscara de hidratação profunda',
      nutritionMask: 'Máscara de nutrição intensiva',
      leaveIn: 'Leave-in nutritivo',
      finisher: 'Creme para cachos + gel forte + óleo finalizador',
      refresh: 'Ativador + água + óleo',
      other: ['Umectação quinzenal'],
    },
  },

  // PERFIL 69: Cacheado + Misto + Alta + Sem Química
  {
    id: 'cacheado-misto-alta-sem',
    name: 'Cacheado Raiz Oleosa Poroso',
    curvature: 'cacheado',
    oiliness: 'misto',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo balanceador para cachos',
      conditioner: 'Condicionador nutritivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição intensiva no comprimento',
      leaveIn: 'Leave-in nutritivo no comprimento',
      finisher: 'Creme para cachos + gel + óleo nas pontas',
      refresh: 'Ativador + óleo (evitar raiz)',
      other: ['Umectação no comprimento'],
    },
  },

  // PERFIL 70: Cacheado + Misto + Alta + Com Química
  {
    id: 'cacheado-misto-alta-com',
    name: 'Cacheado Raiz Oleosa Danificado',
    curvature: 'cacheado',
    oiliness: 'misto',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo balanceador reparador para cachos',
      conditioner: 'Condicionador reparador intensivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição com manteigas (comprimento)',
      reconstructionMask: 'Máscara de reconstrução intensiva (evitar raiz)',
      leaveIn: 'Leave-in reparador ultra hidratante no comprimento',
      finisher: 'Creme para cachos + gel forte + óleo + protetor térmico',
      refresh: 'Ativador + óleo + creme (evitar raiz)',
      other: ['Umectação no comprimento', 'Ampola de tratamento'],
    },
  },

  // PERFIL 71: Crespo + Misto + Alta + Sem Química
  {
    id: 'crespo-misto-alta-sem',
    name: 'Crespo Raiz Oleosa Poroso',
    curvature: 'crespo',
    oiliness: 'misto',
    porosity: 'alta',
    hasChemistry: false,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'N'],
      week2: ['N', 'H'],
      week3: ['H', 'N'],
    },
    products: {
      shampoo: 'Shampoo balanceador low-poo para crespos',
      conditioner: 'Condicionador ultra nutritivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição intensiva com manteigas (comprimento)',
      leaveIn: 'Leave-in ultra hidratante no comprimento',
      finisher: 'Creme para crespos + gel forte + óleo nas pontas',
      refresh: 'Ativador + óleo + creme (evitar raiz)',
      other: ['Umectação no comprimento'],
    },
  },

  // PERFIL 72: Crespo + Misto + Alta + Com Química
  {
    id: 'crespo-misto-alta-com',
    name: 'Crespo Raiz Oleosa Danificado',
    curvature: 'crespo',
    oiliness: 'misto',
    porosity: 'alta',
    hasChemistry: true,
    washDaysPerWeek: 2,
    needsRefresh: true,
    capillarySchedule: {
      week1: ['H', 'R'],
      week2: ['N', 'H'],
      week3: ['R', 'N'],
    },
    products: {
      shampoo: 'Shampoo balanceador reparador para crespos',
      conditioner: 'Condicionador reparador intensivo (só no comprimento)',
      hydrationMask: 'Máscara de hidratação profunda (evitar raiz)',
      nutritionMask: 'Máscara de nutrição com manteigas e óleos (comprimento)',
      reconstructionMask: 'Máscara de reconstrução intensiva (evitar raiz)',
      leaveIn: 'Leave-in reparador ultra hidratante no comprimento',
      finisher: 'Creme para crespos + gel forte + óleo + protetor térmico',
      refresh: 'Ativador + óleo + creme (evitar raiz)',
      other: ['Umectação obrigatória no comprimento', 'Ampola de tratamento semanal'],
    },
  },
];

/**
 * Função para calcular a porosidade baseada nas respostas do quiz
 */
export function calculatePorosity(
  chemicalTreatments: string,
  heatTools: string,
  hairTexture: string
): HairPorosity {
  // Alta porosidade: química pesada + calor regular
  if (
    ['multiplos', 'descoloracao', 'alisamento'].includes(chemicalTreatments) ||
    (chemicalTreatments === 'coloracao' && heatTools === 'sim-regularmente')
  ) {
    return 'alta';
  }

  // Baixa porosidade: sem química + sem calor + fios finos
  if (
    chemicalTreatments === 'nenhum' &&
    heatTools === 'nao' &&
    hairTexture === 'fino'
  ) {
    return 'baixa';
  }

  // Média porosidade: casos intermediários
  return 'media';
}

/**
 * Função para encontrar o perfil ideal baseado nas características
 */
export function findProfile(
  curvature: HairCurvature,
  oiliness: ScalpOiliness,
  porosity: HairPorosity,
  hasChemistry: boolean
): HairProfile | null {
  return (
    HAIR_PROFILES.find(
      (profile) =>
        profile.curvature === curvature &&
        profile.oiliness === oiliness &&
        profile.porosity === porosity &&
        profile.hasChemistry === hasChemistry
    ) || null
  );
}

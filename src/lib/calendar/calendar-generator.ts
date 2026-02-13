/**
 * Gerador de Calendário Capilar
 * Cria automaticamente um calendário semanal personalizado baseado no perfil do usuário
 */

import { HairProfile, ScheduleType } from './hair-profiles';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type RoutineType =
  | 'wash' // Lavagem completa
  | 'refresh' // Refresh (para cachos/ondas)
  | 'rest' // Descanso
  | 'cowash'; // Co-wash

export interface DayRoutine {
  type: RoutineType;
  scheduleType?: ScheduleType; // H, N ou R (apenas para lavagens)
  title: string;
  description: string;
  products: string[];
  steps: string[];
  duration: string; // Ex: "30min", "15min"
  icon: string; // Emoji para o card
}

export interface WeeklyCalendar {
  weekNumber: 1 | 2 | 3; // Semana do ciclo de 3 semanas
  startDate: Date;
  days: Record<DayOfWeek, DayRoutine>;
}

const DAYS_ORDER: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

/**
 * Gera a descrição e passos detalhados para cada tipo de rotina
 */
function buildRoutineDetails(
  type: RoutineType,
  scheduleType: ScheduleType | undefined,
  profile: HairProfile
): Pick<DayRoutine, 'title' | 'description' | 'products' | 'steps' | 'duration' | 'icon'> {
  const { products } = profile;

  // LAVAGEM COM HIDRATAÇÃO
  if (type === 'wash' && scheduleType === 'H') {
    return {
      title: 'Lavagem + Hidratação',
      description: 'Dia de lavar e hidratar profundamente os fios',
      icon: '💧',
      duration: '45min',
      products: [
        products.shampoo,
        products.conditioner || '',
        products.hydrationMask,
        products.leaveIn,
        products.finisher,
      ].filter(Boolean),
      steps: [
        'Molhe bem os cabelos com água morna',
        `Aplique ${products.shampoo} no couro cabeludo`,
        'Massageie suavemente por 2-3 minutos',
        'Enxágue completamente',
        ...(products.conditioner
          ? [
              `Aplique ${products.conditioner} no comprimento e pontas`,
              'Deixe agir por 2-3 minutos e enxágue',
            ]
          : []),
        `Aplique ${products.hydrationMask} do comprimento às pontas`,
        'Deixe agir por 20 minutos (use touca térmica)',
        'Enxágue com água fria',
        `Aplique ${products.leaveIn} nos fios úmidos`,
        `Finalize com ${products.finisher}`,
      ],
    };
  }

  // LAVAGEM COM NUTRIÇÃO
  if (type === 'wash' && scheduleType === 'N') {
    return {
      title: 'Lavagem + Nutrição',
      description: 'Dia de lavar e nutrir os fios com óleos e manteigas',
      icon: '🌿',
      duration: '45min',
      products: [
        products.shampoo,
        products.conditioner || '',
        products.nutritionMask,
        products.leaveIn,
        products.finisher,
      ].filter(Boolean),
      steps: [
        'Molhe bem os cabelos com água morna',
        `Aplique ${products.shampoo} no couro cabeludo`,
        'Massageie suavemente por 2-3 minutos',
        'Enxágue completamente',
        `Aplique ${products.nutritionMask} do comprimento às pontas`,
        'Deixe agir por 20-30 minutos (use touca térmica)',
        'Enxágue com água fria',
        `Aplique ${products.leaveIn} nos fios úmidos`,
        `Finalize com ${products.finisher}`,
      ],
    };
  }

  // LAVAGEM COM RECONSTRUÇÃO
  if (type === 'wash' && scheduleType === 'R') {
    return {
      title: 'Lavagem + Reconstrução',
      description: 'Dia de lavar e reconstruir a fibra capilar com proteínas',
      icon: '🔧',
      duration: '50min',
      products: [
        products.shampoo,
        products.reconstructionMask || '',
        products.hydrationMask, // Sempre hidratar após reconstrução
        products.leaveIn,
        products.finisher,
      ].filter(Boolean),
      steps: [
        'Molhe bem os cabelos com água morna',
        `Aplique ${products.shampoo} no couro cabeludo`,
        'Massageie suavemente por 2-3 minutos',
        'Enxágue completamente',
        `Aplique ${products.reconstructionMask || 'máscara de reconstrução'} do comprimento às pontas`,
        'Deixe agir por 15-20 minutos (use touca térmica)',
        'Enxágue com água morna',
        `Aplique ${products.hydrationMask} para selar (obrigatório!)`,
        'Deixe agir por 10 minutos e enxágue',
        `Aplique ${products.leaveIn} nos fios úmidos`,
        `Finalize com ${products.finisher}`,
      ],
    };
  }

  // CO-WASH (lavagem com condicionador)
  if (type === 'cowash') {
    return {
      title: 'Co-wash',
      description: 'Lavagem suave apenas com condicionador',
      icon: '🧴',
      duration: '20min',
      products: [products.cowash || products.conditioner || '', products.leaveIn, products.finisher].filter(
        Boolean
      ),
      steps: [
        'Molhe bem os cabelos com água morna',
        `Aplique ${products.cowash || products.conditioner} no couro cabeludo`,
        'Massageie o couro cabeludo por 3-5 minutos',
        'Distribua pelo comprimento',
        'Enxágue completamente',
        `Aplique ${products.leaveIn} nos fios úmidos`,
        `Finalize com ${products.finisher}`,
      ],
    };
  }

  // REFRESH (para cachos e ondas)
  if (type === 'refresh') {
    return {
      title: 'Refresh',
      description: 'Reavive seus cachos/ondas sem lavar',
      icon: '✨',
      duration: '10min',
      products: [products.refresh || '', products.finisher].filter(Boolean),
      steps: [
        'Umedeça os cabelos com água ou névoa',
        ...(products.refresh
          ? [`Aplique ${products.refresh} amassando os fios`]
          : [`Aplique ${products.leaveIn} diluído em água`]),
        'Amasse os fios de baixo para cima',
        `Finalize com ${products.finisher}`,
        'Deixe secar naturalmente ou com difusor',
      ],
    };
  }

  // DESCANSO
  return {
    title: 'Dia de Descanso',
    description: 'Deixe seu cabelo respirar hoje',
    icon: '😌',
    duration: '5min',
    products: [],
    steps: [
      'Não precisa lavar ou fazer nada especial hoje',
      'Apenas penteie suavemente se necessário',
      'Aproveite para dar um descanso aos fios',
    ],
  };
}

/**
 * Distribui as lavagens pela semana de forma inteligente
 */
function distributeWashDays(washDaysPerWeek: number, needsRefresh: boolean): RoutineType[] {
  const week: RoutineType[] = [];

  if (washDaysPerWeek === 1) {
    // Lava 1x por semana: Segunda (com refresh nos outros dias se necessário)
    week.push('wash');
    for (let i = 1; i < 7; i++) {
      week.push(needsRefresh ? 'refresh' : 'rest');
    }
  } else if (washDaysPerWeek === 2) {
    // Lava 2x por semana: Segunda e Quinta
    week.push('wash', 'refresh', 'rest', 'wash', 'refresh', 'rest', 'rest');
    if (!needsRefresh) {
      week[1] = 'rest';
      week[4] = 'rest';
    }
  } else if (washDaysPerWeek === 3) {
    // Lava 3x por semana: Segunda, Quarta, Sexta
    week.push('wash', 'rest', 'wash', 'rest', 'wash', 'rest', 'rest');
    if (needsRefresh) {
      week[1] = 'refresh';
      week[3] = 'refresh';
    }
  } else if (washDaysPerWeek >= 4) {
    // Lava 4x por semana: Segunda, Terça, Quinta, Sábado
    week.push('wash', 'wash', 'rest', 'wash', 'rest', 'wash', 'rest');
  } else {
    // Fallback: preenche com rest
    for (let i = 0; i < 7; i++) {
      week.push('rest');
    }
  }

  return week;
}

/**
 * Gera o calendário semanal completo
 */
export function generateWeeklyCalendar(
  profile: HairProfile,
  weekNumber: 1 | 2 | 3,
  startDate?: Date
): WeeklyCalendar {
  const start = startDate || new Date();

  // Pega o cronograma da semana específica
  const weekSchedule = profile.capillarySchedule[`week${weekNumber}` as 'week1' | 'week2' | 'week3'];

  // Distribui os tipos de rotina pela semana
  const routineTypes = distributeWashDays(profile.washDaysPerWeek, profile.needsRefresh);

  // Constrói o calendário dia a dia
  const days: Record<DayOfWeek, DayRoutine> = {} as Record<DayOfWeek, DayRoutine>;

  let washIndex = 0; // Índice para pegar o tipo correto do cronograma (H, N, R)

  DAYS_ORDER.forEach((dayName, index) => {
    const routineType = routineTypes[index];
    let scheduleType: ScheduleType | undefined;

    // Se for lavagem, pega o tipo do cronograma (H, N, R)
    if (routineType === 'wash' && washIndex < weekSchedule.length) {
      scheduleType = weekSchedule[washIndex];
      washIndex++;
    }

    // Constrói os detalhes da rotina do dia
    const routineDetails = buildRoutineDetails(routineType, scheduleType, profile);

    days[dayName] = {
      type: routineType,
      scheduleType,
      ...routineDetails,
    };
  });

  return {
    weekNumber,
    startDate: start,
    days,
  };
}

/**
 * Obtém a rotina do dia atual
 */
export function getTodayRoutine(calendar: WeeklyCalendar): DayRoutine {
  const today = new Date().getDay(); // 0 = domingo, 1 = segunda, ...
  const dayIndex = today === 0 ? 6 : today - 1; // Converte para nosso formato (0 = segunda)
  const dayName = DAYS_ORDER[dayIndex];
  return calendar.days[dayName];
}

/**
 * Avança para a próxima semana do ciclo
 */
export function getNextWeekNumber(currentWeek: 1 | 2 | 3): 1 | 2 | 3 {
  return ((currentWeek % 3) + 1) as 1 | 2 | 3;
}

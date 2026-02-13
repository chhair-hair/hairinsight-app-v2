// Sistema de calendário de rotina dinâmico
// Define quais dias da semana têm rotina programada

export interface RoutineScheduleDay {
  dayOfWeek: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  routineType: 'morning' | 'night' | 'full' | 'intensive' | 'quick';
  label: string;
  description: string;
}

export interface TodayRoutineStatus {
  hasRoutine: boolean;
  routineType?: 'morning' | 'night' | 'full' | 'intensive' | 'quick';
  label?: string;
  description?: string;
  dayName: string;
  nextRoutineDate?: Date;
  nextRoutineDayName?: string;
}

// Configuração padrão do calendário (3x por semana)
// Segunda, Quarta e Sexta: Rotina completa
export const DEFAULT_ROUTINE_SCHEDULE: RoutineScheduleDay[] = [
  {
    dayOfWeek: 1, // Segunda-feira
    routineType: 'full',
    label: 'Rotina Completa',
    description: 'Lavagem, hidratação e finalização completa',
  },
  {
    dayOfWeek: 3, // Quarta-feira
    routineType: 'full',
    label: 'Rotina Completa',
    description: 'Lavagem, hidratação e finalização completa',
  },
  {
    dayOfWeek: 5, // Sexta-feira
    routineType: 'full',
    label: 'Rotina Completa',
    description: 'Lavagem, hidratação e finalização completa',
  },
];

// Calendário alternativo intensivo (5x por semana)
export const INTENSIVE_ROUTINE_SCHEDULE: RoutineScheduleDay[] = [
  {
    dayOfWeek: 1, // Segunda
    routineType: 'full',
    label: 'Rotina Completa',
    description: 'Lavagem completa com tratamento',
  },
  {
    dayOfWeek: 2, // Terça
    routineType: 'quick',
    label: 'Hidratação Rápida',
    description: 'Co-wash e leave-in',
  },
  {
    dayOfWeek: 3, // Quarta
    routineType: 'full',
    label: 'Rotina Completa',
    description: 'Lavagem completa com tratamento',
  },
  {
    dayOfWeek: 4, // Quinta
    routineType: 'quick',
    label: 'Hidratação Rápida',
    description: 'Co-wash e leave-in',
  },
  {
    dayOfWeek: 5, // Sexta
    routineType: 'full',
    label: 'Rotina Completa',
    description: 'Lavagem completa com tratamento',
  },
  {
    dayOfWeek: 6, // Sábado
    routineType: 'intensive',
    label: 'Tratamento Intensivo',
    description: 'Máscara intensiva e reconstrução',
  },
];

const DAY_NAMES = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

/**
 * Obtém o status da rotina para o dia de hoje
 */
export function getTodayRoutineStatus(
  schedule: RoutineScheduleDay[] = DEFAULT_ROUTINE_SCHEDULE
): TodayRoutineStatus {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayName = DAY_NAMES[dayOfWeek];

  // Procura se hoje tem rotina programada
  const todayRoutine = schedule.find((day) => day.dayOfWeek === dayOfWeek);

  if (todayRoutine) {
    return {
      hasRoutine: true,
      routineType: todayRoutine.routineType,
      label: todayRoutine.label,
      description: todayRoutine.description,
      dayName,
    };
  }

  // Se não tem rotina hoje, calcula a próxima
  const nextRoutine = findNextRoutineDay(schedule, today);

  return {
    hasRoutine: false,
    dayName,
    nextRoutineDate: nextRoutine.date,
    nextRoutineDayName: nextRoutine.dayName,
  };
}

/**
 * Encontra o próximo dia com rotina programada
 */
function findNextRoutineDay(
  schedule: RoutineScheduleDay[],
  fromDate: Date = new Date()
): { date: Date; dayName: string } {
  const currentDayOfWeek = fromDate.getDay();

  // Ordena os dias da semana que têm rotina
  const scheduledDays = schedule.map((s) => s.dayOfWeek).sort((a, b) => a - b);

  // Procura o próximo dia após hoje
  let nextDay = scheduledDays.find((day) => day > currentDayOfWeek);

  // Se não encontrou, pega o primeiro dia da semana (próxima semana)
  if (nextDay === undefined) {
    nextDay = scheduledDays[0];
  }

  // Calcula quantos dias faltam
  let daysUntilNext = 0;
  if (nextDay > currentDayOfWeek) {
    daysUntilNext = nextDay - currentDayOfWeek;
  } else {
    // Próxima semana
    daysUntilNext = 7 - currentDayOfWeek + nextDay;
  }

  const nextDate = new Date(fromDate);
  nextDate.setDate(nextDate.getDate() + daysUntilNext);

  return {
    date: nextDate,
    dayName: DAY_NAMES[nextDay],
  };
}

/**
 * Verifica se uma data específica tem rotina programada
 */
export function hasRoutineOnDate(
  date: Date,
  schedule: RoutineScheduleDay[] = DEFAULT_ROUTINE_SCHEDULE
): boolean {
  const dayOfWeek = date.getDay();
  return schedule.some((day) => day.dayOfWeek === dayOfWeek);
}

/**
 * Obtém a rotina programada para uma data específica
 */
export function getRoutineForDate(
  date: Date,
  schedule: RoutineScheduleDay[] = DEFAULT_ROUTINE_SCHEDULE
): RoutineScheduleDay | null {
  const dayOfWeek = date.getDay();
  return schedule.find((day) => day.dayOfWeek === dayOfWeek) || null;
}

/**
 * Obtém todos os dias do mês atual com rotina
 */
export function getRoutineDaysInMonth(
  year: number,
  month: number,
  schedule: RoutineScheduleDay[] = DEFAULT_ROUTINE_SCHEDULE
): Date[] {
  const routineDays: Date[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (hasRoutineOnDate(date, schedule)) {
      routineDays.push(date);
    }
  }

  return routineDays;
}

/**
 * Formata uma data para exibição amigável
 */
export function formatNextRoutineDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Remove horas para comparar apenas datas
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'hoje';
  } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
    return 'amanhã';
  } else {
    // Calcula quantos dias faltam
    const diffTime = dateOnly.getTime() - todayOnly.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return `em ${diffDays} dias`;
    } else {
      return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    }
  }
}

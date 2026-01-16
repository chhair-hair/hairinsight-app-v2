// Types para HairInsight

export type Gender = 'feminino' | 'masculino';

export interface User {
  id: string;
  name: string;
  gender: Gender;
  hairType?: string;
  skinType?: string;
  createdAt: Date;
}

export interface HairAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  analysis: {
    hairType: string;
    condition: string;
    recommendations: string[];
    faceShape?: string;
  };
  createdAt: Date;
}

export interface CareSchedule {
  id: string;
  userId: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  nextDate: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

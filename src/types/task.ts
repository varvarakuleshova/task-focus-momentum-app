export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  scheduledDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskStats {
  totalCompleted: number;
  completedToday: number;
  inBacklog: number;
  dailyLimit: number;
}
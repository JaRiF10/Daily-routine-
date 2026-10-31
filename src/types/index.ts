export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Status = 'backlog' | 'in_progress' | 'in_review' | 'done';

export type ViewMode = 'today' | 'matrix' | 'kanban' | 'schedule' | 'flow' | 'insights';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  projectId: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // e.g. "14:00"
  isToday: boolean;
  timeSlot?: 'morning' | 'afternoon' | 'evening';
  subtasks: Subtask[];
  estimatedPoms: number;
  completedPoms: number;
  createdAt: string;
  completedAt?: string;
  tags: string[];
}

export interface Project {
  id: string;
  name: string;
  color: string; // hex
  iconName: string;
  description?: string;
}

export interface FlowSessionSettings {
  focusDurationMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  soundType: 'none' | 'rain' | 'whitenoise' | 'waves' | 'breeze';
  volume: number; // 0 to 1
}

export interface DayCapacity {
  date: string; // YYYY-MM-DD
  dayLabel: string;
  dayNumber: number;
  isToday: boolean;
  maxHours: number;
}

export type TaskPriority = 'baixa' | 'media' | 'alta';

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: TaskPriority;
  completed: boolean;
}
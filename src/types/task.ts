export type TaskPriority = 'baixa' | 'media' | 'alta';
export type TaskStatus = 'backlog' | 'desenvolvimento' | 'revisao' | 'concluido';

export interface Task {
  id: string;
  issue: number;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  project: string;
  projectKey: string;
  assignee: string;
  gitlabUrl: string;
  completed: boolean;
}
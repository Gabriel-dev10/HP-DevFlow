import { createContext, useContext, useMemo, useState } from 'react';

import { tasks as initialTasks } from './tasks';
import { Task, TaskPriority } from '../types/task';

type NewTask = {
  title: string;
  description: string;
  date: string;
  priority: TaskPriority;
};

type TaskContextValue = {
  tasks: Task[];
  addTask: (task: NewTask) => void;
  toggleTask: (taskId: string) => void;
  getTask: (taskId: string) => Task | undefined;
};

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function addTask(task: NewTask) {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        ...task,
        id: String(Date.now()),
        completed: false,
      },
    ]);
  }

  function toggleTask(taskId: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task,
      ),
    );
  }

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      toggleTask,
      getTask: (taskId: string) =>
        tasks.find((task) => task.id === taskId),
    }),
    [tasks],
  );

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTasks must be used inside TaskProvider');
  }

  return context;
}

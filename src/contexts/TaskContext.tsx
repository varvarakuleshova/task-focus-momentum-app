import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TaskStats } from '@/types/task';

interface TaskState {
  tasks: Task[];
  dailyLimit: number;
  stats: TaskStats;
}

type TaskAction =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'TOGGLE_TASK'; id: string }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'UPDATE_TASK'; id: string; updates: Partial<Task> }
  | { type: 'SET_DAILY_LIMIT'; limit: number }
  | { type: 'LOAD_TASKS'; tasks: Task[] };

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  addTask: (title: string, description?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setDailyLimit: (limit: number) => void;
  getTodayTasks: () => Task[];
  getBacklogTasks: () => Task[];
  getCompletedTasks: () => Task[];
} | null>(null);

function calculateStats(tasks: Task[], dailyLimit: number): TaskStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const totalCompleted = tasks.filter(task => task.completed).length;
  const completedToday = tasks.filter(task => 
    task.completed && 
    task.completedAt && 
    new Date(task.completedAt).toDateString() === today.toDateString()
  ).length;
  const inBacklog = tasks.filter(task => 
    !task.completed && 
    (!task.scheduledDate || new Date(task.scheduledDate) < today)
  ).length;

  return {
    totalCompleted,
    completedToday,
    inBacklog,
    dailyLimit
  };
}

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  let newTasks: Task[];
  
  switch (action.type) {
    case 'ADD_TASK':
      newTasks = [...state.tasks, action.task];
      break;
    case 'TOGGLE_TASK':
      newTasks = state.tasks.map(task =>
        task.id === action.id
          ? { 
              ...task, 
              completed: !task.completed, 
              completedAt: !task.completed ? new Date() : undefined 
            }
          : task
      );
      break;
    case 'DELETE_TASK':
      newTasks = state.tasks.filter(task => task.id !== action.id);
      break;
    case 'UPDATE_TASK':
      newTasks = state.tasks.map(task =>
        task.id === action.id ? { ...task, ...action.updates } : task
      );
      break;
    case 'SET_DAILY_LIMIT':
      return {
        ...state,
        dailyLimit: action.limit,
        stats: calculateStats(state.tasks, action.limit)
      };
    case 'LOAD_TASKS':
      newTasks = action.tasks;
      break;
    default:
      return state;
  }

  const newStats = calculateStats(newTasks, state.dailyLimit);
  
  return {
    ...state,
    tasks: newTasks,
    stats: newStats
  };
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, {
    tasks: [],
    dailyLimit: 4,
    stats: { totalCompleted: 0, completedToday: 0, inBacklog: 0, dailyLimit: 4 }
  });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('totitodo-tasks');
    if (saved) {
      try {
        const tasks = JSON.parse(saved).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          scheduledDate: task.scheduledDate ? new Date(task.scheduledDate) : undefined
        }));
        dispatch({ type: 'LOAD_TASKS', tasks });
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    }

    const savedLimit = localStorage.getItem('totitodo-daily-limit');
    if (savedLimit) {
      dispatch({ type: 'SET_DAILY_LIMIT', limit: parseInt(savedLimit, 10) });
    }
  }, []);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('totitodo-tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  // Save daily limit to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('totitodo-daily-limit', state.dailyLimit.toString());
  }, [state.dailyLimit]);

  const addTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: new Date(),
      scheduledDate: new Date() // Default to today
    };
    dispatch({ type: 'ADD_TASK', task: newTask });
  };

  const toggleTask = (id: string) => {
    dispatch({ type: 'TOGGLE_TASK', id });
  };

  const deleteTask = (id: string) => {
    dispatch({ type: 'DELETE_TASK', id });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch({ type: 'UPDATE_TASK', id, updates });
  };

  const setDailyLimit = (limit: number) => {
    dispatch({ type: 'SET_DAILY_LIMIT', limit });
  };

  const getTodayTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return state.tasks.filter(task => 
      !task.completed && 
      task.scheduledDate && 
      new Date(task.scheduledDate) >= today && 
      new Date(task.scheduledDate) < tomorrow
    );
  };

  const getBacklogTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return state.tasks.filter(task => 
      !task.completed && 
      (!task.scheduledDate || new Date(task.scheduledDate) < today)
    );
  };

  const getCompletedTasks = () => {
    return state.tasks.filter(task => task.completed);
  };

  return (
    <TaskContext.Provider value={{
      state,
      dispatch,
      addTask,
      toggleTask,
      deleteTask,
      updateTask,
      setDailyLimit,
      getTodayTasks,
      getBacklogTasks,
      getCompletedTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
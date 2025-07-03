import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TodayView() {
  const { state, getTodayTasks } = useTaskContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const todayTasks = getTodayTasks();
  const completedTasks = todayTasks.filter(task => task.completed);
  const incompleteTasks = todayTasks.filter(task => !task.completed);
  const progress = todayTasks.length > 0 ? (completedTasks.length / todayTasks.length) * 100 : 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 md:space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Сегодня
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Counter */}
        <div className="text-center">
          <span className="text-lg font-medium text-muted-foreground">
            {completedTasks.length} / {state.dailyLimit}
          </span>
        </div>
      </div>

      {/* Add Task Section */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
        {showAddForm ? (
          <AddTaskForm onCancel={() => setShowAddForm(false)} />
        ) : (
          <Button
            variant="floating"
            onClick={() => setShowAddForm(true)}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            disabled={todayTasks.length >= state.dailyLimit}
          >
            <Plus className="h-4 w-4" />
            {todayTasks.length >= state.dailyLimit 
              ? `Достигнут лимит (${state.dailyLimit} задач)`
              : 'Добавить новую задачу'
            }
          </Button>
        )}
      </div>

      {/* Today's Tasks */}
      <div className="space-y-4">
        {/* Incomplete Tasks */}
        {incompleteTasks.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">
              К выполнению ({incompleteTasks.length})
            </h2>
            <div className="space-y-2">
              {incompleteTasks.map((task, index) => (
                <TaskItem 
                  key={task.id} 
                  task={task}
                  className={cn(
                    "animate-slide-down",
                    `animation-delay-${index * 100}`
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-success">
              Выполнено ({completedTasks.length})
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task, index) => (
                <TaskItem 
                  key={task.id} 
                  task={task}
                  showActions={false}
                  className="animate-scale-in"
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Daily Limit Warning */}
      {todayTasks.length >= state.dailyLimit && incompleteTasks.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-center">
          <p className="text-sm text-warning-foreground">
            Достигнут дневной лимит задач. Сосредоточьтесь на выполнении текущих задач!
          </p>
        </div>
      )}
    </div>
  );
}
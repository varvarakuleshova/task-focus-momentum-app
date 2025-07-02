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

        {/* Progress */}
        <div className="max-w-xs md:max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Прогресс</span>
            <span className="font-medium">
              {completedTasks.length} / {state.dailyLimit}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-center gap-3 md:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span className="hidden sm:inline">Лимит:</span> {state.dailyLimit}
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span className="hidden sm:inline">Выполнено:</span> {completedTasks.length}
            </div>
          </div>
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

        {/* Empty State */}
        {todayTasks.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
              <Target className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Никаких задач</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Отлично! У вас пока нет задач на сегодня. Добавьте новую задачу, чтобы начать работу.
              </p>
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
import React from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskItem } from './TaskItem';
import { Button } from '@/components/ui/button';
import { Archive, Calendar, ArrowRight } from 'lucide-react';

export function BacklogView() {
  const { getBacklogTasks, updateTask, getTodayTasks, state } = useTaskContext();
  const backlogTasks = getBacklogTasks();
  const todayTasks = getTodayTasks();

  const moveToToday = (taskId: string) => {
    if (todayTasks.length < state.dailyLimit) {
      updateTask(taskId, { scheduledDate: new Date() });
    }
  };

  const canMoveToToday = todayTasks.length < state.dailyLimit;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Бэклог</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Отложенные и просроченные задачи ({backlogTasks.length})
        </p>
      </div>

      {/* Backlog Tasks */}
      <div className="space-y-3 md:space-y-4">
        {backlogTasks.length > 0 ? (
          <div className="space-y-2">
            {backlogTasks.map((task, index) => (
              <div key={task.id} className="group relative">
                <TaskItem 
                  task={task}
                  className="animate-slide-down pr-12 md:pr-20"
                />
                <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveToToday(task.id)}
                    disabled={!canMoveToToday}
                    className="h-9 w-9 md:h-8 md:w-8 p-0 text-primary hover:bg-primary/10"
                    title={canMoveToToday ? "Перенести на сегодня" : "Достигнут лимит задач на сегодня"}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-full flex items-center justify-center">
              <Archive className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Бэклог пуст</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Отлично! У вас нет отложенных задач. Все задачи либо выполнены, либо запланированы.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      {!canMoveToToday && backlogTasks.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-center">
          <p className="text-sm text-warning-foreground">
            Достигнут лимит задач на сегодня ({state.dailyLimit}). Завершите текущие задачи, чтобы добавить новые.
          </p>
        </div>
      )}
    </div>
  );
}
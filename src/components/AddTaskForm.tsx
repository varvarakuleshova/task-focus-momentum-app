import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTaskContext } from '@/contexts/TaskContext';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  onCancel?: () => void;
  className?: string;
}

export function AddTaskForm({ onCancel, className }: AddTaskFormProps) {
  const { addTask, getTodayTasks, state } = useTaskContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const todayTasks = getTodayTasks();
  const canAddTask = todayTasks.length < state.dailyLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && canAddTask) {
      addTask(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      setIsExpanded(false);
      onCancel?.();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsExpanded(false);
    onCancel?.();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={canAddTask ? "Что нужно сделать?" : `Достигнут лимит (${state.dailyLimit} задач)`}
          disabled={!canAddTask}
          className="transition-all duration-200 focus:border-primary focus:shadow-soft h-12 md:h-10 text-base md:text-sm"
          autoFocus
        />
        
        {isExpanded && (
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Описание (необязательно)"
            className="min-h-20 transition-all duration-200 focus:border-primary animate-slide-down text-base md:text-sm"
            disabled={!canAddTask}
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Button
          type="submit"
          size="sm"
          disabled={!title.trim() || !canAddTask}
          className="flex-shrink-0 h-12 sm:h-9 text-base sm:text-sm"
        >
          <Plus className="h-4 w-4" />
          Добавить
        </Button>
        
        <div className="flex gap-2">
          {!isExpanded && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(true)}
              disabled={!canAddTask}
              className="flex-1 sm:flex-initial h-12 sm:h-9 text-base sm:text-sm"
            >
              Добавить описание
            </Button>
          )}
          
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="flex-shrink-0 h-12 sm:h-9 w-12 sm:w-9 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {!canAddTask && (
        <p className="text-xs text-warning animate-slide-down px-2">
          Достигнут дневной лимит задач. Завершите существующие задачи или увеличьте лимит в настройках.
        </p>
      )}
    </form>
  );
}
import React, { useState } from 'react';
import { Task } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { useTaskContext } from '@/contexts/TaskContext';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  showActions?: boolean;
  className?: string;
}

export function TaskItem({ task, showActions = true, className }: TaskItemProps) {
  const { toggleTask, deleteTask, updateTask } = useTaskContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className={cn(
      "group flex items-center gap-3 p-4 bg-card rounded-lg border border-border transition-all duration-200 hover:shadow-card hover:border-primary/20",
      task.completed && "opacity-60 bg-success-light border-success/20",
      className
    )}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className="flex-shrink-0 data-[state=checked]:bg-success data-[state=checked]:border-success"
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSaveEdit}
            className="text-sm border-primary/30 focus:border-primary"
            autoFocus
          />
        ) : (
          <div className="space-y-1">
            <p className={cn(
              "text-sm font-medium transition-all duration-200",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>
        )}
      </div>

      {showActions && !task.completed && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveEdit}
                className="h-8 w-8 p-0 text-success hover:bg-success/10"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => deleteTask(task.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
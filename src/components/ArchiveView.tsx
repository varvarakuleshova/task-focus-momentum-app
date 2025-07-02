import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { TaskItem } from './TaskItem';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Search, Trophy } from 'lucide-react';

export function ArchiveView() {
  const { getCompletedTasks } = useTaskContext();
  const [searchQuery, setSearchQuery] = useState('');
  const completedTasks = getCompletedTasks();
  
  const filteredTasks = completedTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tasksThisWeek = completedTasks.filter(task => {
    if (!task.completedAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(task.completedAt) >= weekAgo;
  }).length;

  const tasksThisMonth = completedTasks.filter(task => {
    if (!task.completedAt) return false;
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(task.completedAt) >= monthAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Архив</h1>
        <p className="text-muted-foreground">
          История выполненных задач
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">{completedTasks.length}</div>
            <div className="text-muted-foreground">Всего</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{tasksThisWeek}</div>
            <div className="text-muted-foreground">За неделю</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{tasksThisMonth}</div>
            <div className="text-muted-foreground">За месяц</div>
          </div>
        </div>
      </div>

      {/* Search */}
      {completedTasks.length > 0 && (
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск в архиве..."
            className="pl-10"
          />
        </div>
      )}

      {/* Completed Tasks */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          <div className="space-y-2">
            {filteredTasks
              .sort((a, b) => {
                if (!a.completedAt || !b.completedAt) return 0;
                return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
              })
              .map((task, index) => (
                <div key={task.id} className="space-y-1">
                  <TaskItem 
                    task={task}
                    showActions={false}
                    className="animate-slide-down"
                  />
                  {task.completedAt && (
                    <p className="text-xs text-muted-foreground pl-10">
                      Выполнено: {new Date(task.completedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              ))}
          </div>
        ) : completedTasks.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-success rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Архив пуст</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Выполните несколько задач, чтобы увидеть их здесь. Ваши достижения будут сохранены в архиве.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-2">
            <Search className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              Ничего не найдено по запросу "{searchQuery}"
            </p>
          </div>
        )}
      </div>

      {/* Achievement Badge */}
      {completedTasks.length >= 10 && (
        <div className="bg-gradient-accent rounded-lg p-4 text-center">
          <Trophy className="h-8 w-8 mx-auto text-white mb-2" />
          <p className="text-white font-medium">
            Поздравляем! Вы выполнили {completedTasks.length} задач!
          </p>
        </div>
      )}
    </div>
  );
}
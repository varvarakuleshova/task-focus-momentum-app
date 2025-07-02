import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTaskContext } from '@/contexts/TaskContext';
import { Calendar, Archive, Settings, Target, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { state, getTodayTasks, getBacklogTasks, getCompletedTasks } = useTaskContext();
  
  const todayTasks = getTodayTasks();
  const backlogTasks = getBacklogTasks();
  const completedTasks = getCompletedTasks();

  const navItems = [
    {
      id: 'today',
      label: 'Сегодня',
      icon: Target,
      badge: todayTasks.filter(task => !task.completed).length,
      badgeVariant: 'default' as const
    },
    {
      id: 'backlog',
      label: 'Бэклог',
      icon: Calendar,
      badge: backlogTasks.length,
      badgeVariant: 'secondary' as const
    },
    {
      id: 'archive',
      label: 'Архив',
      icon: Archive,
      badge: completedTasks.length,
      badgeVariant: 'outline' as const
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:relative md:bottom-auto bg-white/90 backdrop-blur-sm border-t md:border-t-0 md:bg-transparent md:backdrop-blur-none">
      <div className="flex justify-center p-2 md:p-0">
        <div className="flex w-full max-w-sm md:max-w-none bg-card border border-border rounded-none md:rounded-full md:p-1 shadow-card">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "relative flex-1 md:flex-initial rounded-none md:rounded-full px-2 md:px-4 py-3 md:py-2 transition-all duration-200 flex flex-col md:flex-row items-center gap-1 md:gap-2",
                  isActive && "shadow-soft md:scale-105"
                )}
              >
                <Icon className="h-5 w-5 md:h-4 md:w-4" />
                <span className="text-xs md:text-sm md:hidden lg:inline">
                  {item.label}
                </span>
                {item.badge !== null && item.badge > 0 && (
                  <Badge
                    variant={item.badgeVariant}
                    className="absolute -top-1 -right-1 md:relative md:top-auto md:right-auto md:ml-2 h-4 min-w-4 md:h-5 md:min-w-5 text-xs px-1 md:px-1.5 animate-scale-in"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
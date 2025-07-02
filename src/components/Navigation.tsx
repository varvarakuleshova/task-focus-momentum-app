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
    <nav className="flex justify-center">
      <div className="flex bg-card border border-border rounded-full p-1 shadow-card">
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
                "relative rounded-full px-4 py-2 transition-all duration-200",
                isActive && "shadow-soft scale-105"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">{item.label}</span>
              {item.badge !== null && item.badge > 0 && (
                <Badge
                  variant={item.badgeVariant}
                  className="ml-2 h-5 min-w-5 text-xs px-1.5 animate-scale-in"
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
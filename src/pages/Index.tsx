import React, { useState } from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { TodayView } from '@/components/TodayView';
import { BacklogView } from '@/components/BacklogView';
import { ArchiveView } from '@/components/ArchiveView';
import { SettingsView } from '@/components/SettingsView';
import { Navigation } from '@/components/Navigation';

const Index = () => {
  const [currentView, setCurrentView] = useState('today');

  const renderView = () => {
    switch (currentView) {
      case 'today':
        return <TodayView />;
      case 'backlog':
        return <BacklogView />;
      case 'archive':
        return <ArchiveView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Totitodo
            </h1>
            <p className="text-sm md:text-base text-muted-foreground px-4">
              Фокусируйтесь на главном. Делайте меньше, достигайте больше.
            </p>
          </div>

          {/* Navigation - Desktop */}
          <div className="mb-6 md:mb-8 hidden md:block">
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
          </div>

          {/* Main Content */}
          <main className="animate-slide-down px-2 md:px-0">
            {renderView()}
          </main>

          {/* Navigation - Mobile (Fixed Bottom) */}
          <div className="md:hidden">
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </div>
      </div>
    </TaskProvider>
  );
};

export default Index;

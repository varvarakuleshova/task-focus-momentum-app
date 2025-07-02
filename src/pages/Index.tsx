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
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Totitodo
            </h1>
            <p className="text-muted-foreground">
              Фокусируйтесь на главном. Делайте меньше, достигайте больше.
            </p>
          </div>

          {/* Navigation */}
          <div className="mb-8">
            <Navigation currentView={currentView} onViewChange={setCurrentView} />
          </div>

          {/* Main Content */}
          <main className="animate-slide-down">
            {renderView()}
          </main>
        </div>
      </div>
    </TaskProvider>
  );
};

export default Index;

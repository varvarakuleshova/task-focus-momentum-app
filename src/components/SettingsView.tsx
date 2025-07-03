import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Target, Download, Trash2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SettingsView() {
  const { state, setDailyLimit } = useTaskContext();
  const { toast } = useToast();
  const [tempLimit, setTempLimit] = useState(state.dailyLimit);

  const handleSaveDailyLimit = () => {
    if (tempLimit >= 1 && tempLimit <= 20) {
      setDailyLimit(tempLimit);
      toast({
        title: "Настройки сохранены",
        description: `Дневной лимит изменён на ${tempLimit} задач.`,
      });
    }
  };

  const handleExportData = () => {
    const data = {
      tasks: state.tasks,
      dailyLimit: state.dailyLimit,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `totitodo-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Данные экспортированы",
      description: "Резервная копия успешно сохранена.",
    });
  };

  const handleClearData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('totitodo-tasks');
      localStorage.removeItem('totitodo-daily-limit');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Настройки</h1>
        <p className="text-sm md:text-base text-muted-foreground">Персонализируйте своё приложение</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-3 md:space-y-4">
        {/* Daily Limit Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Дневной лимит задач
            </CardTitle>
            <CardDescription>
              Количество задач, которые вы планируете выполнить за день
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="daily-limit">Количество задач</Label>
                <Input
                  id="daily-limit"
                  type="number"
                  min="1"
                  max="20"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(Number(e.target.value))}
                  className="max-w-24"
                />
              </div>
              <Button 
                onClick={handleSaveDailyLimit}
                disabled={tempLimit === state.dailyLimit || tempLimit < 1 || tempLimit > 20}
              >
                Сохранить
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              Рекомендуется: 3-6 задач для лучшего фокуса
            </div>

            <div className="flex gap-2">
              {[3, 4, 5, 6].map(num => (
                <Badge
                  key={num}
                  variant={tempLimit === num ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => setTempLimit(num)}
                >
                  {num}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>


        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Управление данными</CardTitle>
            <CardDescription>
              Экспорт и удаление ваших данных
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start"
            >
              <Download className="h-4 w-4" />
              Экспортировать данные
            </Button>
            
            <Button
              variant="destructive"
              onClick={handleClearData}
              className="w-full justify-start"
            >
              <Trash2 className="h-4 w-4" />
              Очистить все данные
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle>О приложении</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Totitodo</strong> - приложение для фокусированного управления задачами</p>
              <p>Версия: 1.0.0</p>
              <p>Ограничивайте количество задач в день для лучшей продуктивности</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
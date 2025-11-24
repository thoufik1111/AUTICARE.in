import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TaskTheme = 'morning' | 'afternoon' | 'evening' | 'night';

interface TaskCardProps {
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  theme: TaskTheme;
  parentTip?: string;
  accentColor: string;
  showParentTip?: boolean;
}

const themeStyles: Record<TaskTheme, { bg: string; icon: string }> = {
  morning: {
    bg: 'bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-50 dark:from-orange-950/40 dark:via-yellow-950/20 dark:to-pink-950/20',
    icon: '🌅',
  },
  afternoon: {
    bg: 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50 dark:from-yellow-950/40 dark:via-amber-950/20 dark:to-orange-950/20',
    icon: '☀️',
  },
  evening: {
    bg: 'bg-gradient-to-br from-purple-100 via-pink-50 to-orange-50 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-orange-950/20',
    icon: '🌅',
  },
  night: {
    bg: 'bg-gradient-to-br from-indigo-900/80 via-purple-900/60 to-blue-900/80 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950',
    icon: '🌙',
  },
};

const themeDecorations: Record<TaskTheme, JSX.Element> = {
  morning: (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-2 right-2 text-4xl opacity-70">🌤️</div>
      <div className="absolute bottom-2 left-2 text-2xl opacity-50">🌸</div>
    </div>
  ),
  afternoon: (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-2 right-2 text-5xl opacity-80">☀️</div>
      <div className="absolute bottom-2 left-2 text-3xl opacity-60">🍎</div>
      <div className="absolute bottom-2 right-2 text-2xl opacity-50">🥗</div>
    </div>
  ),
  evening: (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-2 right-2 text-4xl opacity-70">🌆</div>
      <div className="absolute bottom-2 left-2 text-2xl opacity-60">🌳</div>
      <div className="absolute top-1/2 right-4 text-xl opacity-40">🦋</div>
    </div>
  ),
  night: (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-2 right-2 text-4xl opacity-90">🌙</div>
      <div className="absolute top-4 left-4 text-xl opacity-70">⭐</div>
      <div className="absolute bottom-4 right-8 text-lg opacity-60">✨</div>
      <div className="absolute top-1/2 left-1/4 text-sm opacity-50">⭐</div>
      <div className="absolute bottom-8 left-8 text-base opacity-60">✨</div>
    </div>
  ),
};

export default function TaskCard({
  title,
  description,
  duration,
  completed,
  theme,
  parentTip,
  accentColor,
  showParentTip = false,
}: TaskCardProps) {
  const styles = themeStyles[theme];
  const isNightTheme = theme === 'night';

  return (
    <Card className={cn(
      'relative p-4 border-l-4 hover:shadow-lg overflow-hidden',
      styles.bg,
      `border-l-${accentColor}`,
      isNightTheme && 'text-white'
    )}>
      {themeDecorations[theme]}
      
      <div className="relative z-10 flex items-start gap-3">
        {completed ? (
          <CheckCircle2 className={cn('w-5 h-5 flex-shrink-0', `text-${accentColor}`)} />
        ) : (
          <Circle className={cn(
            'w-5 h-5 flex-shrink-0',
            isNightTheme ? 'text-white/70' : 'text-muted-foreground'
          )} />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn(
              'font-semibold',
              isNightTheme ? 'text-white' : 'text-foreground'
            )}>
              {title}
            </h4>
            <div className={cn(
              'flex items-center gap-2 text-sm',
              isNightTheme ? 'text-white/80' : 'text-muted-foreground'
            )}>
              <Clock className="w-4 h-4" />
              {duration}
            </div>
          </div>
          <p className={cn(
            'text-sm',
            isNightTheme ? 'text-white/90' : 'text-muted-foreground'
          )}>
            {description}
          </p>
          {showParentTip && parentTip && (
            <p className={cn(
              'text-sm mt-2 font-medium',
              isNightTheme ? 'text-yellow-300' : 'text-primary'
            )}>
              💡 {parentTip}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

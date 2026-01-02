import { TestTube, Heart, Pill, Utensils, Activity } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

interface Recommendation {
  type: 'test' | 'lifestyle' | 'prevention' | 'diet';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const iconMap = {
  test: TestTube,
  lifestyle: Activity,
  prevention: Pill,
  diet: Utensils,
};

export const Recommendations = ({ recommendations }: RecommendationsProps) => {
  const { t } = useLanguage();

  const typeLabels = {
    test: t.recommendations.types.test,
    lifestyle: t.recommendations.types.lifestyle,
    prevention: t.recommendations.types.prevention,
    diet: t.recommendations.types.diet,
  };

  const priorityLabels = {
    high: t.recommendations.priority.high,
    medium: t.recommendations.priority.medium,
    low: t.recommendations.priority.low,
  } as const;

  if (recommendations.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px] text-center">
        <Heart className="w-12 h-12 text-primary/50 mb-4" />
        <h3 className="font-display text-lg font-semibold mb-2">{t.recommendations.title}</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          {t.recommendations.noRecommendations}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-lg">{t.recommendations.title}</h3>
      </div>

      <div className="grid gap-3">
        {recommendations.map((rec, index) => {
          const Icon = iconMap[rec.type];
          return (
            <div
              key={index}
              className="glass-effect rounded-xl p-4 animate-fade-in-up hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  p-2 rounded-lg shrink-0
                  ${rec.priority === 'high' ? 'bg-destructive/20' : ''}
                  ${rec.priority === 'medium' ? 'bg-warning/20' : ''}
                  ${rec.priority === 'low' ? 'bg-success/20' : ''}
                `}>
                  <Icon className={`
                    w-5 h-5
                    ${rec.priority === 'high' ? 'text-destructive' : ''}
                    ${rec.priority === 'medium' ? 'text-warning' : ''}
                    ${rec.priority === 'low' ? 'text-success' : ''}
                  `} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-display font-semibold text-foreground">{rec.title}</h4>
                    <span className="px-2 py-0.5 text-xs bg-white text-foreground border border-border rounded shadow-sm">
                      {typeLabels[rec.type]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
                <div className={`
                  px-2 py-1 rounded text-xs font-medium uppercase tracking-wider shrink-0
                  ${rec.priority === 'high' ? 'bg-destructive/20 text-destructive' : ''}
                  ${rec.priority === 'medium' ? 'bg-warning/20 text-warning' : ''}
                  ${rec.priority === 'low' ? 'bg-success/20 text-success' : ''}
                `}>
                  {priorityLabels[rec.priority]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

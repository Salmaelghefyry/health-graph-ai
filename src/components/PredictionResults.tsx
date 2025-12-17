import { AlertTriangle, TrendingUp, Shield, Activity } from 'lucide-react';

interface Prediction {
  disease: string;
  probability: number;
  risk: 'high' | 'medium' | 'low';
  pathway: string[];
}

interface PredictionResultsProps {
  predictions: Prediction[];
  isAnalyzing: boolean;
}

export const PredictionResults = ({ predictions, isAnalyzing }: PredictionResultsProps) => {
  if (isAnalyzing) {
    return (
      <div className="glass-effect rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-spin border-t-primary"></div>
          <Activity className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="mt-4 text-muted-foreground font-medium">Analyzing medical graph...</p>
        <p className="text-sm text-muted-foreground/70">Running GNN prediction model</p>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
        <Shield className="w-12 h-12 text-primary/50 mb-4" />
        <h3 className="font-display text-lg font-semibold mb-2">No Analysis Yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          Select conditions from the patient's medical record and click "Analyze Risk Profile" to see predictions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-lg">Risk Predictions</h3>
      </div>

      {predictions.map((prediction, index) => (
        <div
          key={prediction.disease}
          className="glass-effect rounded-xl p-4 animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`
                p-2 rounded-lg
                ${prediction.risk === 'high' ? 'bg-destructive/20' : ''}
                ${prediction.risk === 'medium' ? 'bg-warning/20' : ''}
                ${prediction.risk === 'low' ? 'bg-success/20' : ''}
              `}>
                <AlertTriangle className={`
                  w-5 h-5
                  ${prediction.risk === 'high' ? 'text-destructive' : ''}
                  ${prediction.risk === 'medium' ? 'text-warning' : ''}
                  ${prediction.risk === 'low' ? 'text-success' : ''}
                `} />
              </div>
              <div>
                <h4 className="font-display font-semibold">{prediction.disease}</h4>
                <p className={`
                  text-xs font-medium uppercase tracking-wider
                  ${prediction.risk === 'high' ? 'risk-high' : ''}
                  ${prediction.risk === 'medium' ? 'risk-medium' : ''}
                  ${prediction.risk === 'low' ? 'risk-low' : ''}
                `}>
                  {prediction.risk} risk
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-display font-bold text-foreground">
                {Math.round(prediction.probability * 100)}%
              </span>
              <p className="text-xs text-muted-foreground">probability</p>
            </div>
          </div>

          {/* Probability bar */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
            <div
              className={`
                h-full rounded-full transition-all duration-1000
                ${prediction.risk === 'high' ? 'bg-destructive' : ''}
                ${prediction.risk === 'medium' ? 'bg-warning' : ''}
                ${prediction.risk === 'low' ? 'bg-success' : ''}
              `}
              style={{ width: `${prediction.probability * 100}%` }}
            />
          </div>

          {/* Pathway */}
          {prediction.pathway.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Pathway:</span>
              {prediction.pathway.map((step, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="text-xs px-2 py-0.5 bg-secondary rounded text-foreground">
                    {step}
                  </span>
                  {i < prediction.pathway.length - 1 && (
                    <span className="text-primary">→</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

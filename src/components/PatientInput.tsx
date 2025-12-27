import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Activity, Plus, X, User, Calendar, FileText } from 'lucide-react';

interface PatientInputProps {
  onConditionsChange: (conditions: string[]) => void;
  onAnalyze: () => void;
  onAgeChange?: (age: number | undefined) => void;
}

const [availableConditions, setAvailableConditions] = useState<Array<{id:string,name:string,category:string}>>([]);

// Load diseases from generated data file to keep the UI in sync with the graph
useEffect(() => {
  let mounted = true;
  (async () => {
    try {
      const res = await fetch('/data/disease_symptom_graph.json');
      if (!res.ok) throw new Error('No graph data');
      const graph = await res.json();
      const diseaseNodes = graph.nodes.filter((n: any) => n.category === 'disease');
      if (!mounted) return;
      setAvailableConditions(diseaseNodes.map((d: any) => ({ id: d.id, name: d.name, category: 'Other' })));
    } catch (err) {
      // fallback to a reasonable default
      setAvailableConditions([
        { id: 'diabetes', name: 'Diabetes Type 2', category: 'Metabolic' },
        { id: 'hypertension', name: 'Hypertension', category: 'Cardiovascular' },
        { id: 'obesity', name: 'Obesity', category: 'Metabolic' },
      ]);
    }
  })();
  return () => { mounted = false; };
}, []);

export const PatientInput = ({ onConditionsChange, onAnalyze, onAgeChange }: PatientInputProps) => {
  const { t } = useLanguage();

  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');

  const toggleCondition = (conditionId: string) => {
    const newConditions = selectedConditions.includes(conditionId)
      ? selectedConditions.filter(c => c !== conditionId)
      : [...selectedConditions, conditionId];
    
    setSelectedConditions(newConditions);
    onConditionsChange(newConditions);
  };

  const handleAnalyze = () => {
    if (selectedConditions.length > 0) {
      onAnalyze();
    }
  };

  const categories = [...new Set(availableConditions.map(c => c.category))];

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <div className="glass-effect rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">{t.form.personalInfo}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t.form.fullName}</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder={t.form.enterName}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">{t.form.age}</label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => {
                setPatientAge(e.target.value);
                onAgeChange?.(e.target.value ? parseInt(e.target.value) : undefined);
              }}
              placeholder={t.form.enterAge}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="glass-effect rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">{t.form.medicalHistory}</h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {t.form.selectConditions}
        </p>

        {categories.map(category => (
          <div key={category} className="space-y-3">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">{category}</p>
            <div className="flex flex-wrap gap-2">
              {availableConditions
                .filter(c => c.category === category)
                .map(condition => {
                  const isSelected = selectedConditions.includes(condition.id);
                  return (
                    <button
                      key={condition.id}
                      onClick={() => toggleCondition(condition.id)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
                        ${isSelected 
                          ? 'bg-primary text-primary-foreground shadow-glow' 
                          : 'bg-secondary/50 text-foreground hover:bg-secondary border border-border hover:border-primary/30'
                        }
                      `}
                    >
                      {isSelected ? (
                        <X className="w-3.5 h-3.5" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      {condition.name}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Conditions Summary */}
      {selectedConditions.length > 0 && (
        <div className="glass-effect rounded-xl p-4 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {selectedConditions.length} {t.form.conditionsSelected}
              </span>
            </div>
            <Button
              variant="glow"
              size="lg"
              onClick={handleAnalyze}
              className="font-display"
            >
              {t.form.analyzeRisk}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

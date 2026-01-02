import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  User, Calendar, Activity, Heart, Droplets, Scale, 
  Cigarette, Wine, Baby, Thermometer, Stethoscope,
  FileHeart, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { MedicalFileUpload } from './MedicalFileUpload';

interface PatientFormData {
  // Personal Information
  name: string;
  age: number | undefined;
  sex: 'male' | 'female' | undefined;
  
  // Lifestyle Factors
  smoker: 'never' | 'former' | 'current' | undefined;
  cigarettesPerDay: number | undefined;
  alcoholConsumption: 'none' | 'occasional' | 'moderate' | 'heavy' | undefined;
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'active' | undefined;
  
  // For Women
  pregnant: boolean;
  menopause: boolean;
  
  // Blood Type
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | undefined;
  
  // Physical Measurements
  weight: number | undefined; // kg
  height: number | undefined; // cm
  waistCircumference: number | undefined; // cm
  
  // Medical History
  conditions: string[];
  symptoms: string[];
  familyHistory: string[];
}

interface DetailedPatientFormProps {
  onFormChange: (data: PatientFormData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onFileAnalysis?: (analysis: any) => void;
}

export const DetailedPatientForm = ({ 
  onFormChange, 
  onAnalyze, 
  isAnalyzing,
  onFileAnalysis 
}: DetailedPatientFormProps) => {
  const { t, isRTL } = useLanguage();
  const iDontKnow = (t.form as any).iDontKnow ?? "I don't know";
  const bloodTypeLabel = (t.form as any).bloodType ?? 'Blood Type';
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal', 'vitals']);
  
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    age: undefined,
    sex: undefined,
    smoker: undefined,
    cigarettesPerDay: undefined,
    alcoholConsumption: undefined,
    physicalActivity: undefined,
    pregnant: false,
    menopause: false,
    bloodType: undefined,
    weight: undefined,
    height: undefined,
    waistCircumference: undefined,
    conditions: [],
    symptoms: [],
    familyHistory: [],
  });

  const updateField = <K extends keyof PatientFormData>(field: K, value: PatientFormData[K]) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onFormChange(newData);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleArrayItem = (field: 'conditions' | 'symptoms' | 'familyHistory', item: string) => {
    const current = formData[field];

    // If user selects 'unknown', make it mutually exclusive with other selections
    if (item === 'unknown') {
      const newArray = current.includes('unknown') ? current.filter(i => i !== 'unknown') : ['unknown'];
      updateField(field, newArray);
      return;
    }

    // If a specific item is selected but 'unknown' is present, replace it
    if (current.includes('unknown')) {
      updateField(field, [item]);
      return;
    }

    const newArray = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField(field, newArray);
  };

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      const heightM = formData.height / 100;
      return (formData.weight / (heightM * heightM)).toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: t.form.bmiCategories.underweight, color: 'text-warning' };
    if (bmi < 25) return { label: t.form.bmiCategories.normal, color: 'text-success' };
    if (bmi < 30) return { label: t.form.bmiCategories.overweight, color: 'text-warning' };
    return { label: t.form.bmiCategories.obese, color: 'text-destructive' };
  };

  const conditions = [
    { id: 'diabetes', key: 'diabetes' },
    { id: 'hypertension', key: 'hypertension' },
    { id: 'heart_disease', key: 'heartDisease' },
    { id: 'coronary_artery', key: 'coronaryArtery' },
    { id: 'arrhythmia', key: 'arrhythmia' },
    { id: 'heart_failure', key: 'heartFailure' },
    { id: 'stroke_history', key: 'strokeHistory' },
    { id: 'kidney_disease', key: 'kidneyDisease' },
    { id: 'obesity', key: 'obesity' },
    { id: 'sleep_apnea', key: 'sleepApnea' },
    { id: 'thyroid', key: 'thyroid' },
    { id: 'asthma', key: 'asthma' },
  ];

  const symptoms = [
    { id: 'chest_pain', key: 'chestPain' },
    { id: 'shortness_breath', key: 'shortnessBreath' },
    { id: 'palpitations', key: 'palpitations' },
    { id: 'fatigue', key: 'fatigue' },
    { id: 'dizziness', key: 'dizziness' },
    { id: 'swelling_legs', key: 'swellingLegs' },
    { id: 'irregular_heartbeat', key: 'irregularHeartbeat' },
    { id: 'cold_sweats', key: 'coldSweats' },
    { id: 'nausea', key: 'nausea' },
    { id: 'frequent_urination', key: 'frequentUrination' },
    { id: 'excessive_thirst', key: 'excessiveThirst' },
    { id: 'blurred_vision', key: 'blurredVision' },
  ];

  const familyHistoryOptions = [
    { id: 'fh_heart_disease', key: 'heartDisease' },
    { id: 'fh_diabetes', key: 'diabetes' },
    { id: 'fh_hypertension', key: 'hypertension' },
    { id: 'fh_stroke', key: 'stroke' },
    { id: 'fh_cancer', key: 'cancer' },
    { id: 'fh_sudden_death', key: 'suddenDeath' },
  ];

  const SectionHeader = ({ id, icon: Icon, title }: { id: string; icon: any; title: string }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-display font-semibold">{title}</span>
      </div>
      {expandedSections.includes(id) ? (
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      ) : (
        <ChevronDown className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    type = 'text', 
    placeholder, 
    unit,
    min,
    max,
    step
  }: { 
    label: string; 
    value: string | number | undefined; 
    onChange: (val: string) => void;
    type?: string;
    placeholder?: string;
    unit?: string;
    min?: number;
    max?: number;
    step?: number;
  }) => {
    // Local input state to avoid rapid parent updates causing focus loss
    const [localValue, setLocalValue] = useState<string>('');
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
      // Keep local value in sync when parent updates (e.g., reset)
      setLocalValue('' + (value ?? ''));
    }, [value]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      };
    }, []);

    const emit = (next: string) => {
      setLocalValue(next);
      // Debounce forwarding to parent to avoid frequent re-renders
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        onChange(next);
        timeoutRef.current = null;
      }, 250) as unknown as number;
    };

    return (
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">{label}</label>
        <div className="relative">
          <input
            type={type}
            value={localValue}
            onChange={(e) => emit(e.target.value)}
            onBlur={() => onChange(localValue)}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            className={`w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${unit ? (isRTL ? 'pl-12' : 'pr-12') : ''}`}
          />
          {unit && (
            <span className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-sm text-muted-foreground`}>
              {unit}
            </span>
          )}
        </div>
      </div>
    );
  };


  const SelectButton = ({ 
    selected, 
    onClick, 
    children 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        selected 
          ? 'bg-primary text-primary-foreground shadow-glow' 
          : 'bg-white text-foreground border border-border shadow-sm hover:bg-secondary/50'
      }`}
    >
      {children}
    </button>
  );

  const TagButton = ({ 
    selected, 
    onClick, 
    children 
  }: { 
    selected: boolean; 
    onClick: () => void; 
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        selected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-white text-foreground border border-border shadow-sm hover:bg-secondary/50'
      }`}
    >
      {children}
    </button>
  );

  const bmi = calculateBMI();
  const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

  const canAnalyze = formData.conditions.length > 0 || formData.symptoms.length > 0;

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Personal Information */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <SectionHeader id="personal" icon={User} title={t.form.personalInfo} />
        {expandedSections.includes('personal') && (
          <div className="p-4 space-y-4">
            <InputField
              label={t.form.fullName}
              value={formData.name}
              onChange={(val) => updateField('name', val)}
              placeholder={t.form.enterName}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.age}
                value={formData.age}
                onChange={(val) => updateField('age', val ? parseInt(val) : undefined)}
                type="number"
                placeholder={t.form.years}
                min={1}
                max={120}
              />
              
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">{t.form.sex}</label>
                <div className="flex gap-2">
                  <SelectButton 
                    selected={formData.sex === 'male'} 
                    onClick={() => updateField('sex', 'male')}
                  >
                    {t.form.male}
                  </SelectButton>
                  <SelectButton 
                    selected={formData.sex === 'female'} 
                    onClick={() => updateField('sex', 'female')}
                  >
                    {t.form.female}
                  </SelectButton>
                  <SelectButton
                    selected={formData.sex === undefined}
                    onClick={() => updateField('sex', undefined)}
                  >
                    {iDontKnow}
                  </SelectButton>
                </div>
              </div>
            </div>

            {formData.sex === 'female' && (
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.pregnant}
                    onChange={(e) => updateField('pregnant', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{t.form.pregnant}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.menopause}
                    onChange={(e) => updateField('menopause', e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{t.form.menopause}</span>
                </label>
              </div>
            )}

            {/* Blood Type */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{bloodTypeLabel}</label>
              <div className="flex flex-wrap gap-2">
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => (
                  <SelectButton
                    key={bt}
                    selected={formData.bloodType === bt}
                    onClick={() => updateField('bloodType', bt as any)}
                  >
                    {bt}
                  </SelectButton>
                ))}
                <SelectButton
                  selected={formData.bloodType === undefined}
                  onClick={() => updateField('bloodType', undefined)}
                >
                  {iDontKnow}
                </SelectButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lifestyle */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <SectionHeader id="lifestyle" icon={Activity} title={t.form.lifestyle} />
        {expandedSections.includes('lifestyle') && (
          <div className="p-4 space-y-4">
            {/* Smoking */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Cigarette className="w-4 h-4" />
                {t.form.smokingStatus}
              </label>
              <div className="flex flex-wrap gap-2">
                <SelectButton 
                  selected={formData.smoker === 'never'} 
                  onClick={() => updateField('smoker', 'never')}
                >
                  {t.form.never}
                </SelectButton>
                <SelectButton 
                  selected={formData.smoker === 'former'} 
                  onClick={() => updateField('smoker', 'former')}
                >
                  {t.form.former}
                </SelectButton>
                <SelectButton 
                  selected={formData.smoker === 'current'} 
                  onClick={() => updateField('smoker', 'current')}
                >
                  {t.form.current}
                </SelectButton>
              </div>
              {formData.smoker === 'current' && (
                <InputField
                  label={t.form.cigarettesPerDay}
                  value={formData.cigarettesPerDay}
                  onChange={(val) => updateField('cigarettesPerDay', val ? parseInt(val) : undefined)}
                  type="number"
                  placeholder="0"
                  min={0}
                />
              )}
            </div>

            {/* Alcohol */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground flex items-center gap-2">
                <Wine className="w-4 h-4" />
                {t.form.alcoholConsumption}
              </label>
              <div className="flex flex-wrap gap-2">
                <SelectButton 
                  selected={formData.alcoholConsumption === 'none'} 
                  onClick={() => updateField('alcoholConsumption', 'none')}
                >
                  {t.form.none}
                </SelectButton>
                <SelectButton 
                  selected={formData.alcoholConsumption === 'occasional'} 
                  onClick={() => updateField('alcoholConsumption', 'occasional')}
                >
                  {t.form.occasional}
                </SelectButton>
                <SelectButton 
                  selected={formData.alcoholConsumption === 'moderate'} 
                  onClick={() => updateField('alcoholConsumption', 'moderate')}
                >
                  {t.form.moderate}
                </SelectButton>
                <SelectButton 
                  selected={formData.alcoholConsumption === 'heavy'} 
                  onClick={() => updateField('alcoholConsumption', 'heavy')}
                >
                  {t.form.heavy}
                </SelectButton>
              </div>
            </div>

            {/* Physical Activity */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">{t.form.physicalActivity}</label>
              <div className="flex flex-wrap gap-2">
                <SelectButton 
                  selected={formData.physicalActivity === 'sedentary'} 
                  onClick={() => updateField('physicalActivity', 'sedentary')}
                >
                  {t.form.sedentary}
                </SelectButton>
                <SelectButton 
                  selected={formData.physicalActivity === 'light'} 
                  onClick={() => updateField('physicalActivity', 'light')}
                >
                  {t.form.light}
                </SelectButton>
                <SelectButton 
                  selected={formData.physicalActivity === 'moderate'} 
                  onClick={() => updateField('physicalActivity', 'moderate')}
                >
                  {t.form.moderateActivity}
                </SelectButton>
                <SelectButton 
                  selected={formData.physicalActivity === 'active'} 
                  onClick={() => updateField('physicalActivity', 'active')}
                >
                  {t.form.active}
                </SelectButton>
              </div>
            </div>
          </div>
        )}
      </div>



      {/* Physical Measurements */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <SectionHeader id="physical" icon={Scale} title={t.form.physicalMeasurements} />
        {expandedSections.includes('physical') && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.weight}
                value={formData.weight}
                onChange={(val) => updateField('weight', val ? parseFloat(val) : undefined)}
                type="number"
                placeholder="70"
                unit="kg"
                min={20}
                max={300}
                step={0.1}
              />
              <InputField
                label={t.form.height}
                value={formData.height}
                onChange={(val) => updateField('height', val ? parseFloat(val) : undefined)}
                type="number"
                placeholder="170"
                unit="cm"
                min={100}
                max={250}
              />
            </div>
            
            {bmi && (
              <div className="p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t.form.bmi}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-lg">{bmi}</span>
                    <span className={`text-sm font-medium ${bmiCategory?.color}`}>
                      ({bmiCategory?.label})
                    </span>
                  </div>
                </div>
              </div>
            )}

            <InputField
              label={t.form.waistCircumference}
              value={formData.waistCircumference}
              onChange={(val) => updateField('waistCircumference', val ? parseFloat(val) : undefined)}
              type="number"
              placeholder="90"
              unit="cm"
              min={50}
              max={200}
            />
          </div>
        )}
      </div>



      {/* Medical History */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <SectionHeader id="history" icon={FileHeart} title={t.form.medicalHistory} />
        {expandedSections.includes('history') && (
          <div className="p-4 space-y-4">
            {/* Existing Conditions */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-primary uppercase tracking-wider">{t.form.existingConditions}</label>
              <div className="flex flex-wrap gap-2">
                {conditions.map(({ id, key }) => (
                  <TagButton
                    key={id}
                    selected={formData.conditions.includes(id)}
                    onClick={() => toggleArrayItem('conditions', id)}
                  >
                    {t.form.conditionsList[key as keyof typeof t.form.conditionsList]}
                  </TagButton>
                ))}
                <TagButton
                  selected={formData.conditions.includes('unknown')}
                  onClick={() => toggleArrayItem('conditions', 'unknown')}
                >
                  {t.form.iDontKnow}
                </TagButton>
              </div>
            </div>

            {/* Family History */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-primary uppercase tracking-wider">{t.form.familyHistory}</label>
              <div className="flex flex-wrap gap-2">
                {familyHistoryOptions.map(({ id, key }) => (
                  <TagButton
                    key={id}
                    selected={formData.familyHistory.includes(id)}
                    onClick={() => toggleArrayItem('familyHistory', id)}
                  >
                    {t.form.familyHistoryList[key as keyof typeof t.form.familyHistoryList]}
                  </TagButton>
                ))}
                <TagButton
                  selected={formData.familyHistory.includes('unknown')}
                  onClick={() => toggleArrayItem('familyHistory', 'unknown')}
                >
                  {t.form.iDontKnow}
                </TagButton>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Symptoms */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <SectionHeader id="symptoms" icon={Stethoscope} title={t.form.currentSymptoms} />
        {expandedSections.includes('symptoms') && (
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {symptoms.map(({ id, key }) => (
                <TagButton
                  key={id}
                  selected={formData.symptoms.includes(id)}
                  onClick={() => toggleArrayItem('symptoms', id)}
                >
                  {t.form.symptomsList[key as keyof typeof t.form.symptomsList]}
                </TagButton>
              ))}
              <TagButton
                selected={formData.symptoms.includes('unknown')}
                onClick={() => toggleArrayItem('symptoms', 'unknown')}
              >
                {t.form.iDontKnow}
              </TagButton>
            </div>
          </div>
        )}
      </div>

      {/* Medical File Upload */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <SectionHeader id="files" icon={FileHeart} title={t.upload.title} />
        {expandedSections.includes('files') && (
          <div className="p-4">
            <MedicalFileUpload onAnalysisComplete={onFileAnalysis} />
          </div>
        )}
      </div>

      {/* Analysis Summary & Button */}
      <div className="glass-effect rounded-xl p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-primary" />
            <div>
              <span className="text-sm font-medium">
                {formData.conditions.length} {t.form.conditionsSelected}
              </span>
              {formData.symptoms.length > 0 && (
                <span className="text-sm text-muted-foreground mx-2">•</span>
              )}
              {formData.symptoms.length > 0 && (
                <span className="text-sm font-medium">
                  {formData.symptoms.length} {t.form.symptomsSelected}
                </span>
              )}
            </div>
          </div>
          <Button
            variant="glow"
            size="lg"
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            className="font-display"
          >
            {isAnalyzing ? t.form.analyzing : t.form.analyzeRisk}
          </Button>
        </div>
      </div>
    </div>
  );
};

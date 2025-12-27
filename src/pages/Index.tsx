import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { DetailedPatientForm } from '@/components/DetailedPatientForm';
import { DiseaseGraph } from '@/components/DiseaseGraph';
import { PredictionResults } from '@/components/PredictionResults';
import { Recommendations } from '@/components/Recommendations';
import { ChatAssistant } from '@/components/ChatAssistant';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Prediction {
  disease: string;
  probability: number;
  risk: 'high' | 'medium' | 'low';
  pathway: string[];
}

interface Recommendation {
  type: 'test' | 'lifestyle' | 'prevention' | 'diet';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const Index = () => {
  const [patientData, setPatientData] = useState<any>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [fileAnalysis, setFileAnalysis] = useState<any>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { t, isRTL, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Require authentication to access the dashboard
    if (!user) {
      toast({
        title: t.common.error,
        description: t.dashboard.signInPrompt,
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setShowDashboard(true);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAnalyze = async () => {
    if (!patientData || (patientData.conditions.length === 0 && patientData.symptoms.length === 0)) {
      toast({
        title: t.common.error,
        description: t.form.selectAtLeastOne,
        variant: 'destructive',
      });
      return;
    }

    // Require authenticated user
    if (!user) {
      toast({
        title: t.common.error,
        description: t.dashboard.signInPrompt,
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    setIsAnalyzing(true);
    setPredictions([]);
    setRecommendations([]);

    try {
      // Use Supabase Functions client so the user's session token is sent with the request
      const { data, error } = await supabase.functions.invoke('predict-diseases', {
        body: {
          ...patientData,
          fileAnalysis,
          language,
        },
      });

      if (error) {
        throw error;
      }

      const mappedPredictions: Prediction[] = (data.predictions || []).map((p: any) => ({
        disease: p.disease,
        probability: p.probability / 100,
        risk: p.riskLevel?.toLowerCase() || 'medium',
        pathway: p.pathway ? p.pathway.split(' → ') : [],
      }));

      const mappedRecommendations: Recommendation[] = (data.recommendations || []).map((r: any) => ({
        type: r.type || 'prevention',
        title: r.title,
        description: r.description,
        priority: r.priority?.toLowerCase() || 'medium',
      }));

      setPredictions(mappedPredictions);
      setRecommendations(mappedRecommendations);

      if (user) {
        await supabase.from('prediction_history').insert({
          user_id: user.id,
          conditions: patientData.conditions,
          predictions: data.predictions || [],
          recommendations: data.recommendations || [],
          language,
        });
      }

      toast({
        title: t.common.success,
        description: t.predictions.foundRiskFactors.replace('{count}', String(mappedPredictions.length)),
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: t.common.error,
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeConditions = patientData?.conditions || [];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <Hero onGetStarted={handleGetStarted} />

      {showDashboard && (
        <section ref={dashboardRef} className="py-20 px-6">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                {t.dashboard.title} <span className="glow-text">{t.dashboard.subtitle}</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {t.predictions.noPredictions}
              </p>
              {!user && (
                <p className="text-sm text-primary mt-2">
                  <button onClick={() => navigate('/auth')} className="underline hover:no-underline">
                    {t.dashboard.signIn}
                  </button> {t.dashboard.signInPrompt}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-6 animate-fade-in-up animation-delay-100">
                <DetailedPatientForm 
                  onFormChange={setPatientData}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  onFileAnalysis={setFileAnalysis}
                />
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="animate-fade-in-up animation-delay-200">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></span>
                    {t.dashboard.graphTitle}
                  </h3>
                  <DiseaseGraph activeConditions={activeConditions} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-300">
                  <PredictionResults predictions={predictions} isAnalyzing={isAnalyzing} />
                  <Recommendations recommendations={recommendations} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <ChatAssistant activeConditions={activeConditions} predictions={predictions} />

      <footer className="border-t border-border py-8 px-6">
        <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t.footer.disclaimer}
          </p>
          <p className="text-sm text-muted-foreground">
            {t.footer.poweredBy}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

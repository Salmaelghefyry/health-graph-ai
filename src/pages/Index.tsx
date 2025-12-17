import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { PatientInput } from '@/components/PatientInput';
import { DiseaseGraph } from '@/components/DiseaseGraph';
import { PredictionResults } from '@/components/PredictionResults';
import { Recommendations } from '@/components/Recommendations';
import { ChatAssistant } from '@/components/ChatAssistant';
import { useAuth } from '@/hooks/useAuth';
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
  const [activeConditions, setActiveConditions] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [patientAge, setPatientAge] = useState<number | undefined>();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setShowDashboard(true);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAnalyze = async () => {
    if (activeConditions.length === 0) {
      toast({
        title: 'No conditions selected',
        description: 'Please select at least one condition to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setPredictions([]);
    setRecommendations([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict-diseases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          conditions: activeConditions,
          patientAge,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze');
      }

      const data = await response.json();
      console.log('Prediction response:', data);

      // Map API response to component format
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

      // Save to history if user is logged in
      if (user) {
        await supabase.from('prediction_history').insert({
          user_id: user.id,
          conditions: activeConditions,
          predictions: data.predictions || [],
          recommendations: data.recommendations || [],
        });
      }

      toast({
        title: 'Analysis Complete',
        description: `Found ${mappedPredictions.length} potential risk factors.`,
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero onGetStarted={handleGetStarted} />

      {/* Dashboard Section */}
      {showDashboard && (
        <section ref={dashboardRef} className="py-20 px-6">
          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Disease Risk <span className="glow-text">Analysis Dashboard</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Enter patient information and medical history to activate the disease graph and receive AI-powered predictions.
              </p>
              {!user && (
                <p className="text-sm text-primary mt-2">
                  <button onClick={() => navigate('/auth')} className="underline hover:no-underline">
                    Sign in
                  </button> to save your predictions and track your health over time.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Patient Input */}
              <div className="lg:col-span-1 space-y-6 animate-fade-in-up animation-delay-100">
                <PatientInput 
                  onConditionsChange={setActiveConditions}
                  onAnalyze={handleAnalyze}
                  onAgeChange={setPatientAge}
                />
              </div>

              {/* Right Column - Graph & Results */}
              <div className="lg:col-span-2 space-y-6">
                {/* Disease Graph */}
                <div className="animate-fade-in-up animation-delay-200">
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></span>
                    Medical Knowledge Graph
                  </h3>
                  <DiseaseGraph activeConditions={activeConditions} />
                </div>

                {/* Predictions & Recommendations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up animation-delay-300">
                  <PredictionResults predictions={predictions} isAnalyzing={isAnalyzing} />
                  <Recommendations recommendations={recommendations} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Chat Assistant */}
      <ChatAssistant activeConditions={activeConditions} predictions={predictions} />

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="container max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Medical Decision Support System — For educational purposes only
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by Graph Neural Networks
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

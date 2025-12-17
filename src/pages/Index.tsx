import { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { PatientInput } from '@/components/PatientInput';
import { DiseaseGraph } from '@/components/DiseaseGraph';
import { PredictionResults } from '@/components/PredictionResults';
import { Recommendations } from '@/components/Recommendations';
import { ChatAssistant } from '@/components/ChatAssistant';

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
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    setShowDashboard(true);
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulate GNN analysis
    setTimeout(() => {
      const newPredictions: Prediction[] = [];
      const newRecommendations: Recommendation[] = [];

      // Generate predictions based on selected conditions
      if (activeConditions.includes('diabetes')) {
        newPredictions.push({
          disease: 'Cardiovascular Disease',
          probability: 0.72,
          risk: 'high',
          pathway: ['Diabetes Type 2', 'Atherosclerosis', 'Heart Disease'],
        });
        newPredictions.push({
          disease: 'Diabetic Nephropathy',
          probability: 0.55,
          risk: 'medium',
          pathway: ['Diabetes Type 2', 'Kidney Disease'],
        });
        newRecommendations.push({
          type: 'test',
          title: 'HbA1c Test',
          description: 'Schedule regular HbA1c testing every 3 months to monitor blood sugar control.',
          priority: 'high',
        });
      }

      if (activeConditions.includes('hypertension')) {
        newPredictions.push({
          disease: 'Stroke',
          probability: 0.65,
          risk: 'high',
          pathway: ['Hypertension', 'Atherosclerosis', 'Stroke'],
        });
        newRecommendations.push({
          type: 'lifestyle',
          title: 'Blood Pressure Monitoring',
          description: 'Monitor blood pressure daily at home and maintain a log for your healthcare provider.',
          priority: 'high',
        });
        newRecommendations.push({
          type: 'diet',
          title: 'DASH Diet',
          description: 'Follow the DASH diet to help lower blood pressure naturally.',
          priority: 'medium',
        });
      }

      if (activeConditions.includes('obesity')) {
        newPredictions.push({
          disease: 'Type 2 Diabetes',
          probability: 0.68,
          risk: 'high',
          pathway: ['Obesity', 'Insulin Resistance', 'Diabetes Type 2'],
        });
        newPredictions.push({
          disease: 'Sleep Apnea',
          probability: 0.58,
          risk: 'medium',
          pathway: ['Obesity', 'Sleep Apnea'],
        });
        newRecommendations.push({
          type: 'lifestyle',
          title: 'Weight Management Program',
          description: 'Aim for 5-10% weight loss through a combination of diet and exercise.',
          priority: 'high',
        });
      }

      if (activeConditions.includes('sleep_apnea')) {
        newPredictions.push({
          disease: 'Hypertension',
          probability: 0.52,
          risk: 'medium',
          pathway: ['Sleep Apnea', 'Hypertension'],
        });
        newRecommendations.push({
          type: 'test',
          title: 'Sleep Study',
          description: 'Consider a polysomnography to assess sleep apnea severity.',
          priority: 'medium',
        });
      }

      // Add general recommendations
      newRecommendations.push({
        type: 'prevention',
        title: 'Regular Check-ups',
        description: 'Schedule comprehensive health screenings every 6-12 months.',
        priority: 'medium',
      });
      newRecommendations.push({
        type: 'diet',
        title: 'Mediterranean Diet',
        description: 'Adopt a Mediterranean-style diet rich in vegetables, whole grains, and healthy fats.',
        priority: 'low',
      });

      // Sort predictions by probability
      newPredictions.sort((a, b) => b.probability - a.probability);
      
      setPredictions(newPredictions);
      setRecommendations(newRecommendations);
      setIsAnalyzing(false);
    }, 2500);
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Patient Input */}
              <div className="lg:col-span-1 space-y-6 animate-fade-in-up animation-delay-100">
                <PatientInput 
                  onConditionsChange={setActiveConditions}
                  onAnalyze={handleAnalyze}
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

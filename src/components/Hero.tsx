import { Activity, Brain, Network, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.08)_0%,_transparent_70%)]"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-glow-secondary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)/0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)/0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass-effect text-sm animate-fade-in-up">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Powered by Graph Neural Networks</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up animation-delay-100">
            <span className="text-foreground">Intelligent</span>
            <br />
            <span className="glow-text">Disease Prediction</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            A medical decision-support platform using weighted disease graphs and GNN models to predict health risks, progression pathways, and deliver personalized preventive recommendations.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up animation-delay-300">
            <Button variant="glow" size="xl" onClick={onGetStarted} className="font-display">
              Start Analysis
              <Activity className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {[
              {
                icon: Network,
                title: 'Medical Graph',
                description: 'Weighted directed graph modeling disease relationships and progression pathways',
              },
              {
                icon: Brain,
                title: 'GNN Prediction',
                description: 'Graph Neural Network analyzes patient records to predict probable diseases',
              },
              {
                icon: Shield,
                title: 'Smart Recommendations',
                description: 'Personalized tests, lifestyle changes, and preventive measures',
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="glass-effect rounded-2xl p-6 text-left hover:border-primary/30 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

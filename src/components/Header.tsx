import { Activity, Github, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg">MedGraph AI</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Documentation
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon">
            <Info className="w-5 h-5" />
          </Button>
          <Button variant="glass" size="sm" className="hidden sm:flex">
            <Github className="w-4 h-4 mr-2" />
            View Source
          </Button>
        </div>
      </div>
    </header>
  );
};

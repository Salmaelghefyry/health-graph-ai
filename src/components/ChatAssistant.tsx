import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, X, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  activeConditions: string[];
  predictions: any[];
}

export const ChatAssistant = ({ activeConditions, predictions }: ChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your medical AI assistant. I can help you understand the disease predictions, explain relationships in the medical graph, and provide context for the recommendations. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('diabetes') && lowerMessage.includes('heart')) {
      return "Diabetes significantly increases the risk of heart disease through multiple mechanisms. High blood sugar levels can damage blood vessels and nerves that control the heart. The medical graph shows a 60% probability connection between these conditions. Patients with diabetes are 2-4 times more likely to develop cardiovascular disease.";
    }
    
    if (lowerMessage.includes('prediction') || lowerMessage.includes('risk')) {
      if (predictions.length > 0) {
        const topPrediction = predictions[0];
        return `Based on the GNN analysis, the highest risk prediction is ${topPrediction.disease} with a ${Math.round(topPrediction.probability * 100)}% probability. This is determined by analyzing the weighted connections in the medical graph from your current conditions. The pathway shows: ${topPrediction.pathway.join(' → ')}.`;
      }
      return "To see risk predictions, please select conditions from the patient's medical history and run the analysis.";
    }
    
    if (lowerMessage.includes('recommend') || lowerMessage.includes('what should')) {
      return "Based on the current analysis, I recommend: 1) Regular cardiovascular monitoring given the risk factors, 2) HbA1c testing every 3-6 months if diabetes is present, 3) Blood pressure monitoring at home, and 4) A Mediterranean-style diet which has shown to reduce cardiovascular risk by up to 30%.";
    }
    
    if (lowerMessage.includes('graph') || lowerMessage.includes('connection')) {
      return "The medical graph visualizes disease relationships as weighted edges. Edge weights represent the probability of progression or comorbidity. For example, a weight of 0.75 between obesity and diabetes indicates a 75% increased risk correlation. The GNN model propagates signals through these connections to predict future health risks.";
    }
    
    if (lowerMessage.includes('how') && lowerMessage.includes('work')) {
      return "This platform uses a Graph Neural Network (GNN) that operates on a directed, weighted medical graph. Each node represents a disease, and edges represent relationships (progression, comorbidity, or risk factors). When you input a patient's conditions, the GNN activates those nodes and propagates signals through the graph to predict which diseases have the highest probability of occurring.";
    }

    return "I can help explain the disease predictions, describe relationships between conditions in the medical graph, or provide context for the recommendations. Could you please be more specific about what you'd like to know?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-elevated transition-all duration-300
          ${isOpen 
            ? 'bg-secondary text-foreground' 
            : 'bg-primary text-primary-foreground shadow-glow hover:scale-110'
          }
        `}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      <div className={`
        fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] 
        glass-effect rounded-2xl shadow-elevated overflow-hidden
        transition-all duration-300 transform
        ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}
      `}>
        {/* Header */}
        <div className="bg-secondary/50 border-b border-border px-4 py-3 flex items-center gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm">Medical AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Explain predictions & graph relationships</p>
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`
                shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                ${message.role === 'user' ? 'bg-primary/20' : 'bg-secondary'}
              `}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-primary" />
                ) : (
                  <Bot className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className={`
                max-w-[75%] rounded-xl px-4 py-2.5
                ${message.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-foreground'
                }
              `}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-secondary">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-secondary rounded-xl px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about predictions..."
              className="flex-1 bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <Button
              variant="glow"
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

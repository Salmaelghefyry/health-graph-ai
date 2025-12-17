import { useEffect, useRef, useState } from 'react';

interface DiseaseNode {
  id: string;
  name: string;
  x: number;
  y: number;
  risk: 'high' | 'medium' | 'low' | 'neutral';
  active: boolean;
  size: number;
}

interface DiseaseEdge {
  source: string;
  target: string;
  weight: number;
  type: 'progression' | 'comorbidity' | 'risk';
}

interface DiseaseGraphProps {
  activeConditions: string[];
  onNodeSelect?: (node: DiseaseNode) => void;
}

const diseaseNodes: DiseaseNode[] = [
  { id: 'diabetes', name: 'Diabetes Type 2', x: 400, y: 200, risk: 'neutral', active: false, size: 45 },
  { id: 'hypertension', name: 'Hypertension', x: 250, y: 300, risk: 'neutral', active: false, size: 40 },
  { id: 'heart_disease', name: 'Heart Disease', x: 550, y: 350, risk: 'neutral', active: false, size: 50 },
  { id: 'kidney_disease', name: 'Kidney Disease', x: 200, y: 450, risk: 'neutral', active: false, size: 35 },
  { id: 'stroke', name: 'Stroke', x: 500, y: 500, risk: 'neutral', active: false, size: 42 },
  { id: 'obesity', name: 'Obesity', x: 350, y: 120, risk: 'neutral', active: false, size: 38 },
  { id: 'neuropathy', name: 'Neuropathy', x: 600, y: 180, risk: 'neutral', active: false, size: 32 },
  { id: 'retinopathy', name: 'Retinopathy', x: 150, y: 180, risk: 'neutral', active: false, size: 30 },
  { id: 'sleep_apnea', name: 'Sleep Apnea', x: 450, y: 80, risk: 'neutral', active: false, size: 33 },
  { id: 'atherosclerosis', name: 'Atherosclerosis', x: 680, y: 400, risk: 'neutral', active: false, size: 36 },
];

const diseaseEdges: DiseaseEdge[] = [
  { source: 'obesity', target: 'diabetes', weight: 0.75, type: 'risk' },
  { source: 'obesity', target: 'hypertension', weight: 0.65, type: 'risk' },
  { source: 'obesity', target: 'sleep_apnea', weight: 0.70, type: 'comorbidity' },
  { source: 'diabetes', target: 'heart_disease', weight: 0.60, type: 'progression' },
  { source: 'diabetes', target: 'kidney_disease', weight: 0.55, type: 'progression' },
  { source: 'diabetes', target: 'neuropathy', weight: 0.50, type: 'progression' },
  { source: 'diabetes', target: 'retinopathy', weight: 0.45, type: 'progression' },
  { source: 'hypertension', target: 'heart_disease', weight: 0.70, type: 'risk' },
  { source: 'hypertension', target: 'stroke', weight: 0.65, type: 'risk' },
  { source: 'hypertension', target: 'kidney_disease', weight: 0.50, type: 'progression' },
  { source: 'heart_disease', target: 'stroke', weight: 0.55, type: 'progression' },
  { source: 'heart_disease', target: 'atherosclerosis', weight: 0.60, type: 'comorbidity' },
  { source: 'sleep_apnea', target: 'hypertension', weight: 0.55, type: 'risk' },
  { source: 'atherosclerosis', target: 'stroke', weight: 0.50, type: 'progression' },
];

export const DiseaseGraph = ({ activeConditions, onNodeSelect }: DiseaseGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<DiseaseNode[]>(diseaseNodes);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    // Calculate risk levels based on active conditions
    const updatedNodes = diseaseNodes.map(node => {
      const isActive = activeConditions.includes(node.id);
      let risk: 'high' | 'medium' | 'low' | 'neutral' = 'neutral';
      
      if (isActive) {
        risk = 'high';
      } else {
        // Check connections from active nodes
        const incomingEdges = diseaseEdges.filter(
          edge => edge.target === node.id && activeConditions.includes(edge.source)
        );
        
        if (incomingEdges.length > 0) {
          const maxWeight = Math.max(...incomingEdges.map(e => e.weight));
          if (maxWeight >= 0.6) risk = 'high';
          else if (maxWeight >= 0.4) risk = 'medium';
          else risk = 'low';
        }
      }
      
      return { ...node, active: isActive, risk };
    });
    
    setNodes(updatedNodes);
  }, [activeConditions]);

  const getRiskColor = (risk: string, isHovered: boolean, isSelected: boolean) => {
    const opacity = isHovered || isSelected ? 1 : 0.8;
    switch (risk) {
      case 'high': return `rgba(239, 68, 68, ${opacity})`;
      case 'medium': return `rgba(245, 158, 11, ${opacity})`;
      case 'low': return `rgba(34, 197, 94, ${opacity})`;
      default: return `rgba(45, 212, 191, ${opacity})`;
    }
  };

  const getGlowFilter = (risk: string) => {
    switch (risk) {
      case 'high': return 'url(#glow-red)';
      case 'medium': return 'url(#glow-yellow)';
      case 'low': return 'url(#glow-green)';
      default: return 'url(#glow-cyan)';
    }
  };

  const handleNodeClick = (node: DiseaseNode) => {
    setSelectedNode(node.id);
    onNodeSelect?.(node);
  };

  return (
    <div className="relative w-full h-[600px] rounded-2xl overflow-hidden glass-effect">
      <svg
        ref={svgRef}
        viewBox="0 0 800 600"
        className="w-full h-full"
        style={{ background: 'transparent' }}
      >
        <defs>
          {/* Glow filters */}
          <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-yellow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="hsl(199 60% 40% / 0.6)"
            />
          </marker>
        </defs>

        {/* Edges */}
        {diseaseEdges.map((edge, index) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const isActive = activeConditions.includes(edge.source);
          const opacity = isActive ? 0.8 : 0.3;
          const strokeWidth = isActive ? edge.weight * 4 + 1 : 1;

          return (
            <line
              key={index}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke={isActive ? getRiskColor(targetNode.risk, false, false) : 'hsl(199 60% 40%)'}
              strokeWidth={strokeWidth}
              opacity={opacity}
              markerEnd={isActive ? "url(#arrowhead)" : undefined}
              className="transition-all duration-500"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isHovered = hoveredNode === node.id;
          const isSelected = selectedNode === node.id;
          const scale = isHovered || isSelected ? 1.2 : 1;
          
          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer transition-transform duration-300"
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => handleNodeClick(node)}
              style={{ transform: `translate(${node.x}px, ${node.y}px) scale(${scale})` }}
            >
              {/* Outer glow ring for active/at-risk nodes */}
              {node.risk !== 'neutral' && (
                <circle
                  r={node.size + 8}
                  fill="none"
                  stroke={getRiskColor(node.risk, isHovered, isSelected)}
                  strokeWidth="2"
                  opacity={0.3}
                  className="animate-pulse-glow"
                />
              )}
              
              {/* Main node */}
              <circle
                r={node.size}
                fill={getRiskColor(node.risk, isHovered, isSelected)}
                filter={getGlowFilter(node.risk)}
                className="transition-all duration-300"
              />
              
              {/* Inner highlight */}
              <circle
                r={node.size * 0.6}
                fill="white"
                opacity={0.1}
                transform="translate(-5, -5)"
              />
              
              {/* Node label */}
              <text
                y={node.size + 20}
                textAnchor="middle"
                fill="hsl(210 40% 98%)"
                fontSize="12"
                fontWeight="500"
                className="pointer-events-none font-display"
              >
                {node.name}
              </text>
              
              {/* Risk indicator */}
              {node.risk !== 'neutral' && (
                <text
                  y={-node.size - 8}
                  textAnchor="middle"
                  fill={getRiskColor(node.risk, false, false)}
                  fontSize="10"
                  fontWeight="600"
                  className="uppercase tracking-wider"
                >
                  {node.risk === 'high' ? 'HIGH RISK' : node.risk === 'medium' ? 'MODERATE' : 'LOW RISK'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Risk Level</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--risk-high)/0.5)]"></span>
          <span className="text-xs text-foreground">High</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-warning shadow-[0_0_8px_hsl(var(--warning)/0.5)]"></span>
          <span className="text-xs text-foreground">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success)/0.5)]"></span>
          <span className="text-xs text-foreground">Low</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]"></span>
          <span className="text-xs text-foreground">Neutral</span>
        </div>
      </div>
    </div>
  );
};

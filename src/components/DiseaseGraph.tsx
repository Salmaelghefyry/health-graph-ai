import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { forceSimulation, forceLink, forceManyBody, forceCenter, Simulation } from 'd3-force';
import { NodeDetails } from './NodeDetails';

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
  type: 'progression' | 'comorbidity' | 'risk' | 'symptom_of';
}

interface DiseaseGraphProps {
  activeConditions: string[];
  onNodeSelect?: (node: DiseaseNode) => void;
}

// Graph will be loaded from public data file
const diseaseNodes: DiseaseNode[] = [];
const diseaseEdges: DiseaseEdge[] = [];

// We'll load real graph data (disease/symptom graph) at runtime from `/data/disease_symptom_graph.json`


export const DiseaseGraph = ({ activeConditions, onNodeSelect }: DiseaseGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<DiseaseNode[]>([]);
  const [edges, setEdges] = useState<DiseaseEdge[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const { t } = useLanguage();
  const graphT = (t.graph as any);
  const simRef = useRef<Simulation<any, any> | null>(null);
  const nodesMutableRef = useRef<any[]>([]);

  // Diagnostics / status
  const [graphStatus, setGraphStatus] = useState<'loading'|'ready'|'error'>('loading');
  const [nodeCount, setNodeCount] = useState(0);
  const [edgeCount, setEdgeCount] = useState(0);
  const [graphError, setGraphError] = useState<string | null>(null);

  // Load graph from public JSON and compute layout
  useEffect(() => {
    let mounted = true;
    setGraphStatus('loading');
    setGraphError(null);
    (async () => {
      try {
        const res = await fetch('/data/disease_symptom_graph.json');
        if (!res.ok) throw new Error('Failed to fetch graph JSON');
        const graph = await res.json();

        // Separate diseases and symptoms
        const diseaseNodesRaw = Array.isArray(graph.nodes) ? graph.nodes.filter((n: any) => n.category === 'disease') : [];
        const symptomNodesRaw = Array.isArray(graph.nodes) ? graph.nodes.filter((n: any) => n.category === 'symptom') : [];

        // Compute deterministic layout
        const w = 800, h = 600;
        const diseaseCount = diseaseNodesRaw.length;
        const symptomCount = symptomNodesRaw.length;

        const positionedDiseases: DiseaseNode[] = diseaseNodesRaw.map((d: any, i: number) => ({
          id: d.id,
          name: d.name,
          x: Math.round(120 + (i / Math.max(1, diseaseCount - 1)) * 240), // left area
          y: Math.round(80 + (i / Math.max(1, diseaseCount - 1)) * (h - 160)),
          risk: 'neutral',
          active: false,
          size: 36
        }));

        const positionedSymptoms: DiseaseNode[] = symptomNodesRaw.map((s: any, idx: number) => ({
          id: s.id,
          name: s.name,
          x: Math.round(420 + ((idx % 6) / 5) * 320),
          y: Math.round(60 + Math.floor(idx / 6) * 80),
          risk: 'neutral',
          active: false,
          size: 24
        }));

        // Map edges
        const positionedEdges: DiseaseEdge[] = Array.isArray(graph.edges) ? graph.edges.map((e: any) => ({
          source: e.source,
          target: e.target,
          weight: e.weight ?? 1,
          type: (e.type as DiseaseEdge['type']) || 'risk'
        })) : [];

        if (!mounted) return;
        setNodes([...positionedDiseases, ...positionedSymptoms]);
        setEdges(positionedEdges);

        // Diagnostics
        setNodeCount((positionedDiseases.length + positionedSymptoms.length));
        setEdgeCount(positionedEdges.length);
        setGraphStatus('ready');
        console.log('Graph loaded:', positionedDiseases.length + positionedSymptoms.length, 'nodes,', positionedEdges.length, 'edges');
      } catch (err: any) {
        console.error('Error loading graph:', err);
        if (!mounted) return;
        setGraphStatus('error');
        setGraphError(String(err?.message ?? err));
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Calculate risk levels based on active conditions and symptom overlap
  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) return;

    // Map disease -> set of symptom ids
    const diseaseToSymptoms = new Map<string, Set<string>>();
    edges.forEach(e => {
      // edges are disease -> symptom in this dataset
      if (!diseaseToSymptoms.has(e.source)) diseaseToSymptoms.set(e.source, new Set());
      diseaseToSymptoms.get(e.source)!.add(e.target);
    });

    // Build set of symptoms associated with active conditions
    const activeSymptoms = new Set<string>();
    activeConditions.forEach(ac => {
      (diseaseToSymptoms.get(ac) || new Set()).forEach(s => activeSymptoms.add(s));
    });

    const updatedNodes = nodes.map(node => {
      const isActive = activeConditions.includes(node.id);
      let risk: 'high' | 'medium' | 'low' | 'neutral' = 'neutral';

      if (node.id && node.name && node.size >= 36) {
        // Treat large nodes as diseases (we assigned size accordingly)
      }

      // If node is a disease
      const isDisease = !!diseaseToSymptoms.get(node.id);
      if (isDisease) {
        if (isActive) {
          risk = 'high';
        } else {
          // Compute symptom overlap ratio between disease symptoms and activeSymptoms
          const syms = diseaseToSymptoms.get(node.id) || new Set();
          if (syms.size > 0) {
            const overlap = [...syms].filter(s => activeSymptoms.has(s)).length;
            const ratio = overlap / syms.size;
            if (ratio >= 0.5) risk = 'high';
            else if (ratio >= 0.2) risk = 'medium';
            else if (ratio > 0) risk = 'low';
            else risk = 'neutral';
          }
        }
      } else {
        // symptom node: mark as low/medium/high if connected to any active disease
        const connectedFromActive = edges.some(e => e.target === node.id && activeConditions.includes(e.source));
        if (connectedFromActive) risk = 'low';
      }

      return { ...node, active: isActive, risk };
    });

    setNodes(updatedNodes);
  }, [activeConditions, nodes, edges]);

  // Force-directed simulation: create when nodes/edges are loaded
  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) return;

    // Create shallow mutable copies for the simulation to mutate
    const simNodes = nodes.map(n => ({ ...n }));
    const simLinks = edges.map(e => ({ source: e.source, target: e.target, weight: e.weight }));
    nodesMutableRef.current = simNodes;

    // Clean up existing simulation
    if (simRef.current) {
      simRef.current.stop();
      simRef.current = null;
    }

    const sim = forceSimulation(simNodes as any)
      .force('link', forceLink(simLinks as any).id((d: any) => d.id).distance((d: any) => 120 - ((d.weight || 0) * 30)))
      .force('charge', forceManyBody().strength(-200))
      .force('center', forceCenter(400, 300))
      .alphaTarget(0.3)
      .on('tick', () => {
        // Copy positions back to React state periodically
        setNodes(simNodes.map(n => ({ ...n })));
      });

    simRef.current = sim;

    return () => {
      sim.stop();
      simRef.current = null;
    };
  }, [nodes.length, edges.length]);

  // Pointer dragging handlers using SVG coordinate transforms
  const handlePointerDown = (evt: React.PointerEvent, node: any) => {
    const svg = svgRef.current;
    if (!svg || !simRef.current) return;
    (evt.target as Element).setPointerCapture(evt.pointerId);
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const cursor = pt.matrixTransform((svg as any).getScreenCTM().inverse());
    // find the simulation node and fix its position
    const simNode = nodesMutableRef.current.find((n: any) => n.id === node.id);
    if (!simNode) return;
    simNode.fx = cursor.x;
    simNode.fy = cursor.y;
    simRef.current!.alphaTarget(0.3).restart();
  };

  const handlePointerMove = (evt: React.PointerEvent, node: any) => {
    const svg = svgRef.current;
    if (!svg || !simRef.current) return;
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const cursor = pt.matrixTransform((svg as any).getScreenCTM().inverse());
    const simNode = nodesMutableRef.current.find((n: any) => n.id === node.id);
    if (!simNode || simNode.fx === undefined) return;
    simNode.fx = cursor.x;
    simNode.fy = cursor.y;
  };

  const handlePointerUp = (evt: React.PointerEvent, node: any) => {
    const svg = svgRef.current;
    if (!svg || !simRef.current) return;
    try { (evt.target as Element).releasePointerCapture(evt.pointerId); } catch {}
    const simNode = nodesMutableRef.current.find((n: any) => n.id === node.id);
    if (!simNode) return;
    // let node float naturally
    simNode.fx = null;
    simNode.fy = null;
    simRef.current.alphaTarget(0);
  };


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
        {edges.map((edge, index) => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          const isActive = activeConditions.includes(edge.source);
          const opacity = isActive ? 0.8 : 0.3;
          const strokeWidth = isActive ? edge.weight * 3 + 1 : 1;

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
              onPointerDown={(e) => handlePointerDown(e, node)}
              onPointerMove={(e) => handlePointerMove(e, node)}
              onPointerUp={(e) => handlePointerUp(e, node)}
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
                fill={getRiskColor(node.risk, false, false)}
                fontSize="12"
                fontWeight="600"
                className="pointer-events-none font-display"
              >
                {((t as any).diseases?.[node.id] || node.name)}
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
                  {node.risk === 'high' ? t.predictions.high : node.risk === 'medium' ? t.predictions.medium : t.predictions.low}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Status overlay */}
      <div className="absolute top-4 right-4 glass-effect rounded-lg p-3 space-y-2 text-xs text-foreground">
        <div className="flex items-center justify-between gap-4">
          <strong className="text-sm">{graphT.status}</strong>
          <span>{graphStatus.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{graphT.nodesLabel}:</span>
          <span className="font-medium">{nodeCount}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{graphT.edgesLabel}:</span>
          <span className="font-medium">{edgeCount}</span>
        </div>
        {graphStatus === 'error' && (
          <div className="text-destructive text-xs">{graphT.errorLabel}: {graphError}</div>
        )}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 glass-effect rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{t.predictions.riskLevel}</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--risk-high)/0.5)]"></span>
          <span className="text-xs text-foreground">{t.predictions.high}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-warning shadow-[0_0_8px_hsl(var(--warning)/0.5)]"></span>
          <span className="text-xs text-foreground">{t.predictions.medium}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success)/0.5)]"></span>
          <span className="text-xs text-foreground">{t.predictions.low}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.5)]"></span>
          <span className="text-xs text-foreground">{graphT.neutralLabel}</span>
        </div>
      </div>
      {/* Node details panel when a node is selected */}
      {selectedNode && (() => {
        const node = nodes.find(n => n.id === selectedNode);
        if (!node) return null;
        const localizedNode = { ...node, name: ((t as any).diseases?.[node.id] || node.name) };
        return <NodeDetails node={localizedNode} onClose={() => setSelectedNode(null)} />;
      })()}
    </div>
  );
};

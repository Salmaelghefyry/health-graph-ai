import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface Props {
  node: any | null;
  onClose: () => void;
}

export const NodeDetails: React.FC<Props> = ({ node, onClose }) => {
  const { t } = useLanguage();
  if (!node) return null;

  return (
    <aside className="fixed right-6 top-24 z-50 w-80 bg-background/90 border border-border rounded-xl p-4 glass-effect">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold">{node.name}</h4>
        <button onClick={onClose} className="text-muted-foreground">×</button>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        <p><strong>{t.graph.nodesLabel}:</strong> {node.id}</p>
        {node.risk && (<p><strong>{t.predictions.riskLevel}:</strong> {(node.risk === 'high' ? t.predictions.high : node.risk === 'medium' ? t.predictions.medium : t.predictions.low)}</p>)}
        {node.category && (<p><strong>Category:</strong> {node.category}</p>)}
        {node.details && (<p className="mt-2">{node.details}</p>)}
      </div>
    </aside>
  );
};

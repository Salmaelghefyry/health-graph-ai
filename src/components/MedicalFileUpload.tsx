import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, FileImage, Activity, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FileAnalysis {
  imageType: string;
  findings: string[];
  cardiovascularIndicators: {
    detected: boolean;
    details: string[];
  };
  riskFactors: string[];
  abnormalities: string[];
  confidence: 'low' | 'medium' | 'high';
  recommendations: string[];
  summary: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'analyzing' | 'analyzed' | 'error';
  analysis?: FileAnalysis;
  error?: string;
}

interface MedicalFileUploadProps {
  onAnalysisComplete?: (files: UploadedFile[]) => void;
}

export const MedicalFileUpload = ({ onAnalysisComplete }: MedicalFileUploadProps) => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File): Promise<UploadedFile> => {
    const id = Math.random().toString(36).substring(7);
    const preview = URL.createObjectURL(file);
    
    return {
      id,
      file,
      preview,
      status: 'pending'
    };
  };

  const analyzeFile = async (uploadedFile: UploadedFile) => {
    // Require authenticated user before analyzing
    if (!user) {
      toast.error(t.upload.signInToAnalyze);
      navigate('/auth');
      setFiles(prev => prev.map(f => f.id === uploadedFile.id ? { ...f, status: 'pending' } : f));
      return;
    }

    setFiles(prev => prev.map(f => 
      f.id === uploadedFile.id ? { ...f, status: 'analyzing' as const } : f
    ));

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(uploadedFile.file);
      });

      const { data, error } = await supabase.functions.invoke('analyze-medical-file', {
        body: {
          imageBase64: base64,
          fileType: uploadedFile.file.type,
          language
        }
      });

      if (error) throw error;

      setFiles(prev => {
        const updated = prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'analyzed' as const, analysis: data.analysis } 
            : f
        );
        onAnalysisComplete?.(updated.filter(f => f.status === 'analyzed'));
        return updated;
      });

      toast.success(t.upload.analyzed);
    } catch (error) {
      console.error('Analysis error:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'error' as const, error: 'Failed to analyze file' } 
          : f
      ));
      toast.error(t.common.error);
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter(f => 
      f.type.startsWith('image/') || f.type === 'application/pdf'
    );
    
    const processedFiles = await Promise.all(imageFiles.map(processFile));
    setFiles(prev => [...prev, ...processedFiles]);
    
    // Auto-analyze each file only when signed in
    if (user) {
      processedFiles.forEach(file => analyzeFile(file));
    } else {
      toast.error(t.upload.signInToAnalyze);
      navigate('/auth');
    }
  }, [language]);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const processedFiles = await Promise.all(selectedFiles.map(processFile));
    setFiles(prev => [...prev, ...processedFiles]);
    
    // Auto-analyze each file only when signed in
    if (user) {
      processedFiles.forEach(file => analyzeFile(file));
    } else {
      toast.error(t.upload.signInToAnalyze);
      navigate('/auth');
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      onAnalysisComplete?.(updated.filter(f => f.status === 'analyzed'));
      return updated;
    });
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-success';
      case 'medium': return 'text-warning';
      case 'low': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileImage className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg">{t.upload.title}</h3>
          <p className="text-sm text-muted-foreground">{t.upload.description}</p>
        </div>
      </div>

      {!user && (
        <div className="p-3 bg-warning/10 rounded-md mb-3 flex items-center justify-between">
          <p className="text-sm text-warning">{t.upload.signInToAnalyze}</p>
          <Button size="sm" onClick={() => navigate('/auth')}>{t.dashboard.signIn}</Button>
        </div>
      )},

      {/* Dropzone */}
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary/10 scale-[1.02]' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }
        `}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
        <p className="text-foreground font-medium mb-1">
          {isDragging ? t.upload.dragActive : t.upload.dropzone}
        </p>
        <p className="text-sm text-muted-foreground">
          {t.upload.supportedFormats}: {t.upload.images}, {t.upload.ecg}
        </p>
      </label>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map(file => (
            <div
              key={file.id}
              className="glass-effect rounded-lg p-4 animate-fade-in-up"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {file.file.type.startsWith('image/') ? (
                    <img 
                      src={file.preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileImage className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{file.file.name}</p>
                    {file.status === 'analyzing' && (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                    {file.status === 'analyzed' && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {file.status === 'analyzing' && t.upload.analyzing}
                    {file.status === 'analyzed' && file.analysis?.imageType}
                    {file.status === 'error' && file.error}
                    {file.status === 'pending' && 'Pending...'}
                  </p>

                  {/* Analysis summary */}
                  {file.status === 'analyzed' && file.analysis && (
                    <div className="mt-3 space-y-2">
                      <p className="text-sm">
                        <span className={`font-medium ${getConfidenceColor(file.analysis.confidence)}`}>
                          {file.analysis.confidence.toUpperCase()}
                        </span>
                        {' '}&middot;{' '}
                        {(() => {
                          const raw = file.analysis.summary || '';
                          // Remove markdown fences and excessive whitespace
                          return raw.replace(/```(?:json)?\s*/gi, '').replace(/```/g, '').trim();
                        })()}
                      </p>
                      
                      {file.analysis.cardiovascularIndicators.detected && (
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="w-4 h-4 text-destructive" />
                          <span className="text-destructive font-medium">
                            {file.analysis.cardiovascularIndicators.details.length} cardiovascular indicator(s) detected
                          </span>
                        </div>
                      )}
                      
                      {file.analysis.riskFactors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {file.analysis.riskFactors.slice(0, 3).map((factor, i) => (
                            <span 
                              key={i}
                              className="px-2 py-0.5 text-xs bg-white text-foreground border border-border rounded shadow-sm"
                            >
                              {factor}
                            </span>
                          ))}
                          {file.analysis.riskFactors.length > 3 && (
                            <span className="px-2 py-0.5 text-xs bg-white text-foreground border border-border rounded shadow-sm">
                              +{file.analysis.riskFactors.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.id)}
                  className="shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

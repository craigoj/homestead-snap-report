import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  X, 
  RefreshCw, 
  Eye,
  Loader2
} from 'lucide-react';

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  progress?: number;
  error?: string;
  estimatedTime?: number;
  startTime?: number;
}

export interface ProcessingStatusProps {
  title: string;
  steps: ProcessingStep[];
  currentStep?: string;
  canCancel?: boolean;
  canRetry?: boolean;
  showDetails?: boolean;
  onCancel?: () => void;
  onRetry?: () => void;
  onToggleDetails?: () => void;
}

export function ProcessingStatus({
  title,
  steps,
  currentStep,
  canCancel = false,
  canRetry = false,
  showDetails = true,
  onCancel,
  onRetry,
  onToggleDetails
}: ProcessingStatusProps) {
  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.filter(step => step.status !== 'skipped').length;
  const overallProgress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  
  const hasFailures = steps.some(step => step.status === 'failed');
  const isProcessing = steps.some(step => step.status === 'processing');
  const isCompleted = completedSteps === totalSteps && !isProcessing;

  const getStatusIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'skipped':
        return <X className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-destructive';
      case 'processing':
        return 'bg-blue-500';
      case 'skipped':
        return 'bg-muted';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getTimeEstimate = (step: ProcessingStep) => {
    if (!step.estimatedTime) return null;
    
    if (step.status === 'processing' && step.startTime) {
      const elapsed = Date.now() - step.startTime;
      const remaining = Math.max(0, step.estimatedTime - elapsed);
      return `${Math.ceil(remaining / 1000)}s remaining`;
    }
    
    return `~${Math.ceil(step.estimatedTime / 1000)}s`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            {onToggleDetails && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleDetails}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            )}
            
            {canRetry && hasFailures && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRetry}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
            
            {canCancel && isProcessing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onCancel}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedSteps} of {totalSteps} steps completed
            </span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">
                      {step.label}
                    </span>
                    
                    {step.id === currentStep && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  {step.status === 'processing' && typeof step.progress === 'number' && (
                    <Progress value={step.progress} className="h-1 mt-1" />
                  )}
                  
                  {step.error && (
                    <p className="text-xs text-destructive mt-1">{step.error}</p>
                  )}
                  
                  {getTimeEstimate(step) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {getTimeEstimate(step)}
                    </p>
                  )}
                </div>
                
                <div className="flex-shrink-0">
                  <div 
                    className={`w-2 h-8 rounded-full ${getStatusColor(step.status)}`}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {isCompleted && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  All steps completed successfully!
                </span>
              </div>
            </div>
          )}
          
          {hasFailures && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800 dark:text-red-200">
                    Some steps failed
                  </span>
                </div>
                
                {canRetry && onRetry && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onRetry}
                    className="text-red-700 border-red-300 hover:bg-red-50"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Retry Failed
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
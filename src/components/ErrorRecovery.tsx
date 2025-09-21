import React from 'react';
import { AlertTriangle, RefreshCw, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export interface RecoveryAction {
  id: string;
  label: string;
  description?: string;
  action: () => Promise<void> | void;
  primary?: boolean;
  destructive?: boolean;
  icon?: React.ReactNode;
}

export interface ErrorRecoveryProps {
  title: string;
  message: string;
  errorCode?: string;
  actions: RecoveryAction[];
  canRetry?: boolean;
  retryCount?: number;
  maxRetries?: number;
  fallbackData?: any;
  onRetry?: () => void;
  onDismiss?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

export function ErrorRecovery({
  title,
  message,
  errorCode,
  actions,
  canRetry = false,
  retryCount = 0,
  maxRetries = 3,
  fallbackData,
  onRetry,
  onDismiss,
  severity = 'error'
}: ErrorRecoveryProps) {
  const [isExecuting, setIsExecuting] = React.useState<string | null>(null);

  const executeAction = async (action: RecoveryAction) => {
    setIsExecuting(action.id);
    try {
      await action.action();
    } catch (error) {
      console.error('Recovery action failed:', error);
    } finally {
      setIsExecuting(null);
    }
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50';
      case 'info':
        return 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50';
      default:
        return 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50';
    }
  };

  const getSeverityIcon = () => {
    switch (severity) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
    }
  };

  return (
    <Card className={`w-full ${getSeverityColor()}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {getSeverityIcon()}
          {title}
          {errorCode && (
            <Badge variant="outline" className="ml-auto text-xs">
              {errorCode}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription className="text-sm">
            {message}
          </AlertDescription>
        </Alert>

        {canRetry && retryCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            <span>
              Attempted {retryCount} of {maxRetries} retries
            </span>
          </div>
        )}

        {fallbackData && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Using fallback data to continue operation. Some features may be limited.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recovery Options:</h4>
          
          <div className="grid gap-2">
            {actions.map((action) => (
              <Button
                key={action.id}
                variant={action.primary ? 'default' : action.destructive ? 'destructive' : 'outline'}
                size="sm"
                className="justify-start h-auto p-3"
                onClick={() => executeAction(action)}
                disabled={isExecuting !== null}
              >
                <div className="flex items-center gap-3 w-full">
                  {isExecuting === action.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    action.icon || <ArrowRight className="h-4 w-4" />
                  )}
                  <div className="flex-1 text-left">
                    <div className="font-medium">
                      {isExecuting === action.id ? 'Processing...' : action.label}
                    </div>
                    {action.description && (
                      <div className="text-xs opacity-80 mt-1">
                        {action.description}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {canRetry && onRetry && retryCount < maxRetries && (
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={onRetry}
              disabled={isExecuting !== null}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again ({maxRetries - retryCount} attempts remaining)
            </Button>
          )}
        </div>

        {onDismiss && (
          <div className="flex justify-end pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              disabled={isExecuting !== null}
            >
              Dismiss
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
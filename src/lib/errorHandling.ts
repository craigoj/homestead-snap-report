import { supabase } from "@/integrations/supabase/client";

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryCondition?: (error: any) => boolean;
}

export interface ErrorLogEntry {
  error_type: string;
  error_message: string;
  error_context: Record<string, any>;
  retry_count: number;
}

export class RetryableError extends Error {
  constructor(message: string, public isRetryable: boolean = true) {
    super(message);
    this.name = 'RetryableError';
  }
}

export class CircuitBreakerError extends Error {
  constructor(service: string) {
    super(`Circuit breaker open for service: ${service}`);
    this.name = 'CircuitBreakerError';
  }
}

// Circuit Breaker implementation
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private resetTimeout: number = 30000
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'half-open';
      } else {
        throw new CircuitBreakerError('Service temporarily unavailable');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Global circuit breakers
const circuitBreakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(service: string): CircuitBreaker {
  if (!circuitBreakers.has(service)) {
    circuitBreakers.set(service, new CircuitBreaker());
  }
  return circuitBreakers.get(service)!;
}

// Exponential backoff with jitter
export function calculateDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = Math.min(
    config.baseDelay * Math.pow(2, attempt),
    config.maxDelay
  );
  
  // Add jitter to prevent thundering herd
  const jitter = exponentialDelay * 0.1 * Math.random();
  return Math.floor(exponentialDelay + jitter);
}

// Default retry condition - retry on network errors and 5xx status codes
export function defaultRetryCondition(error: any): boolean {
  if (error instanceof CircuitBreakerError) return false;
  if (error?.name === 'AbortError') return false;
  if (error?.status >= 400 && error?.status < 500) return false; // Don't retry client errors
  return true; // Retry network errors and 5xx errors
}

// Main retry function with circuit breaker
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    retryCondition: defaultRetryCondition
  },
  serviceName?: string
): Promise<T> {
  const circuitBreaker = serviceName ? getCircuitBreaker(serviceName) : null;
  
  const executeWithCircuitBreaker = circuitBreaker 
    ? () => circuitBreaker.execute(operation)
    : operation;

  let lastError: any;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await executeWithCircuitBreaker();
    } catch (error) {
      lastError = error;
      
      // Don't retry if condition fails or it's the last attempt
      if (!config.retryCondition?.(error) || attempt === config.maxRetries) {
        break;
      }
      
      const delay = calculateDelay(attempt, config);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// Error logging utility
export async function logError(
  errorType: string,
  error: any,
  context: Record<string, any> = {},
  retryCount: number = 0
): Promise<void> {
  try {
    await supabase.from('error_logs').insert({
      error_type: errorType,
      error_message: error?.message || String(error),
      error_context: {
        ...context,
        stack: error?.stack,
        timestamp: new Date().toISOString()
      },
      retry_count: retryCount
    });
  } catch (logError) {
    // Fallback to console if logging fails
    console.error('Failed to log error:', logError);
    console.error('Original error:', error);
  }
}

// Enhanced error types
export enum ErrorType {
  NETWORK = 'network',
  OCR = 'ocr',
  UPLOAD = 'upload',
  VALIDATION = 'validation',
  BARCODE = 'barcode',
  AI_VALUATION = 'ai_valuation',
  DATABASE = 'database'
}

// Error recovery strategies
export interface RecoveryAction {
  label: string;
  action: () => Promise<void> | void;
  primary?: boolean;
}

export interface ErrorRecoveryOptions {
  title: string;
  message: string;
  actions: RecoveryAction[];
  canRetry?: boolean;
  fallbackData?: any;
}

// Service health monitoring
class ServiceHealthMonitor {
  private healthStatus = new Map<string, { isHealthy: boolean; lastCheck: number }>();
  
  async checkHealth(service: string, healthCheck: () => Promise<boolean>): Promise<boolean> {
    const now = Date.now();
    const cached = this.healthStatus.get(service);
    
    // Return cached result if checked within last 30 seconds
    if (cached && now - cached.lastCheck < 30000) {
      return cached.isHealthy;
    }
    
    try {
      const isHealthy = await healthCheck();
      this.healthStatus.set(service, { isHealthy, lastCheck: now });
      return isHealthy;
    } catch {
      this.healthStatus.set(service, { isHealthy: false, lastCheck: now });
      return false;
    }
  }
  
  getServiceStatus(service: string): boolean | null {
    const status = this.healthStatus.get(service);
    return status?.isHealthy ?? null;
  }
}

export const serviceHealthMonitor = new ServiceHealthMonitor();

// Graceful degradation helpers
export function withFallback<T>(
  primaryOperation: () => Promise<T>,
  fallbackOperation: () => Promise<T> | T,
  fallbackCondition?: (error: any) => boolean
) {
  return async (): Promise<T> => {
    try {
      return await primaryOperation();
    } catch (error) {
      if (fallbackCondition && !fallbackCondition(error)) {
        throw error;
      }
      
      console.warn('Primary operation failed, using fallback:', error);
      return await fallbackOperation();
    }
  };
}

// Operation queue for background tasks
export class OperationQueue {
  private queue: Array<{
    id: string;
    operation: () => Promise<any>;
    retryConfig?: RetryConfig;
    onSuccess?: (result: any) => void;
    onError?: (error: any) => void;
  }> = [];
  
  private processing = false;
  
  async add<T>(
    id: string,
    operation: () => Promise<T>,
    options?: {
      retryConfig?: RetryConfig;
      onSuccess?: (result: T) => void;
      onError?: (error: any) => void;
    }
  ): Promise<void> {
    this.queue.push({
      id,
      operation,
      retryConfig: options?.retryConfig,
      onSuccess: options?.onSuccess,
      onError: options?.onError
    });
    
    if (!this.processing) {
      this.processQueue();
    }
  }
  
  private async processQueue() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      
      try {
        const result = task.retryConfig 
          ? await withRetry(task.operation, task.retryConfig)
          : await task.operation();
          
        task.onSuccess?.(result);
      } catch (error) {
        task.onError?.(error);
        await logError('queue_operation', error, { taskId: task.id });
      }
    }
    
    this.processing = false;
  }
  
  getQueueSize(): number {
    return this.queue.length;
  }
}

export const globalOperationQueue = new OperationQueue();
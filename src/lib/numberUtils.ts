/**
 * Utility functions for safe numeric handling to prevent database overflow errors
 */

const MAX_MONEY_VALUE = 999999999; // PostgreSQL numeric safe limit
const MAX_CONFIDENCE = 100;

/**
 * Parse and sanitize a money input string
 * Strips currency symbols, commas, whitespace
 * Rejects scientific notation, NaN, Infinity
 * Clamps to [0, 999,999,999] and rounds to 2 decimal places
 * 
 * @param input - Raw string input from user
 * @returns Sanitized number or null if invalid
 */
export function parseMoney(input: string | number): number | null {
  if (typeof input === 'number') {
    input = input.toString();
  }
  
  if (!input || input.trim() === '') {
    return null;
  }

  // Strip currency symbols, commas, and whitespace
  const cleaned = input.replace(/[$,\s]/g, '');
  
  // Reject scientific notation
  if (cleaned.toLowerCase().includes('e')) {
    return null;
  }
  
  const val = parseFloat(cleaned);
  
  if (!isFiniteNumber(val) || val < 0) {
    return null;
  }
  
  // Clamp to safe range
  const clamped = Math.min(val, MAX_MONEY_VALUE);
  
  // Round to 2 decimal places
  return Math.round(clamped * 100) / 100;
}

/**
 * Check if a value is a finite number (not NaN or Infinity)
 */
export function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && isFinite(n);
}

/**
 * Parse and sanitize a confidence percentage (0-100)
 * 
 * @param input - Confidence value (can be 0-1 or 0-100)
 * @returns Sanitized number between 0-100 or null if invalid
 */
export function parseConfidence(input: number | null | undefined): number | null {
  if (input === null || input === undefined) {
    return null;
  }
  
  if (!isFiniteNumber(input)) {
    return null;
  }
  
  // If value is between 0-1, convert to percentage
  const normalized = input <= 1 ? input * 100 : input;
  
  // Clamp to 0-100
  const clamped = Math.min(Math.max(normalized, 0), MAX_CONFIDENCE);
  
  // Round to 2 decimal places
  return Math.round(clamped * 100) / 100;
}

/**
 * Format a number as currency for display
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

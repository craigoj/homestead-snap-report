/**
 * SSR-safe localStorage utility
 *
 * Provides safe access to localStorage that works in both client and server contexts.
 * Returns null/does nothing when running on the server (SSR).
 */

const isBrowser = typeof window !== 'undefined';

export const safeLocalStorage = {
  /**
   * Get an item from localStorage
   * @param key The key to retrieve
   * @returns The stored value or null if not found/SSR context
   */
  getItem(key: string): string | null {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  /**
   * Set an item in localStorage
   * @param key The key to store
   * @param value The value to store
   */
  setItem(key: string, value: string): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
    }
  },

  /**
   * Remove an item from localStorage
   * @param key The key to remove
   */
  removeItem(key: string): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    if (!isBrowser) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage', error);
    }
  }
};

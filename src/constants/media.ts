/**
 * Media API configuration constants
 */
export const MEDIA_API_CONFIG = {
  /**
   * Timeout for media creation API calls (in milliseconds)
   * Set to 120 seconds for AI image generation processes
   */
  TIMEOUT: 120000,

  /**
   * Number of retry attempts for media creation API calls
   * Reduced to 1 for time-intensive AI operations
   */
  RETRIES: 1,
} as const;

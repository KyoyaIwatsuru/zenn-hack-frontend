/**
 * API configuration constants for different endpoints
 */

/**
 * Media API configuration
 * Used for AI image generation processes
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

/**
 * Word search API configuration
 * Used for word lookup and dictionary operations
 */
export const WORD_API_CONFIG = {
  /**
   * Timeout for word search API calls (in milliseconds)
   * Set to 15 seconds for quick dictionary lookups
   */
  TIMEOUT: 15000,

  /**
   * Number of retry attempts for word search API calls
   * Set to 1 for reliable word lookup operations
   */
  RETRIES: 1,
} as const;

/**
 * Flashcard creation API configuration
 * Used for creating new flashcards with AI-generated content
 */
export const FLASHCARD_CREATE_API_CONFIG = {
  /**
   * Timeout for flashcard creation API calls (in milliseconds)
   * Set to 90 seconds for AI content generation processes
   */
  TIMEOUT: 90000,

  /**
   * Number of retry attempts for flashcard creation API calls
   * Set to 2 for AI-intensive operations
   */
  RETRIES: 1,
} as const;

/**
 * User flashcard management API configuration
 * Used for adding flashcards to user collections
 */
export const USER_FLASHCARD_API_CONFIG = {
  /**
   * Timeout for user flashcard operations (in milliseconds)
   * Set to 30 seconds for database operations
   */
  TIMEOUT: 30000,

  /**
   * Number of retry attempts for user flashcard operations
   * Set to 3 for reliable database operations
   */
  RETRIES: 1,
} as const;

/**
 * Default API configuration
 * Used as fallback for endpoints without specific configuration
 */
export const DEFAULT_API_CONFIG = {
  /**
   * Default timeout for API calls (in milliseconds)
   */
  TIMEOUT: 30000,

  /**
   * Default number of retry attempts
   */
  RETRIES: 1,
} as const;

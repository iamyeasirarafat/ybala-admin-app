/**
 * Extract error messages from various API error formats
 * Handles multiple formats:
 * 1. Object with array values: { "customer_email": ["Enter a valid email address."] }
 * 2. Object with string values: { "error": "Something went wrong" }
 * 3. Simple string: "Error message"
 * 4. Array of strings: ["Error 1", "Error 2"]
 */
export function extractErrorMessage(error: any): string {
  // If error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // If error is an array, join the messages
  if (Array.isArray(error)) {
    return error.join(', ');
  }

  // If error is an object (most common API error format)
  if (error && typeof error === 'object') {
    const messages: string[] = [];

    Object.keys(error).forEach((key) => {
      const value = error[key];

      // If value is an array, extract all messages
      if (Array.isArray(value)) {
        const fieldMessages = value.join(', ');
        const formattedKey = key
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        messages.push(`${formattedKey}: ${fieldMessages}`);
      } else if (typeof value === 'string') {
        const formattedKey = key
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        messages.push(`${formattedKey}: ${value}`);
      } else if (value && typeof value === 'object') {
        // Recursively extract nested errors
        messages.push(extractErrorMessage(value));
      }
    });

    return messages.length > 0 ? messages.join('; ') : 'An error occurred';
  }

  return 'An error occurred';
}

/**
 * Extract API error from axios error response
 * Works with the standard error structure from API calls
 */
export function extractApiError(error: any, fallbackMessage: string = 'An error occurred'): string {
  if (error?.response?.data) {
    const data = error.response.data;

    if (data.message) {
      return typeof data.message === 'string' ? data.message : extractErrorMessage(data.message);
    }

    // 'detail' is common in Django REST Framework
    if (data.detail) {
      return typeof data.detail === 'string' ? data.detail : extractErrorMessage(data.detail);
    }

    if (data.error) {
      return typeof data.error === 'string' ? data.error : extractErrorMessage(data.error);
    }

    return extractErrorMessage(data);
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
}

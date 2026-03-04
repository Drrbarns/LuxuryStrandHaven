/**
 * Simple HTML sanitizer to prevent XSS attacks
 * For production, consider using a library like DOMPurify
 */

// Allowed HTML tags for content rendering
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'a', 'span', 'div',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'img', 'hr'
];

// Allowed attributes per tag
const ALLOWED_ATTRS: Record<string, string[]> = {
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'width', 'height', 'title'],
  'td': ['colspan', 'rowspan'],
  'th': ['colspan', 'rowspan'],
  '*': ['class', 'id', 'style'] // Global attributes
};

// Patterns to remove (script injection attempts)
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick, onerror, etc.
  /data:/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
];

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  let sanitized = html;

  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Remove any remaining script tags that might have been obfuscated
  sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: and data: URLs from href/src attributes
  sanitized = sanitized.replace(/href\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, 'src=""');
  sanitized = sanitized.replace(/href\s*=\s*["']?\s*data:[^"'>\s]*/gi, 'href="#"');
  
  return sanitized;
}

/**
 * Escape HTML entities to prevent XSS when displaying user input as text
 * @param text - The text to escape
 * @returns Escaped text safe for HTML display
 */
export function escapeHtml(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Validate and sanitize a URL
 * @param url - The URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Only allow http, https, mailto, and tel protocols
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
  
  try {
    const parsed = new URL(url, 'https://example.com');
    if (allowedProtocols.includes(parsed.protocol)) {
      return url;
    }
  } catch {
    // If URL parsing fails, check if it's a relative URL
    if (url.startsWith('/') || url.startsWith('#')) {
      return url;
    }
  }
  
  return '#';
}

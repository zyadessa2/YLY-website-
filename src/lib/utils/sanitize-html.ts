/**
 * HTML Content Sanitizer
 * Provides safe HTML rendering by sanitizing content
 * 
 * Note: For full sanitization, consider using DOMPurify or similar library.
 * This is a basic implementation for server-side rendering.
 */

// Allowed HTML tags for content (reserved for future advanced sanitization)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ALLOWED_TAGS = new Set([
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
  'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'pre', 'code', 'span', 'div', 'hr',
]);

// Allowed attributes for each tag (reserved for future advanced sanitization)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ALLOWED_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  '*': new Set(['class', 'id', 'style']),
};

// Dangerous patterns to remove
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /on\w+\s*=/gi,
  /javascript:/gi,
  /data:/gi,
  /vbscript:/gi,
];

/**
 * Basic HTML sanitizer
 * Removes dangerous elements and attributes
 * @param html - HTML content to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  
  let sanitized = html;
  
  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }
  
  // Remove style tags
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Remove form elements
  sanitized = sanitized.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
  sanitized = sanitized.replace(/<input[^>]*>/gi, '');
  sanitized = sanitized.replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '');
  sanitized = sanitized.replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, '');
  sanitized = sanitized.replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '');
  
  // Remove object/embed elements
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed[^>]*>/gi, '');
  
  return sanitized;
}

/**
 * Strip all HTML tags, leaving only text content
 * @param html - HTML content
 * @returns Plain text without HTML tags
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncate HTML content to a specified length while preserving structure
 * @param html - HTML content
 * @param maxLength - Maximum length of text content
 * @param ellipsis - Ellipsis string to append (default: '...')
 * @returns Truncated HTML or text
 */
export function truncateHtml(
  html: string | null | undefined,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (!html) return '';
  
  // Strip HTML and truncate
  const text = stripHtml(html);
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Find last space before maxLength
  const lastSpace = text.lastIndexOf(' ', maxLength);
  const truncateAt = lastSpace > maxLength * 0.8 ? lastSpace : maxLength;
  
  return text.substring(0, truncateAt).trim() + ellipsis;
}

/**
 * Extract first paragraph from HTML content
 * @param html - HTML content
 * @returns First paragraph text
 */
export function extractFirstParagraph(html: string | null | undefined): string {
  if (!html) return '';
  
  // Match first <p> tag content
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  
  if (match && match[1]) {
    return stripHtml(match[1]);
  }
  
  // If no <p> tag, return first 200 characters
  return truncateHtml(html, 200);
}

/**
 * Check if HTML content is empty (only whitespace or empty tags)
 * @param html - HTML content
 * @returns True if content is empty
 */
export function isHtmlEmpty(html: string | null | undefined): boolean {
  if (!html) return true;
  
  const text = stripHtml(html);
  return text.length === 0;
}

/**
 * Convert plain text to HTML (preserve line breaks)
 * @param text - Plain text
 * @returns HTML with line breaks converted to <br>
 */
export function textToHtml(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}

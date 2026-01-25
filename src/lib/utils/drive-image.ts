/**
 * Google Drive Image URL Converter
 * Converts various Google Drive URL formats to direct viewable URLs
 * 
 * Note: Google Drive images don't work well with Next.js Image optimization.
 * Use with unoptimized={true} prop or consider using lh3.googleusercontent.com format.
 */

/**
 * Convert Google Drive URL to direct image URL using lh3.googleusercontent.com
 * This format works better with Next.js Image optimization
 * 
 * Supports various Drive URL formats:
 * - https://drive.google.com/file/d/{fileId}/view
 * - https://drive.google.com/open?id={fileId}
 * - https://drive.google.com/uc?id={fileId}
 * - https://drive.google.com/d/{fileId}
 */
export function getDriveImageUrl(driveUrl: string | null | undefined): string {
  if (!driveUrl) return '';
  
  // If it's already a direct URL or not a Drive URL, return as-is
  if (!driveUrl.includes('drive.google.com')) {
    return driveUrl;
  }
  
  // Extract file ID from various Drive URL formats
  const fileId = extractDriveFileId(driveUrl);
  
  if (fileId) {
    // Use lh3.googleusercontent.com format which works better with Next.js
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }
  
  // Return original URL if no pattern matched
  return driveUrl;
}

/**
 * Convert Google Drive URL to thumbnail URL with specific size
 * @param driveUrl - Google Drive URL
 * @param size - Thumbnail size (default: 400)
 */
export function getDriveThumbnailUrl(driveUrl: string | null | undefined, size: number = 400): string {
  if (!driveUrl) return '';
  
  // If it's not a Drive URL, return as-is
  if (!driveUrl.includes('drive.google.com')) {
    return driveUrl;
  }
  
  // Extract file ID
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = driveUrl.match(pattern);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w${size}`;
    }
  }
  
  return driveUrl;
}

/**
 * Check if a URL is a Google Drive URL
 */
export function isDriveUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.includes('drive.google.com');
}

/**
 * Extract file ID from Google Drive URL
 */
export function extractDriveFileId(driveUrl: string | null | undefined): string | null {
  if (!driveUrl) return null;
  
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = driveUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

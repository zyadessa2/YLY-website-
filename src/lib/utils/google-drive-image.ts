/**
 * Google Drive Image Converter
 * 
 * Converts Google Drive sharing URLs to direct viewable image URLs
 * that can be displayed in Next.js Image component
 * 
 * @author YLY Team
 * @version 2.0
 */

// =====================================================
// Types
// =====================================================

export interface ImageResult {
  /** The processed image URL ready for display */
  src: string;
  /** Whether the image needs unoptimized mode in Next.js */
  unoptimized: boolean;
  /** Whether this is a Google Drive image */
  isDriveImage: boolean;
}

// =====================================================
// Constants
// =====================================================

/** Default fallback image when no valid image is provided */
export const DEFAULT_FALLBACK_IMAGE = '/images/hero.jpg';

/** Google Drive URL patterns for extraction */
const DRIVE_URL_PATTERNS = [
  /\/file\/d\/([a-zA-Z0-9_-]+)/,           // /file/d/FILE_ID
  /\/d\/([a-zA-Z0-9_-]+)/,                 // /d/FILE_ID  
  /[?&]id=([a-zA-Z0-9_-]+)/,               // ?id=FILE_ID or &id=FILE_ID
  /\/open\?id=([a-zA-Z0-9_-]+)/,           // /open?id=FILE_ID
  /googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/, // googleusercontent.com/d/FILE_ID
];

// =====================================================
// Core Functions
// =====================================================

/**
 * Check if a URL is a Google Drive URL
 * 
 * @param url - The URL to check
 * @returns true if the URL is from Google Drive
 * 
 * @example
 * isGoogleDriveUrl('https://drive.google.com/file/d/abc123/view') // true
 * isGoogleDriveUrl('https://example.com/image.jpg') // false
 */
export function isGoogleDriveUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  return url.includes('drive.google.com') || url.includes('googleusercontent.com');
}

/**
 * Extract file ID from a Google Drive URL
 * 
 * @param url - Google Drive URL in any format
 * @returns The file ID or null if not found
 * 
 * @example
 * extractGoogleDriveFileId('https://drive.google.com/file/d/abc123/view') // 'abc123'
 */
export function extractGoogleDriveFileId(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;

  for (const pattern of DRIVE_URL_PATTERNS) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Convert a Google Drive URL to a direct image URL
 * 
 * This is the main function for converting Drive URLs to displayable images.
 * It handles various Drive URL formats and returns a URL that can be used
 * directly in an img tag or Next.js Image component.
 * 
 * @param driveUrl - Google Drive sharing URL
 * @returns Direct image URL or empty string if invalid
 * 
 * @example
 * convertDriveUrl('https://drive.google.com/file/d/abc123/view')
 * // Returns: 'https://lh3.googleusercontent.com/d/abc123=s1000'
 */
export function convertDriveUrl(driveUrl: string | null | undefined): string {
  if (!driveUrl || typeof driveUrl !== 'string') return '';

  const trimmedUrl = driveUrl.trim();

  // If not a Drive URL, return as-is
  if (!isGoogleDriveUrl(trimmedUrl)) {
    return trimmedUrl;
  }

  // If already converted, return as-is
  if (trimmedUrl.includes('lh3.googleusercontent.com') || 
      trimmedUrl.includes('drive.google.com/thumbnail')) {
    return trimmedUrl;
  }

  // Extract file ID
  const fileId = extractGoogleDriveFileId(trimmedUrl);

  if (!fileId) {
    return trimmedUrl;
  }

  // Use thumbnail format - most reliable for displaying Google Drive images
  // sz=w1000 sets the width to 1000px for good quality
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
}

/**
 * Get a safe image URL with fallback support
 * 
 * This function processes any image URL and ensures it's displayable.
 * If the URL is invalid or empty, it returns the fallback image.
 * 
 * @param imageUrl - The original image URL (can be Drive URL or regular URL)
 * @param fallback - Fallback image URL if the original is invalid
 * @returns A safe, displayable image URL
 * 
 * @example
 * getSafeImageUrl('https://drive.google.com/file/d/abc123/view')
 * // Returns: 'https://lh3.googleusercontent.com/d/abc123=s1000'
 * 
 * getSafeImageUrl(null)
 * // Returns: '/images/hero.jpg'
 */
export function getSafeImageUrl(
  imageUrl: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK_IMAGE
): string {
  if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
    return fallback;
  }

  const trimmedUrl = imageUrl.trim();

  // Handle Google Drive URLs
  if (isGoogleDriveUrl(trimmedUrl)) {
    const converted = convertDriveUrl(trimmedUrl);
    return converted || fallback;
  }

  // Return regular URLs as-is
  return trimmedUrl;
}

/**
 * Get complete image props for Next.js Image component
 * 
 * This is the recommended function to use when rendering images.
 * It returns all necessary props for the Next.js Image component.
 * 
 * @param imageUrl - The original image URL
 * @param fallback - Fallback image URL
 * @returns Object with src, unoptimized, and isDriveImage properties
 * 
 * @example
 * const imageProps = getNextImageProps(news.coverImage);
 * <Image 
 *   src={imageProps.src} 
 *   unoptimized={imageProps.unoptimized}
 *   alt="News"
 *   fill
 * />
 */
export function getNextImageProps(
  imageUrl: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK_IMAGE
): ImageResult {
  const isDriveImage = isGoogleDriveUrl(imageUrl);
  const src = getSafeImageUrl(imageUrl, fallback);

  return {
    src,
    unoptimized: isDriveImage,
    isDriveImage,
  };
}

// =====================================================
// Thumbnail Functions
// =====================================================

/**
 * Get a thumbnail URL for a Google Drive image
 * 
 * @param driveUrl - Google Drive URL
 * @param size - Thumbnail size (small: 200, medium: 400, large: 800)
 * @returns Thumbnail URL
 */
export function getDriveThumbnail(
  driveUrl: string | null | undefined,
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  const sizeMap = {
    small: 200,
    medium: 400,
    large: 800,
  };

  const fileId = extractGoogleDriveFileId(driveUrl);
  
  if (!fileId) {
    return driveUrl || '';
  }

  // Use thumbnail format for better reliability
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${sizeMap[size]}`;
}

// =====================================================
// Export default for convenience
// =====================================================

const DriveImageConverter = {
  isGoogleDriveUrl,
  extractGoogleDriveFileId,
  convertDriveUrl,
  getSafeImageUrl,
  getNextImageProps,
  getDriveThumbnail,
  DEFAULT_FALLBACK_IMAGE,
};

export default DriveImageConverter;

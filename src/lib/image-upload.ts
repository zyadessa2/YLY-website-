/**
 * Image Upload Service - Google Drive Link Handler
 * 
 * This module handles Google Drive image URLs and converts them to direct viewable links.
 * Instead of uploading images to a storage service, users paste Google Drive share links.
 */

export interface ImageUploadResult {
  url: string;
  path: string;
}

/**
 * Google Drive URL patterns
 */
const DRIVE_PATTERNS = [
  /\/file\/d\/([a-zA-Z0-9_-]+)/,       // https://drive.google.com/file/d/FILE_ID/view
  /id=([a-zA-Z0-9_-]+)/,               // https://drive.google.com/open?id=FILE_ID
  /\/d\/([a-zA-Z0-9_-]+)/,             // https://drive.google.com/d/FILE_ID
  /^([a-zA-Z0-9_-]{25,})$/,            // Just the file ID
];

/**
 * Extract file ID from a Google Drive URL
 */
export function extractDriveFileId(driveUrl: string): string | null {
  if (!driveUrl || typeof driveUrl !== 'string') return null;
  
  const trimmedUrl = driveUrl.trim();
  
  for (const pattern of DRIVE_PATTERNS) {
    const match = trimmedUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Convert a Google Drive URL to a direct image URL
 * @param driveUrl - Google Drive sharing URL or file ID
 * @returns Direct viewable URL or original URL if not a Drive URL
 */
export function getDriveImageUrl(driveUrl: string): string {
  if (!driveUrl || typeof driveUrl !== 'string') return '';
  
  const trimmedUrl = driveUrl.trim();
  
  // If it's already a direct URL (not Drive), return as is
  if (!trimmedUrl.includes('drive.google.com') && !trimmedUrl.match(/^[a-zA-Z0-9_-]{25,}$/)) {
    return trimmedUrl;
  }
  
  const fileId = extractDriveFileId(trimmedUrl);
  
  if (fileId) {
    // Return direct view URL
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return trimmedUrl;
}

/**
 * Convert a Google Drive URL to a thumbnail URL (smaller image)
 * @param driveUrl - Google Drive sharing URL or file ID
 * @param size - Thumbnail size (small: 220, medium: 400, large: 800)
 * @returns Thumbnail URL or original URL if not a Drive URL
 */
export function getDriveThumbnailUrl(
  driveUrl: string, 
  size: 'small' | 'medium' | 'large' = 'medium'
): string {
  if (!driveUrl || typeof driveUrl !== 'string') return '';
  
  const fileId = extractDriveFileId(driveUrl);
  
  if (fileId) {
    const sizeMap = {
      small: 220,
      medium: 400,
      large: 800,
    };
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${sizeMap[size]}`;
  }
  
  return driveUrl;
}

/**
 * Validate if a URL is a valid Google Drive link or image URL
 */
export function validateImageUrl(url: string): {
  isValid: boolean;
  error?: string;
  isDriveUrl?: boolean;
} {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmedUrl = url.trim();

  // Check if it's empty
  if (!trimmedUrl) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  // Check if it's a Google Drive URL
  const fileId = extractDriveFileId(trimmedUrl);
  if (fileId) {
    return { isValid: true, isDriveUrl: true };
  }

  // Check if it's a valid HTTP/HTTPS URL
  try {
    const urlObj = new URL(trimmedUrl);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must start with http:// or https://' };
    }
    return { isValid: true, isDriveUrl: false };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Process an image URL - converts Drive URLs to direct links
 * @param url - Image URL (can be Drive link or regular URL)
 * @returns Processed image URL ready for display
 */
export function processImageUrl(url: string): string {
  const validation = validateImageUrl(url);
  
  if (!validation.isValid) {
    return '';
  }
  
  if (validation.isDriveUrl) {
    return getDriveImageUrl(url);
  }
  
  return url;
}

// =====================
// Legacy Compatibility
// =====================
// These functions maintain backward compatibility with the old Supabase-based API

export class ImageUploadService {
  /**
   * @deprecated Use processImageUrl or getDriveImageUrl instead
   * This method now just processes the URL - no actual upload occurs
   */
  static async uploadImage(
    _file: File,
    _bucket: 'news' | 'events',
    _folder?: string
  ): Promise<ImageUploadResult> {
    // Parameters prefixed with _ to indicate they're intentionally unused
    void _file; void _bucket; void _folder;
    throw new Error(
      'Direct file upload is no longer supported. Please use Google Drive links instead. ' +
      'Upload your image to Google Drive, get the share link, and paste it in the image URL field.'
    );
  }

  /**
   * @deprecated No longer needed - images are stored externally
   */
  static async deleteImage(
    _bucket: 'news' | 'events',
    _filePath: string
  ): Promise<void> {
    // No-op - images are stored externally (Google Drive)
    void _bucket; void _filePath;
    console.log('deleteImage called but images are now stored externally');
  }

  /**
   * @deprecated No longer needed
   */
  static extractFilePathFromUrl(
    url: string,
    _bucket: 'news' | 'events'
  ): string | null {
    void _bucket;
    // Return the file ID if it's a Drive URL
    return extractDriveFileId(url);
  }

  /**
   * @deprecated Use processImageUrl instead
   */
  static async updateImage(
    _file: File,
    _bucket: 'news' | 'events',
    _oldImageUrl?: string,
    _folder?: string
  ): Promise<ImageUploadResult> {
    void _file; void _bucket; void _oldImageUrl; void _folder;
    throw new Error(
      'Direct file upload is no longer supported. Please use Google Drive links instead.'
    );
  }
}

/**
 * Helper function to create a preview URL for a File object
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Helper function to revoke a preview URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Validate image file (for local preview only)
 */
export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB for preview

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.',
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Maximum size is 10MB.',
    };
  }

  return { isValid: true };
}

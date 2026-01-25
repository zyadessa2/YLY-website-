/**
 * Utility Functions Index
 * Central export for all utility functions
 */

// Drive Image Utilities
export {
  getDriveImageUrl,
  getDriveThumbnailUrl,
  isDriveUrl,
  extractDriveFileId,
} from './drive-image';

// Date Formatting Utilities
export {
  formatDate,
  formatDateTime,
  formatShortDate,
  timeAgo,
  isEventUpcoming,
  isDeadlinePassed,
  formatTime,
  formatDateRange,
} from './date-format';

// Event Status Utilities
export {
  getEventRegistrationStatus,
  getParticipantsDisplay,
  isDeadlineApproaching,
  getBadgeVariant,
} from './event-status';
export type { EventRegistrationStatus, EventStatusInput } from './event-status';

// HTML Sanitization Utilities
export {
  sanitizeHtml,
  stripHtml,
  truncateHtml,
  extractFirstParagraph,
  isHtmlEmpty,
  textToHtml,
} from './sanitize-html';

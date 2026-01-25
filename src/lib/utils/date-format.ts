/**
 * Date Formatting Utilities
 * Provides consistent date formatting with Arabic/English locale support
 */

/**
 * Format a date to a readable string
 * @param date - Date string or Date object
 * @param locale - Locale ('en' or 'ar')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date | null | undefined, locale: 'en' | 'ar' = 'en'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return dateObj.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', options);
}

/**
 * Format a date with time
 * @param date - Date string or Date object
 * @param locale - Locale ('en' or 'ar')
 * @returns Formatted date and time string
 */
export function formatDateTime(date: string | Date | null | undefined, locale: 'en' | 'ar' = 'en'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  
  return dateObj.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', options);
}

/**
 * Format a date to short format (e.g., Jan 23, 2025)
 * @param date - Date string or Date object
 * @param locale - Locale ('en' or 'ar')
 * @returns Formatted short date string
 */
export function formatShortDate(date: string | Date | null | undefined, locale: 'en' | 'ar' = 'en'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return dateObj.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', options);
}

/**
 * Get relative time (e.g., "2 hours ago", "3 days ago")
 * @param date - Date string or Date object
 * @param locale - Locale ('en' or 'ar')
 * @returns Relative time string
 */
export function timeAgo(date: string | Date | null | undefined, locale: 'en' | 'ar' = 'en'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (locale === 'ar') {
    if (diffSecs < 60) return 'منذ لحظات';
    if (diffMins < 60) return `منذ ${diffMins} ${diffMins === 1 ? 'دقيقة' : 'دقائق'}`;
    if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
    if (diffDays < 7) return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
    if (diffWeeks < 4) return `منذ ${diffWeeks} ${diffWeeks === 1 ? 'أسبوع' : 'أسابيع'}`;
    if (diffMonths < 12) return `منذ ${diffMonths} ${diffMonths === 1 ? 'شهر' : 'أشهر'}`;
    return `منذ ${diffYears} ${diffYears === 1 ? 'سنة' : 'سنوات'}`;
  }
  
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
  if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
  return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
}

/**
 * Check if an event date is in the future
 * @param eventDate - Event date string or Date object
 * @returns True if the event is upcoming
 */
export function isEventUpcoming(eventDate: string | Date | null | undefined): boolean {
  if (!eventDate) return false;
  
  const dateObj = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
  
  if (isNaN(dateObj.getTime())) return false;
  
  return dateObj > new Date();
}

/**
 * Check if a deadline has passed
 * @param deadline - Deadline date string or Date object
 * @returns True if the deadline has passed
 */
export function isDeadlinePassed(deadline: string | Date | null | undefined): boolean {
  if (!deadline) return false;
  
  const dateObj = typeof deadline === 'string' ? new Date(deadline) : deadline;
  
  if (isNaN(dateObj.getTime())) return false;
  
  return dateObj < new Date();
}

/**
 * Format event time (e.g., "10:00 AM")
 * @param time - Time string (HH:mm format)
 * @param locale - Locale ('en' or 'ar')
 * @returns Formatted time string
 */
export function formatTime(time: string | null | undefined, locale: 'en' | 'ar' = 'en'): string {
  if (!time) return '';
  
  // Parse time string (expected format: HH:mm)
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return time;
  
  const date = new Date();
  date.setHours(hours, minutes);
  
  return date.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Format event date range (e.g., "Jan 15 - Jan 17, 2025")
 * @param startDate - Start date
 * @param endDate - End date (optional)
 * @param locale - Locale ('en' or 'ar')
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  locale: 'en' | 'ar' = 'en'
): string {
  if (!startDate) return '';
  
  const start = formatShortDate(startDate, locale);
  
  if (!endDate) return start;
  
  const startObj = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  // If same day, just return start date
  if (startObj.toDateString() === endObj.toDateString()) {
    return start;
  }
  
  const end = formatShortDate(endDate, locale);
  
  return locale === 'ar' ? `${start} - ${end}` : `${start} - ${end}`;
}

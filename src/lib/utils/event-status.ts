/**
 * Event Registration Status Helper
 * Determines if users can register for an event and provides status information
 */

export interface EventRegistrationStatus {
  canRegister: boolean;
  reason: string;
  reasonAr: string;
  badgeColor: 'green' | 'red' | 'gray' | 'orange' | 'blue';
  badgeText: string;
  badgeTextAr: string;
}

export interface EventStatusInput {
  registrationEnabled?: boolean;
  registrationDeadline?: string | null;
  eventDate: string;
  endDate?: string | null;
  currentParticipants?: number;
  maxParticipants?: number | null;
  published?: boolean;
}

/**
 * Get the registration status for an event
 * @param event - Event data with registration fields
 * @returns EventRegistrationStatus object with canRegister, reason, and badge info
 */
export function getEventRegistrationStatus(event: EventStatusInput): EventRegistrationStatus {
  const now = new Date();
  const eventDate = new Date(event.eventDate);
  const endDate = event.endDate ? new Date(event.endDate) : eventDate;
  const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
  const currentParticipants = event.currentParticipants || 0;
  const maxParticipants = event.maxParticipants || null;

  // Event not published
  if (event.published === false) {
    return {
      canRegister: false,
      reason: 'Event not published',
      reasonAr: 'الحدث غير منشور',
      badgeColor: 'gray',
      badgeText: 'Not Available',
      badgeTextAr: 'غير متاح',
    };
  }

  // Event already ended
  if (endDate < now) {
    return {
      canRegister: false,
      reason: 'Event has already ended',
      reasonAr: 'انتهى الحدث',
      badgeColor: 'gray',
      badgeText: 'Event Ended',
      badgeTextAr: 'انتهى الحدث',
    };
  }

  // Event is happening now
  if (eventDate <= now && endDate >= now) {
    return {
      canRegister: false,
      reason: 'Event is currently in progress',
      reasonAr: 'الحدث جارٍ الآن',
      badgeColor: 'blue',
      badgeText: 'In Progress',
      badgeTextAr: 'جارٍ الآن',
    };
  }

  // Registration not enabled
  if (!event.registrationEnabled) {
    return {
      canRegister: false,
      reason: 'Registration is not enabled for this event',
      reasonAr: 'التسجيل غير متاح لهذا الحدث',
      badgeColor: 'red',
      badgeText: 'Registration Closed',
      badgeTextAr: 'التسجيل مغلق',
    };
  }

  // Registration deadline passed
  if (registrationDeadline && registrationDeadline < now) {
    return {
      canRegister: false,
      reason: 'Registration deadline has passed',
      reasonAr: 'انتهت مهلة التسجيل',
      badgeColor: 'orange',
      badgeText: 'Deadline Passed',
      badgeTextAr: 'انتهت المهلة',
    };
  }

  // Event is full
  if (maxParticipants && currentParticipants >= maxParticipants) {
    return {
      canRegister: false,
      reason: 'Event is full',
      reasonAr: 'الحدث مكتمل العدد',
      badgeColor: 'gray',
      badgeText: 'Event Full',
      badgeTextAr: 'مكتمل',
    };
  }

  // Calculate spots remaining
  const spotsRemaining = maxParticipants ? maxParticipants - currentParticipants : null;
  
  // Few spots remaining (less than 10% or less than 5)
  if (spotsRemaining !== null && (spotsRemaining <= 5 || (maxParticipants && spotsRemaining / maxParticipants < 0.1))) {
    return {
      canRegister: true,
      reason: `Only ${spotsRemaining} spots remaining`,
      reasonAr: `متبقي ${spotsRemaining} أماكن فقط`,
      badgeColor: 'orange',
      badgeText: `${spotsRemaining} Spots Left`,
      badgeTextAr: `متبقي ${spotsRemaining}`,
    };
  }

  // Can register
  return {
    canRegister: true,
    reason: '',
    reasonAr: '',
    badgeColor: 'green',
    badgeText: 'Registration Open',
    badgeTextAr: 'التسجيل مفتوح',
  };
}

/**
 * Get participants display string (e.g., "25/100" or "25 registered")
 * @param currentParticipants - Current number of participants
 * @param maxParticipants - Maximum participants (optional)
 * @param locale - Locale ('en' or 'ar')
 * @returns Formatted participants string
 */
export function getParticipantsDisplay(
  currentParticipants: number = 0,
  maxParticipants?: number | null,
  locale: 'en' | 'ar' = 'en'
): string {
  if (maxParticipants) {
    return `${currentParticipants}/${maxParticipants}`;
  }
  
  if (locale === 'ar') {
    return `${currentParticipants} مسجل`;
  }
  
  return `${currentParticipants} registered`;
}

/**
 * Check if registration deadline is approaching (within 3 days)
 * @param deadline - Registration deadline
 * @returns True if deadline is within 3 days
 */
export function isDeadlineApproaching(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  return deadlineDate > now && deadlineDate <= threeDaysFromNow;
}

/**
 * Get event status badge variant for UI components
 * @param status - EventRegistrationStatus
 * @returns Badge variant string for shadcn/ui Badge component
 */
export function getBadgeVariant(status: EventRegistrationStatus): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status.badgeColor) {
    case 'green':
      return 'default';
    case 'red':
      return 'destructive';
    case 'gray':
    case 'orange':
    case 'blue':
      return 'secondary';
    default:
      return 'outline';
  }
}

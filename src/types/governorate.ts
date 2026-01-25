// Governorate Types - Shared across all governorate components
export interface GovernorateData {
  name: string;
  arabic_name: string;
  slug: string;
  description: string;
  arabic_description: string;
  population: string;
  area: string;
  capital: string;
  arabic_capital: string;
  cover_image: string;
  featured_image?: string;
  coordinates: { lat: number; lng: number };
  established_date: string;
  yly_stats: {
    members_count: number;
    events_count: number;
    news_count: number;
    programs_count: number;
  };
  key_attractions: string[];
  universities: string[];
  districts: string[];
  members?: Member[];
}

export interface Member {
  id: string;
  name: string;
  arabic_name?: string;
  position: string;
  profile_image?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  is_active: boolean;
  join_date: string;
}

// Component Props Types
export interface GovernorateHeroProps {
  governorate: GovernorateData;
}

export interface GovernorateStatsProps {
  governorate: GovernorateData;
  newsCount: number;
  eventsCount: number;
}

export interface GovernorateNewsProps {
  governorateName: string;
}

export interface GovernorateEventsProps {
  governorateName: string;
}

export interface GovernorateMetadataProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface GovernoratePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface GovernorateMembersProps {
  members: Member[];
  governorateName: string;
}

// Position types for localization
export type MemberPosition = 'leader' | 'member' | 'coordinator' | 'volunteer';

// Helper type for position translation keys
export type PositionTranslationKey = `governorate.detail.members.${MemberPosition}`;
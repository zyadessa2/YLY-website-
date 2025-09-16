// Translation utilities for governorate components
import { useTranslations } from "next-intl";
import { MemberPosition } from "@/types/governorate";

/**
 * Hook for governorate detail translations
 */
export const useGovernorateTranslations = () => {
  const heroT = useTranslations("governorate.detail.hero");
  const statsT = useTranslations("governorate.detail.stats");
  const membersT = useTranslations("governorate.detail.members");
  const navigationT = useTranslations("governorate.detail.navigation");
  const contactT = useTranslations("governorate.detail.contact");

  return {
    hero: heroT,
    stats: statsT,
    members: membersT,
    navigation: navigationT,
    contact: contactT,
  };
};

/**
 * Get localized position title
 */
export const getLocalizedPosition = (
  position: string,
  t: ReturnType<typeof useTranslations>
): string => {
  const positionKey = position.toLowerCase() as MemberPosition;
  
  // Check if the position key exists in translations
  if (["leader", "member", "coordinator", "volunteer"].includes(positionKey)) {
    return t(positionKey);
  }
  
  // Fallback to original position if not found
  return position;
};

/**
 * Format stats number for display
 */
export const formatStatsNumber = (number: number): string => {
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}k`;
  }
  return number.toString();
};

/**
 * Get governorate page metadata translations
 */
export const getGovernorateMetadata = (governorateName: string) => {
  return {
    title: `YLY في ${governorateName} | الشباب يقود الشباب`,
    description: `استكشف برامج وأنشطة الشباب يقود الشباب (YLY) في محافظة ${governorateName}. انضم إلى المتطوعين الذين يصنعون الفرق في مجتمعهم.`,
    keywords: [
      `YLY ${governorateName}`,
      "الشباب يقود الشباب",
      governorateName,
      "محافظات مصر",
      "برامج الشباب",
      "وزارة الشباب والرياضة"
    ],
  };
};
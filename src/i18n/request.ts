import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, Locale } from "./config";

export default getRequestConfig(async ({ locale = defaultLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
    timeZone: "Africa/Cairo",
    now: new Date(),
    // Additional configuration for RTL support
    formats: {
      dateTime: {
        short: {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      },
    },
    defaultTranslationValues: {
      // You can define default values that will be available in all translations
      website: "YLY",
      company: "Youth Leading Youth",
    },
  };
});

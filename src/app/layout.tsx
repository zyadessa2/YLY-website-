import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BackgroundAnimation } from "../components/ui/BackgroundAnimation";
import { ThemeProviderWrapper } from "@/components/providers/theme-provider-wrapper";
import { LayoutWrapper } from "@/components/providers/LayoutWrapper";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YLY Ministry",
  description:
    "Volunteers of the Ministry of Youth and Sports YLY. Youth Leading Youth",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}>) {
  // Await params as it's now a Promise in Next.js 16
  const { lang } = await params;
  
  // Default to 'en' if no lang param is provided
  let locale = lang || "en";
  const cookieStore = cookies();
  const localeCookie = (await cookieStore).get("NEXT_LOCALE");

  // Use cookie locale if available, otherwise use the lang param or default
  if (localeCookie?.value) {
    locale = localeCookie.value;
  }

  // Make sure we only use supported locales
  if (!["en", "ar"].includes(locale)) {
    locale = "en";
  }

  // Use relative path from src/app to messages folder
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProviderWrapper>
            <div id="root-content" className="contents">
              <BackgroundAnimation />
              <div className="relative z-10">
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </div>
            </div>
          </ThemeProviderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

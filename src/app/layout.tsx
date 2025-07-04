import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BackgroundAnimation } from "../components/ui/BackgroundAnimation";
import { NavbarDemo } from "../components/my-components/navbar/Navbar";
import Footer from "../components/my-components/Footer";
import { ThemeProviderWrapper } from "@/components/providers/theme-provider-wrapper";
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
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  // Default to 'en' if no lang param is provided
  let locale = lang || "en";
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");

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
                <NavbarDemo />
                {children}
                <Footer />
              </div>
            </div>
          </ThemeProviderWrapper>
        </NextIntlClientProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N5L4K4PQC8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N5L4K4PQC8');
          `}
        </Script>
      </body>
    </html>
  );
}

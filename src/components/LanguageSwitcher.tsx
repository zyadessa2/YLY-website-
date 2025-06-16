"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "./ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const [isChanging, setIsChanging] = useState(false);
  const switchLocale = (newLocale: string) => {
    // When not using i18n routing, we just change the locale in the cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/`;
    // Reload the page to apply the new locale
    router.refresh();
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={async () => {
        setIsChanging(true);
        const newLocale = locale === "en" ? "ar" : "en";
        switchLocale(newLocale);
      }}
    //   disabled={isChanging}
      className="relative h-8 min-w-[3rem] rounded-full bg-neutral-100 hover:bg-blue-100 dark:bg-neutral-800 dark:hover:bg-blue-900 flex items-center justify-center px-2 gap-1"
      title={locale === "en" ? "تغيير إلى العربية" : "Switch to English"}
    >
      {" "}
      <div className="flex items-center justify-center space-x-1">
        {" "}
        <Languages
          className={`h-4 w-4 transition-all duration-300 ${
            isChanging ? "opacity-50" : ""
          }`}
        />
        <motion.span
          key={locale}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className="text-sm font-medium"
        >
          {locale === "en" ? "AR" : "EN"}
        </motion.span>
      </div>
      <span className="sr-only">
        {locale === "en" ? "Switch to Arabic" : "تغيير إلى الإنجليزية"}
      </span>
    </Button>
  );
}

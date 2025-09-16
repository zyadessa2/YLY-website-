"use client";
// import { ModeToggle } from "@/components/Mode-toggle";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  SocialIcons,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function NavbarDemo() {
  const t = useTranslations("navigation");

  const navItems = [
    {
      name: t("home"),
      link: "/",
    },
    {
      name: t("news"),
      link: "/news",
    },
    {
      name: t("events"),
      link: "/events",
    },
    {
      name: t("contact"),
      link: "/contactUs",
    },
    {
      name: t("Governorate"),
      link: "/Governorate",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isNavVisible, setIsNavVisible] = useState(true);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody visible={isNavVisible}>
          <NavbarLogo />
          <NavItems items={navItems} />{" "}
          <div className="flex items-center gap-4">
            <SocialIcons />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {/* <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                <ModeToggle/> */}
              {/* </NavbarButton> */}
              <SocialIcons></SocialIcons>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Navbar */}
    </div>
  );
}

"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { LanguageSwitcher } from "../LanguageSwitcher";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { ModeToggle } from "../Mode-toggle";
// import { LanguageSwitcher } from "../LanguageSwitcher";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible: boolean;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  children: React.ReactNode;
  active?: boolean;
  href: string;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-10 z-40 w-full ", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(12px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05)"
          : "none",
        width: visible ? "60%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-neutral-200/40 dark:bg-neutral-800/40 px-4 py-2 lg:flex",
        visible &&
          "bg-white/40 dark:bg-neutral-950/40 dark:border dark:border-neutral-800/20",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-neutral-800 dark:text-neutral-300"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-500"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-white/80 dark:bg-neutral-950/80",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onClose,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white px-4 py-8 shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] dark:bg-neutral-950",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <X className="text-black dark:text-white" onClick={onClick} />
  ) : (
    <Menu className="text-black dark:text-white" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="group relative z-20 mr-2 flex items-center gap-1 px-1 py-1 text-sm font-normal text-black"
    >
      {/* Modern gradient glow behind logos */}
      <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 opacity-80 blur-xl transition-all duration-300 group-hover:opacity-100 group-hover:blur-2xl dark:from-blue-400/40 dark:via-purple-400/40 dark:to-pink-400/40" />
      {/* Dark backdrop for contrast */}
      <div className="absolute inset-0 -m-0.5 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 shadow-xl transition-all duration-300 group-hover:shadow-2xl dark:from-slate-700 dark:via-slate-800 dark:to-slate-700" />
      {/* MOYAS Logo */}
      <Image 
        src="/MOYAS WHITE (1).png" 
        alt="MOYAS Logo" 
        width={44} 
        height={44}
        className="relative z-10 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
      />
      {/* YLY Union Logo */}
      <Image 
        src="/White_YLY Union (1).png" 
        alt="YLY Union Logo" 
        width={44} 
        height={44}
        className="relative z-10 drop-shadow-2xl transition-transform duration-300 group-hover:scale-105"
      />
    </a>
  );
};

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export const SocialIcon = ({ href, icon, label }: SocialIconProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-blue-100 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-blue-900"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <motion.span
        className="absolute"
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0.6 }}
      >
        {icon}
      </motion.span>
    </motion.a>
  );
};

export const SocialIcons = () => {
  const socials = [
    {
      href: "https://facebook.com/ylyministry",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      label: "Facebook",
    },
    {
      href: "https://instagram.com/ylyministry",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
      label: "Instagram",
    },
    {
      href: "https://linkedin.com/company/ylyministry",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
      label: "LinkedIn",
    },
  ];

  return (
    <div className="flex items-center space-x-3">
      {socials.map((social, index) => (
        <SocialIcon
          key={`social-${index}`}
          href={social.href}
          icon={social.icon}
          label={social.label}
        />
      ))}
      <ModeToggle />
      <LanguageSwitcher />
    </div>
  );
};

export const NavItem = ({ children, active, href }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "text-blue-600 dark:text-blue-400"
          : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
      )}
    >
      {children}
      {active && (
        <motion.div
          className="absolute inset-0 z-[-1] rounded-full bg-gradient-to-r from-blue-100/50 to-yellow-100/50 dark:from-blue-950/50 dark:to-yellow-950/50"
          layoutId="navbar-active"
          transition={{
            type: "spring",
            bounce: 0.25,
            duration: 0.5,
          }}
        />
      )}
    </Link>
  );
};

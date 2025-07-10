"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const SocialLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300" />
    <Link
      href={href}
      className="relative flex items-center justify-center w-10 h-10 rounded-full 
        bg-background/40 backdrop-blur-sm border border-white/10
        hover:bg-primary/20 hover:border-primary/30
        dark:bg-white/10 dark:hover:bg-primary/20
        transition-all duration-300"
      target="_blank"
      aria-label={label}
    >
      <Icon className="w-5 h-5 text-primary group-hover:text-primary/90 transition-colors" />
    </Link>
  </motion.div>
);

const Footer = () => {
  return (
    <footer className="relative mt-20">
      {/* Background Image with Overlay */}{" "}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Image
          src="/images/footer bg.jpg"
          alt="yly Footer background"
          fill
          className="object-cover object-center transform scale-105 transition-transform duration-1000 hover:scale-110"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/75 to-background/85 backdrop-blur-[2px] transition-opacity duration-300" />
        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
      </div>
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center md:items-start"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <Image
                src="/logo.webp"
                alt="YLY Logo"
                width={120}
                height={120}
                className="relative rounded-full"
              />
            </div>
            <h3 className="text-2xl font-semibold mt-6 mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Youth Leading Youth
            </h3>
            <p className="text-muted-foreground text-sm text-center md:text-left">
              Empowering the next generation of leaders
            </p>
          </motion.div>

          {/* Email Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center md:items-start space-y-4"
          >
            <h4 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Stay Updated
            </h4>
            <div className="relative w-full max-w-md">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-white/5 border-primary/20 text-foreground placeholder:text-muted-foreground pr-12 focus:border-primary/50"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 bg-primary/20 hover:bg-primary/40"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm">
              Join us to receive updates and news
            </p>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center md:items-start space-y-4"
          >
            <h4 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Connect With Us
            </h4>
            <div className="flex gap-4">
              <SocialLink
                href="https://facebook.com"
                icon={Facebook}
                label="Facebook"
              />
              <SocialLink
                href="https://instagram.com"
                icon={Instagram}
                label="Instagram"
              />
              <SocialLink
                href="https://linkedin.com"
                icon={Linkedin}
                label="LinkedIn"
              />
              <SocialLink
                href="https://tiktok.com"
                icon={(props: React.SVGProps<SVGSVGElement>) => (
                  <svg {...props} viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"
                    />
                  </svg>
                )}
                label="TikTok"
              />
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-6 border-t border-primary/10"
        >
          <p className="text-center text-sm text-muted-foreground">
            Copyright © {new Date().getFullYear()} YOUTH LEADING YOUTH |
            <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent ml-1">
              Made With ❤️ by <a className=" text-cyan-700" href="https://www.linkedin.com/in/ziad-essa/">Ziad</a>
            </span>
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

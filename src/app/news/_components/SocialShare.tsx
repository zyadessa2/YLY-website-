"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  description: string;
}

export const SocialShare = ({ url, title, description }: SocialShareProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    // Get the actual current URL from browser
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      currentUrl
    )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
      description
    )}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {" "}
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Share button group with labels */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white shadow-lg transition-transform"
          onClick={() => window.open(shareLinks.facebook, "_blank")}
        >
          <Facebook size={20} />
          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            Share on Facebook
          </span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#1da1f2] text-white shadow-lg transition-transform"
          onClick={() => window.open(shareLinks.twitter, "_blank")}
        >
          <Twitter size={20} />
          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            Share on Twitter
          </span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#0077b5] text-white shadow-lg transition-transform"
          onClick={() => window.open(shareLinks.linkedin, "_blank")}
        >
          <Linkedin size={20} />
          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            Share on LinkedIn
          </span>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform"
          onClick={copyToClipboard}
        >
          <LinkIcon size={20} />
          <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {showTooltip ? "Copied!" : "Copy Link"}
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

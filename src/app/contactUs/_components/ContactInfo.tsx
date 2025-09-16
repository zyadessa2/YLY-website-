"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from "next/link";

export const ContactInfo = () => {
  const contactDetails = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+20 100 000 0000", "+20 100 000 0001"],
      href: "tel:+201000000000",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["info@yly.com", "support@yly.com"],
      href: "mailto:info@yly.com",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Location",
      details: ["123 YLY Street", "Cairo, Egypt"],
      href: "https://goo.gl/maps/YOUR_LOCATION",
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://facebook.com/YLY",
      icon: (
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://twitter.com/YLY",
      icon: (
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578 9.3 9.3 0 0 1-2.958 1.13 4.66 4.66 0 0 0-7.938 4.25 13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568 4.692 4.692 0 0 1-2.104.08 4.661 4.661 0 0 0 4.352 3.234 9.348 9.348 0 0 1-5.786 1.995 9.5 9.5 0 0 1-1.112-.065 13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41l.002-.003Z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/YLY",
      icon: (
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/YLY",
      icon: (
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Contact Details */}
      <div className="grid gap-8 md:grid-cols-3">
        {contactDetails.map((item, index) => (
          <motion.a
            href={item.href}
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex flex-col items-center rounded-lg bg-card p-6 text-center shadow-lg transition-all hover:shadow-xl"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="mb-4 rounded-full bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-white"
            >
              {item.icon}
            </motion.div>
            <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
            {item.details.map((detail) => (
              <p key={detail} className="text-muted-foreground">
                {detail}
              </p>
            ))}
          </motion.a>
        ))}
      </div>

      {/* Social Links */}
      <div className="flex justify-center space-x-6">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            className="rounded-full bg-primary/10 p-3 text-primary transition-colors hover:bg-primary hover:text-white"
          >
            {social.icon}
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

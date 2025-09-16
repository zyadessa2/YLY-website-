"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Add your form submission logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-lg bg-green-50 p-8 text-center dark:bg-green-900/20"
      >
        <h3 className="mb-2 text-2xl font-semibold text-green-700 dark:text-green-300">
          Thank you for your message!
        </h3>
        <p className="text-green-600 dark:text-green-400">
          We&apos;ll get back to you as soon as possible.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="peer w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition-all focus:border-primary"
            placeholder=" "
          />
          <label className="absolute left-4 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary">
            Your Name
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="peer w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition-all focus:border-primary"
            placeholder=" "
          />
          <label className="absolute left-4 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary">
            Email Address
          </label>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) =>
            setFormData({ ...formData, subject: e.target.value })
          }
          className="peer w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition-all focus:border-primary"
          placeholder=" "
        />
        <label className="absolute left-4 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary">
          Subject
        </label>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative"
      >
        <textarea
          required
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          rows={5}
          className="peer w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm outline-none transition-all focus:border-primary"
          placeholder=" "
        />
        <label className="absolute left-4 top-3 z-10 origin-[0] -translate-y-6 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-3 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary">
          Your Message
        </label>
      </motion.div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative overflow-hidden rounded-lg bg-primary px-8 py-3 text-white transition-all hover:shadow-lg disabled:opacity-70"
      >
        <span className="relative z-10">
          {isSubmitting ? "Sending..." : "Send Message"}
        </span>
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ x: "100%" }}
          whileHover={{ x: 0 }}
          transition={{ type: "tween" }}
          style={{ mixBlendMode: "overlay" }}
        />
      </motion.button>
    </motion.form>
  );
};

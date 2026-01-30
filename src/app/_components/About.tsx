"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Target, Heart, Sparkles, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TitleMotion from "@/components/my-components/TitleMotion";
import CircularGallery from "@/components/CircularGallery";
import { useTranslations } from "next-intl";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const About = () => {
  const [isMounted, setIsMounted] = useState(false);
  const t = useTranslations('home');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen" />;
  }

  const bentoCards = [
    {
      icon: Target,
      title: t('about.vision.title'),
      description: t('about.vision.description'),
      color: "from-blue-500/20 to-cyan-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Heart,
      title: t('about.mission.title'),
      description: t('about.mission.description'),
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Sparkles,
      title: t('about.values.title'),
      description: t('about.values.description'),
      color: "from-orange-500/20 to-red-500/20",
      borderColor: "border-orange-500/30",
    },
    {
      icon: Globe,
      title: t('about.impact.title'),
      description: t('about.impact.description'),
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/30",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container mx-auto px-4 md:px-16">
        <TitleMotion title={t(`about.title`)} />

        {/* Bento Grid Layout */}
        <div className="mt-16 grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Bento Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            {bentoCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`group relative bg-gradient-to-br ${card.color} backdrop-blur-sm p-6 rounded-2xl border ${card.borderColor} hover:border-opacity-60 transition-all duration-300 ${
                  index === 0 ? 'col-span-2' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                <card.icon className="w-10 h-10 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2 text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} className="prose prose-lg dark:prose-invert max-w-none">
              <motion.p className="text-lg md:text-xl text-muted-foreground leading-loose">
                {t(`about.description`)}
              </motion.p>

              <motion.p className="text-lg md:text-xl text-muted-foreground leading-loose mt-4">
                {t(`about.description2`)}
              </motion.p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 
                text-primary-foreground rounded-xl transition-all duration-300 transform hover:scale-105 group shadow-lg hover:shadow-xl"
              >
                {t(`about.readMore`)}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Image Gallery Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4 mt-8"
            >
              <motion.div 
                className="relative h-48 rounded-xl overflow-hidden group col-span-2"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent z-10" />
                <Image
                  src="/about.jpeg"
                  alt="YLY Main"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
              {['/about.jpeg', '/about.jpeg'].map((img, i) => (
                <motion.div 
                  key={i}
                  className="relative h-32 rounded-xl overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Image
                    src={img}
                    alt={`YLY Activity ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Circular Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-[600px] relative mt-20"
      >
        <CircularGallery
          bend={3}
          textColor="hsl(var(--primary))"
          borderRadius={0.05}
        />
      </motion.div>
    </section>
  );
};

export default About;

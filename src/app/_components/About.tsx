"use client";

import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

const slideIn = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
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

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container mx-auto px-4">
        <TitleMotion title={t(`about.title`)} />

        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            variants={slideIn}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="prose prose-lg dark:prose-invert"
            >
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-muted-foreground leading-loose"
              >
                {/* We are the volunteers of the Ministry of Youth and Sports YLY A
                project launched by the Minister of Youth and Sports Dr. Ashraf
                Sobhi under the name (Youth Managing Youth) since he assumed the
                position of Minister of Youth and Sports in 2018 */}
                {t(`about.description`)}
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-lg mt-4 md:text-xl text-muted-foreground leading-loose"
              >
                {/* The project is spread across the governorates of the Republic
                and includes a large number of young people in{" "} */}
                {t(`about.description2`)}
                <span className="text-secondary font-medium inline-flex gap-2 flex-wrap">
                  <span>HR</span>
                  <span>•</span>
                  <span>SM</span>
                  <span>•</span>
                  <span>PR</span>
                  <span>•</span>
                  <span>OR</span>
                  <span>•</span>
                  <span>R&D</span>
                  <span>•</span>
                  <span>Media</span>
                  <span>•</span>
                  <span>Training</span>
                </span>
              </motion.p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 
                text-primary-foreground rounded-lg transition-all duration-300 transform hover:scale-105 group"
              >
                {t(`about.readMore`)}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent z-10" />
            <Image
              src="/images/gallery/g4.jpg"
              alt="youth leading youth (yly) about image"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 628px) 100vw, (max-width: 900px) 50vw, 33vw"
            />
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

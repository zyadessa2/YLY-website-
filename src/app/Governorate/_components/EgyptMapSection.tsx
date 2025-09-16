"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type GovernorateProps = {
  name: string;
  arabicName: string;
  population: string;
  area: string;
  description: string;
};

const Governorate = ({
  name,
  arabicName,
  population,
  area,
  description,
}: GovernorateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/Governorate/${name.toLowerCase().replace(/\s+/g, "-")}`}>
        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 border-primary/10 hover:border-primary/30 h-full">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardContent className="relative p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors duration-300">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <ArrowRight className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-300 transform group-hover:translate-x-1" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 font-medium">
                {arabicName}
              </p>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {description}
              </p>
            </div>

            <div className="flex justify-between text-xs text-muted-foreground border-t border-primary/10 pt-3">
              <span>Pop: {population}</span>
              <span>Area: {area}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const governoratesData = [
  {
    name: "Cairo",
    arabicName: "القاهرة",
    population: "10.2M",
    area: "606 km²",
    description:
      "YLY's central hub in Egypt's capital, empowering youth through leadership programs and community initiatives.",
  },
  {
    name: "Giza",
    arabicName: "الجيزة",
    population: "9.2M",
    area: "13,184 km²",
    description:
      "YLY volunteers at the heart of history, organizing events and youth programs near the Great Pyramids.",
  },
  {
    name: "Alexandria",
    arabicName: "الإسكندرية",
    population: "5.4M",
    area: "2,679 km²",
    description:
      "YLY's coastal chapter empowering Mediterranean youth through innovative training and community service.",
  },
  {
    name: "Qalyubia",
    arabicName: "القليوبية",
    population: "5.6M",
    area: "1,124 km²",
    description:
      "YLY Delta chapter bridging urban and rural youth development between Cairo and agricultural communities.",
  },
  {
    name: "Sharqia",
    arabicName: "الشرقية",
    population: "7.2M",
    area: "4,911 km²",
    description:
      "YLY's agricultural hub in the eastern Delta, training youth in farming technology and rural innovation.",
  },
  {
    name: "Dakahlia",
    arabicName: "الدقهلية",
    population: "6.5M",
    area: "3,459 km²",
    description:
      "YLY's heart of the Delta, empowering youth in Egypt's most densely populated agricultural region.",
  },
  {
    name: "Beheira",
    arabicName: "البحيرة",
    population: "6.2M",
    area: "9,826 km²",
    description:
      "YLY's western Delta chapter promoting sustainable agriculture and Lake Mariout environmental programs.",
  },
  {
    name: "Minya",
    arabicName: "المنيا",
    population: "5.5M",
    area: "32,279 km²",
    description:
      "YLY's Upper Egypt cultural center, combining archaeological heritage with modern youth development programs.",
  },
  {
    name: "Gharbia",
    arabicName: "الغربية",
    population: "4.9M",
    area: "1,948 km²",
    description:
      "YLY's Delta industrial hub, training youth in textile manufacturing and entrepreneurship programs.",
  },
  {
    name: "Sohag",
    arabicName: "سوهاج",
    population: "5.0M",
    area: "11,218 km²",
    description:
      "YLY's Upper Egypt heritage chapter, promoting Coptic culture and archaeological tourism among youth.",
  },
  {
    name: "Assiut",
    arabicName: "أسيوط",
    population: "4.4M",
    area: "25,926 km²",
    description:
      "YLY's Upper Egypt educational center, partnering with universities for technical and agricultural training.",
  },
  {
    name: "Beni Suef",
    arabicName: "بني سويف",
    population: "3.5M",
    area: "10,954 km²",
    description:
      "YLY's bridge between regions, training youth in cement industry and sustainable development practices.",
  },
  {
    name: "Kafr El Sheikh",
    arabicName: "كفر الشيخ",
    population: "3.4M",
    area: "3,748 km²",
    description:
      "YLY's northern Delta chapter, focusing on rice production, aquaculture, and environmental sustainability.",
  },
  {
    name: "Fayoum",
    arabicName: "الفيوم",
    population: "3.7M",
    area: "6,068 km²",
    description:
      "YLY's oasis chapter, promoting eco-tourism, sustainable agriculture, and Lake Qarun conservation programs.",
  },
  {
    name: "Monufia",
    arabicName: "المنوفية",
    population: "4.2M",
    area: "2,499 km²",
    description:
      "YLY's Delta educational hub, integrating agricultural training with institutional partnerships for youth development.",
  },
  {
    name: "Suez",
    arabicName: "السويس",
    population: "0.7M",
    area: "9,002 km²",
    description:
      "YLY's strategic canal chapter, training youth in maritime logistics and international trade operations.",
  },
  {
    name: "Ismailia",
    arabicName: "الإسماعيلية",
    population: "1.3M",
    area: "5,067 km²",
    description:
      "YLY's canal governorate promoting international cooperation, cultural exchange, and trade development programs.",
  },
  {
    name: "Port Said",
    arabicName: "بورسعيد",
    population: "0.7M",
    area: "1,351 km²",
    description:
      "YLY's Mediterranean port chapter, developing maritime skills and free zone business opportunities for youth.",
  },
  {
    name: "Damietta",
    arabicName: "دمياط",
    population: "1.5M",
    area: "910 km²",
    description:
      "YLY's furniture industry hub, training youth in woodworking crafts and coastal environmental protection.",
  },
  {
    name: "North Sinai",
    arabicName: "شمال سيناء",
    population: "0.4M",
    area: "27,574 km²",
    description:
      "YLY's Sinai chapter, integrating Bedouin youth into development programs and border community initiatives.",
  },
  {
    name: "South Sinai",
    arabicName: "جنوب سيناء",
    population: "0.2M",
    area: "33,140 km²",
    description:
      "YLY's tourism and conservation chapter, training youth in hospitality, diving, and mountain eco-tourism.",
  },
  {
    name: "Red Sea",
    arabicName: "البحر الأحمر",
    population: "0.4M",
    area: "119,099 km²",
    description:
      "YLY's marine conservation chapter, developing diving tourism and coral reef protection programs for youth.",
  },
  {
    name: "Luxor",
    arabicName: "الأقصر",
    population: "1.3M",
    area: "2,960 km²",
    description:
      "YLY's world heritage chapter, combining archaeological preservation with tourism training for youth development.",
  },
  {
    name: "Qena",
    arabicName: "قنا",
    population: "3.2M",
    area: "9,331 km²",
    description:
      "YLY's Upper Egypt heritage hub, connecting ancient Egyptian culture with modern sugar industry training.",
  },
  {
    name: "Aswan",
    arabicName: "أسوان",
    population: "1.5M",
    area: "62,726 km²",
    description:
      "YLY's southern gateway, promoting Nubian culture, renewable energy projects, and High Dam engineering programs.",
  },
  {
    name: "New Valley",
    arabicName: "الوادي الجديد",
    population: "0.2M",
    area: "376,505 km²",
    description:
      "YLY's desert innovation chapter, developing oasis agriculture and sustainable desert community programs.",
  },
  {
    name: "Matrouh",
    arabicName: "مطروح",
    population: "0.5M",
    area: "166,563 km²",
    description:
      "YLY's western frontier, integrating Bedouin communities and developing Mediterranean coastal tourism programs.",
  },
];

export const EgyptMapSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations("governorate.mapSection");

  const filteredGovernorates = governoratesData.filter(
    (gov) =>
      gov.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gov.arabicName.includes(searchQuery)
  );

  return (
    <section className="relative py-24 min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-foreground mb-4"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8"
          >
            {t("subtitle")}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-background/50 backdrop-blur-sm border-primary/20 
                    focus:border-primary/50 focus:ring-primary/30 focus:ring-2
                    placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredGovernorates.map((governorate, index) => (
              <motion.div
                key={governorate.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
              >
                <Governorate {...governorate} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredGovernorates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">{t("noResults")}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

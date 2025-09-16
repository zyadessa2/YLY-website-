"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import TitleMotion from "@/components/my-components/TitleMotion";
import Link from "@/components/my-components/link/link";
import { useState } from "react";
import { useTranslations } from "next-intl";


type GovernorateProps = {
  name: string;
  x?: string;
  y?: string;
};


const Governorate = ({ name }: GovernorateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/Governorate/${name.toLowerCase()}`}>
        <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-500 bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 border-primary/10 hover:border-primary/30">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="relative p-6 flex flex-col items-center justify-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors duration-300">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <span className="text-lg md:text-xl font-medium text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {name}
            </span>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const governorates = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Luxor",
  "Aswan",
  "Qalyubia",
  "Dakahlia",
  "Damietta",
  "Faiyum",
  "Gharbia",
  "Ismailia",
  "Kafr El Sheikh",
  "Matrouh",
  "Minya",
  "Monufia",
  "New Valley",
  "North Sinai",
  "Port Said",
  "Qena",
  "Red Sea",
  "Sharqia",
  "Sohag",
  "South Sinai",
  "Suez",
  "Beni Suef",
  "Beheira",
  "Menofia",
];

const EgyptMap = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const t = useTranslations('home.governments')

  const filteredGovernorates = governorates.filter((gov) =>
    gov.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative py-24 min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <TitleMotion title={t("title")} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground"
          >
             {t(`description`)}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 relative max-w-md mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search governorates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background/50 backdrop-blur-sm border-primary/20 
                    focus:border-primary/50 focus:ring-primary/30 focus:ring-2
                    placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          </motion.div>
        </div>{" "}
        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[65vh] 
              overflow-y-auto px-4 py-2
              scrollbar-thin scrollbar-thumb-rounded-full
              scrollbar-track-transparent hover:scrollbar-track-primary/5
              scrollbar-thumb-primary/20 hover:scrollbar-thumb-primary/40
              transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredGovernorates.map((governorate, index) => (
              <motion.div
                key={governorate}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
              >
                <Governorate name={governorate} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default EgyptMap;

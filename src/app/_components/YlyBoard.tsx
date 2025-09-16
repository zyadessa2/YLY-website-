"use client";

import TitleMotion from "@/components/my-components/TitleMotion";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";

interface BoardMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

const boardMembers: BoardMember[] = [
  {
    id: 1,
    name: "Dr. Ashraf Sobhy",
    role: "Minister of Youth and Sports",
    image: "/images/Board/dr-ashraf-sobhy-1.jpg",
  },
  {
    id: 2,
    name: "Mr. Shehab Jamal Eldin",
    role: "CEO / Founder YLY",
    image: "/images/Board/shehab2-2.jpg",
  },
  {
    id: 3,
    name: "Abdelrahman Ashraf",
    role: "Official Spokesperson Of YLY",
    image: "/images/Board/IMG-20240805-WA0049.jpg",
  },
  {
    id: 4,
    name: "Ahmed Hosny",
    role: "SM Central Head",
    image: "/images/Board/ahmed hosny.jpg",
  },
 {
    id: 5,
    name: "Nada Elseady",
    role: "PR Central Head",
    image: "/images/Board/nada elseady.jpg",
  },
  {
    id: 6,
    name: "Nada Ashraf",
    role: "Training Central Head",
    image: "/images/Board/Nada Ashraf.jpg",
  },
  
   {
    id: 7,
    name: "Esraa Medhat",
    role: "HR Central Head",
    image: "/images/Board/esraa medht.jpg",
  },
  {
    id: 8,
    name: "Sarah Al-Basousi",
    role: "R&D Central Head",
    image: "/images/Board/sara elbasosy.jpg",
  },
  {
    id: 9,
    name: "Shaimaa Atef",
    role: "OR Central Head",
    image: "/images/Board/shimaa atef.jpg",
  },
];

const BoardMemberCard = ({
  member,
  featured = false,
  index = 0,
}: {
  member: BoardMember;
  featured?: boolean;
  index?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group mx-auto"
    >
      {" "}
      <Card
        className={`overflow-hidden ${
          featured ? "w-80" : "w-72"
        } bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 border-primary/10 hover:border-primary/30 transition-colors duration-300 shadow-lg hover:shadow-primary/45`}
      >        <div className="relative p-3">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-x-0 top-[10%] bottom-[10%] bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            <Image
              src={member.image}
              alt={member.name}
              width={featured ? 320 : 288}
              height={featured ? 320 : 288}
              className="object-cover aspect-square transform transition-transform duration-500 group-hover:scale-105 rounded-lg"
              priority={featured}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent dark:from-background/95 dark:via-background/70 dark:to-transparent" />
          </div>
          <div dir="ltr" className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {member.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{member.role}</p>
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 mt-2" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const YlyBoard = () => {
  const [featured, middle, bottom] = [
    boardMembers.slice(0, 2),
    boardMembers.slice(2, 5),
    boardMembers.slice(5),
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

      <div className="relative container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <TitleMotion title="Our Board" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Meet the dedicated individuals who guide our organization towards
            excellence and innovation
          </motion.p>
        </div>

        {/* Featured Row - 2 cards */}
        <div className="flex flex-col md:flex-row justify-center gap-8 my-12">
          {featured.map((member, index) => (
            <BoardMemberCard
              key={member.id}
              member={member}
              featured
              index={index}
            />
          ))}
        </div>

        {/* Middle Row - 3 cards */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-12 flex-wrap">
          {middle.map((member, index) => (
            <BoardMemberCard
              key={member.id}
              member={member}
              index={index + 2}
            />
          ))}
        </div>

        {/* Bottom Row - 4 cards */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
          {bottom.map((member, index) => (
            <BoardMemberCard
              key={member.id}
              member={member}
              index={index + 5}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default YlyBoard;

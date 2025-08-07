"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Globe } from "lucide-react";

interface GovernorateData {
  name: string;
  arabic_name: string;
  slug: string;
  description: string;
  arabic_description: string;
  population: string;
  area: string;
  capital: string;
  arabic_capital: string;
  cover_image: string;
  featured_image?: string;
  coordinates: { lat: number; lng: number };
  established_date: string;
  yly_stats: {
    members_count: number;
    events_count: number;
    news_count: number;
    programs_count: number;
  };
  key_attractions: string[];
  universities: string[];
  districts: string[];
}

interface Props {
  governorate: GovernorateData;
}

export function GovernorateHero({ governorate }: Props) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/footer bg.jpg"
          alt={governorate.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold">
              YLY in {governorate.name}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold opacity-90">
              {governorate.arabic_name}
            </h2>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            {governorate.description}
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <MapPin className="mr-2 h-4 w-4" />
              Capital: {governorate.capital}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Users className="mr-2 h-4 w-4" />
              Population: {governorate.population}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Globe className="mr-2 h-4 w-4" />
              Area: {governorate.area}
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}

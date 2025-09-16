"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, UserCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { GovernorateMembersProps } from "@/types/governorate";
import { getLocalizedPosition } from "@/utils/governorate-translations";

export function GovernorateMembers({ members, governorateName }: GovernorateMembersProps) {
  const t = useTranslations("governorate.detail.members");
  
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            {t("title", { governorate: governorateName })}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member) => (
            <Card
              key={member.id}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Circular Image with Border */}
              <div className="pt-8 pb-4 px-6">
                <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/40 transition-colors duration-300">
                  {member.profile_image ? (
                    <Image
                      src={member.profile_image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Position Header - Prominent Display */}
              <div className="px-6 pb-4">
                <div className="text-center">
                  <Badge
                    variant={
                      member.position === "Leader" ? "default" : "secondary"
                    }
                    className={`text-sm font-bold px-4 py-1.5 ${
                      member.position === "Leader"
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-secondary/80 text-secondary-foreground border border-border"
                    }`}
                  >
                    {getLocalizedPosition(member.position, t)}
                  </Badge>
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="px-6 pb-8 space-y-4">
                {/* Name Section - Centered */}
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-xl text-foreground">
                    {member.name}
                  </h3>
                  {member.arabic_name && (
                    <p className="text-sm text-muted-foreground font-medium">
                      {member.arabic_name}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="w-16 h-px bg-border mx-auto"></div>

                {/* Bio */}
                {member.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed text-center px-2">
                    {member.bio}
                  </p>
                )}

                {/* Location with Icon */}
                {member.location && (
                  <div className="flex items-center justify-center text-sm text-muted-foreground pt-2">
                    <div className="flex items-center bg-muted/50 px-3 py-1.5 rounded-full">
                      <MapPin className="mr-2 h-3.5 w-3.5" />
                      <span className="font-medium">{member.location}</span>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Decorative Element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

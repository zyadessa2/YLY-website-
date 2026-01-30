"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { GovernorateEventsProps } from "@/types/governorate";
import { governoratesService } from "@/lib/api";
import { formatShortDate } from "@/lib/utils/date-format";
import { getNextImageProps } from "@/lib/utils/google-drive-image";
import { getEventRegistrationStatus } from "@/lib/utils/event-status";

interface EventItemData {
  _id: string;
  title: string;
  arabicTitle: string;
  slug: string;
  description: string;
  arabicDescription: string;
  coverImage: string;
  eventDate: string;
  eventTime?: string;
  location: string;
  arabicLocation: string;
  published: boolean;
  registrationEnabled?: boolean;
  currentParticipants?: number;
  maxParticipants?: number;
  isUpcoming?: boolean;
  isRegistrationOpen?: boolean;
  createdAt: string;
}

export function GovernorateEvents({ governorateName, governorateId }: GovernorateEventsProps & { governorateId?: string }) {
  const t = useTranslations("governorate.features.comingSoon.events");
  const [events, setEvents] = useState<EventItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!governorateId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await governoratesService.getEvents(governorateId, {
          published: true,
          upcoming: true,
          limit: 6,
        });
        setEvents(response.data);
      } catch (err) {
        console.error('Failed to fetch governorate events:', err);
        setError('فشل في تحميل الفعاليات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [governorateId]);

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  // Show coming soon if no governorateId or no events
  if (!governorateId || events.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
              <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-lg text-emerald-600 dark:text-emerald-400 font-medium mb-4">
              {t("subtitle", { governorate: governorateName })}
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
              <CardContent className="p-12 text-center relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-8 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  قريباً...
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
                  نعمل على تنظيم فعاليات وورش عمل رائعة لشباب {governorateName}.
                </p>
                <Button variant="ghost" size="lg" asChild>
                  <Link href="/events">
                    تصفح جميع الفعاليات
                    <ArrowRight className="w-5 h-5 mr-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full mb-6">
            <Calendar className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            فعاليات {governorateName}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            انضم إلينا في الفعاليات القادمة في محافظة {governorateName}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const status = getEventRegistrationStatus({
              registrationEnabled: event.registrationEnabled,
              eventDate: event.eventDate,
              currentParticipants: event.currentParticipants,
              maxParticipants: event.maxParticipants,
              published: event.published,
            });
            const imageProps = getNextImageProps(event.coverImage, '/images/placeholder-event.jpg');

            return (
              <Link href={`/events/${event.slug}`} key={event._id}>
                <Card className="group h-full overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={imageProps.src}
                      alt={event.arabicTitle || event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      unoptimized={imageProps.unoptimized}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={status.canRegister ? "default" : "secondary"}
                        className={status.badgeColor === 'green' ? 'bg-green-500' : 
                          status.badgeColor === 'orange' ? 'bg-orange-500' : ''}
                      >
                        {status.badgeTextAr}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {event.arabicTitle || event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatShortDate(event.eventDate, 'ar')}</span>
                        {event.eventTime && (
                          <>
                            <span>•</span>
                            <span>{event.eventTime}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{event.arabicLocation || event.location}</span>
                      </div>
                      {event.maxParticipants && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{event.currentParticipants || 0}/{event.maxParticipants}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" asChild>
            <Link href="/events">
              عرض جميع الفعاليات
              <ArrowRight className="w-5 h-5 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

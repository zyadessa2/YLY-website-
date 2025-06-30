import { EventsService } from "@/lib/database";
import { notFound } from "next/navigation";
import { EventDetailHero } from "../_components/EventDetailHero";
import { EventContent } from "../_components/EventContent";
import { RelatedEvents } from "../_components/RelatedEvents";
import type { Metadata } from "next";

// Define types for page props
type EventParams = {
  slug: string;
};

type Props = {
  params: Promise<EventParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const event = await EventsService.getEventBySlug(slug);

    return {
      title: `${event.title} - YLY Events`,
      description: event.description,
      openGraph: {
        title: event.title,
        description: event.description,
        images: [event.cover_image || "/images/hero.jpg"],
      },
    };
  } catch (error) {
    console.error("Error fetching event for metadata:", error);
    return {
      title: "Event Not Found - YLY Events",
      description: "The requested event could not be found.",
    };
  }
}

export async function generateStaticParams() {
  try {
    const allEvents = await EventsService.getAllEvents();
    return allEvents.slice(0, 10).map((event) => ({
      slug: event.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default async function EventDetailPage({ params }: Props) {
  try {
    const { slug } = await params;
    const event = await EventsService.getEventBySlug(slug);

    return (
      <div dir="rtl" className="min-h-screen bg-background">
        {" "}
        {/* Event Detail Hero */}
        <EventDetailHero
          title={event.title}
          date={event.event_date}
          location={event.location}
          image={event.cover_image || "/images/hero.jpg"}
        />
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Content */}
            <div className="lg:col-span-2">
              <EventContent title={event.title} content={event.content} images={event.content_images} registrationLink={event.registration_link}/>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <RelatedEvents currentEventId={event.id} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching event:", error);
    notFound();
  }
}

import { Metadata } from "next";
import { getEventBySlug } from "../_data/events";

import { notFound } from "next/navigation";
import { EventDetailHero } from "../_components/EventDetailHero";
import { EventContent } from "../_components/EventContent";
import { RelatedEvents } from "../_components/RelatedEvents";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const event = getEventBySlug(params.slug);

  if (!event) {
    return {
      title: "Event Not Found - YLY Events",
    };
  }

  return {
    title: `${event.title} | YLY Events`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [event.logo],
    },
  };
}

export default function EventPage({ params }: EventPageProps) {
  const event = getEventBySlug(params.slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <EventDetailHero
        title={event.title}
        date={event.date}
        location={event.location}
        image={event.logo}
      />
      <EventContent
        content={event.content}
        images={event.images}
        registrationLink={event.registrationLink}
      />
      <RelatedEvents currentEventId={event.id} />
    </main>
  );
}
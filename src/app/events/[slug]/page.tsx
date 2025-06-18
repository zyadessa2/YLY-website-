/* eslint-disable @typescript-eslint/no-unused-vars */
import { getEventBySlug } from "../_data/events";
import { notFound } from "next/navigation";
import { EventDetailHero } from "../_components/EventDetailHero";
import { EventContent } from "../_components/EventContent";
import { RelatedEvents } from "../_components/RelatedEvents";

import type { Metadata, ResolvingMetadata } from "next";

// Define types for page props
type EventParams = {
  slug: string;
};

type Props = {
  params: EventParams;
  searchParams: Record<string, string | string[] | undefined>;
};

// Function to generate metadata
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);

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

// Main event page component
export default async function EventPage({ params, searchParams }: Props) {
  const event = await getEventBySlug(params.slug);

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

import { eventsService } from "@/lib/api";
import { getSafeImageUrl, isGoogleDriveUrl, convertDriveUrl } from "@/lib/utils/google-drive-image";
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
    const event = await eventsService.getBySlug(slug);

    const title = event.arabicTitle || event.title;
    const description = event.arabicDescription || event.description;

    return {
      title: `${title} - YLY Events`,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [getSafeImageUrl(event.coverImage)],
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
    const response = await eventsService.getAll({ published: true, limit: 10 });
    const data = Array.isArray(response?.data) ? response.data : [];
    return data.map((event) => ({
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
    const event = await eventsService.getBySlug(slug);

    // Get display texts (Arabic preferred)
    const title = event.arabicTitle || event.title;
    const content = event.arabicContent || event.content;
    const location = event.arabicLocation || event.location;
    
    // Get cover image using utility function
    const coverImage = getSafeImageUrl(event.coverImage);
    
    // Process content images
    const contentImages = event.contentImages?.map(img => {
      if (isGoogleDriveUrl(img)) return convertDriveUrl(img);
      return img;
    }).filter(Boolean) || [];

    return (
      <div dir="rtl" className="min-h-screen bg-background">
        {/* Event Detail Hero */}
        <EventDetailHero
          title={title}
          date={event.eventDate}
          time={event.eventTime}
          location={location}
          image={coverImage}
          governorate={event.governorateId?.arabicName || event.governorateId?.name}
          registrationEnabled={event.registrationEnabled}
          currentParticipants={event.currentParticipants}
          maxParticipants={event.maxParticipants}
        />
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Content */}
            <div className="lg:col-span-2">
              <EventContent 
                title={title} 
                content={content} 
                images={contentImages}
                event={event}
              />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <RelatedEvents currentEventId={event._id} />
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

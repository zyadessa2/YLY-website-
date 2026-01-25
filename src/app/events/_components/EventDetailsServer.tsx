import { eventsService, EventItem } from "@/lib/api";
import TitleMotion from "@/components/my-components/TitleMotion";
import { EventDetailsClient } from "./EventDetailsClient";

export async function EventDetailsServer() {
  let eventsData: EventItem[] = [];
  
  try {
    const response = await eventsService.getAll({ published: true, limit: 50 });
    eventsData = response.data || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    // Continue with empty data - will show "no events" message
  }

  return (
    <section className="relative mx-auto max-w-7xl px-4 py-16">
      <TitleMotion title="More Details" className="mb-12" />
      {eventsData.length > 0 ? (
        <EventDetailsClient initialData={eventsData} />
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg text-gray-500 mb-2">
              No events available at the moment.
            </p>
            <p className="text-sm text-gray-400">
              Please check back later or ensure the backend server is running.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

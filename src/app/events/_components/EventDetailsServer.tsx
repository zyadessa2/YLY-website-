import { EventsService } from "@/lib/database";
import TitleMotion from "@/components/my-components/TitleMotion";
import { EventDetailsClient } from "./EventDetailsClient";

export async function EventDetailsServer() {
  try {
    const eventsData = await EventsService.getAllEvents();

    return (
      <section className="relative mx-auto max-w-7xl px-4 py-16">
        <TitleMotion title="More Details" className="mb-12" />
        <EventDetailsClient initialData={eventsData} />
      </section>
    );
  } catch (error) {
    console.error("Error fetching events:", error);

    return (
      <section className="relative mx-auto max-w-7xl px-4 py-16">
        <TitleMotion title="More Details" className="mb-12" />
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-lg text-red-500">
            Unable to load events at this time. Please try again later.
          </p>
        </div>
      </section>
    );
  }
}

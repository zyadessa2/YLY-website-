import { Metadata } from "next";
import { EventHero } from "./_components/EventHero";
import { CentralEvents } from "./_components/CentralEvents";
import { EventDetails } from "./_components/EventDetails";

export const metadata: Metadata = {
  title: "YLY Events | Youth Leading Youth",
  description:
    "Join YLY's transformative events designed to empower youth through sports, education, and leadership activities. Discover our upcoming events and programs.",
  openGraph: {
    title: "YLY Events | Youth Leading Youth",
    description:
      "Join YLY's transformative events designed to empower youth through sports, education, and leadership activities.",
    images: ["/images/eventLogos/YLY-Competition-1024x1024.png"],
  },
};

export default function EventsPage() {
  return (
    <main className="min-h-screen">
      <EventHero />
      <CentralEvents />
      <EventDetails />
    </main>
  );
}

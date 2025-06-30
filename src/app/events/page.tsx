import { Metadata } from "next";
import { EventHero } from "./_components/EventHero";
import { CentralEvents } from "./_components/CentralEvents";
import { EventDetailsServer } from "./_components/EventDetailsServer";

export const metadata: Metadata = {
  title: "YLY Events | Youth Leading Youth",
  description:
    "Join YLY's transformative events designed to empower youth through sports, education, and leadership activities. Discover our upcoming events and programs.",
  openGraph: {
    title: "YLY Events | Youth Leading Youth",
    description:
      "Join YLY's transformative events designed to empower youth through sports, education, and leadership activities.",
    images: ["/public/images/belo.png"],
  },
};

export default function EventsPage() {
  return (
    <main className="min-h-screen">
      <EventHero />
      <CentralEvents />
      <EventDetailsServer />
    </main>
  );
}

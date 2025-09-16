import { Metadata } from "next";
import { NewsHero } from "./_components/NewsHero";
import { NewsGridServer } from "./_components/NewsGridServer";

export const metadata: Metadata = {
  title: "News | Youth Leading Youth",
  description:
    "Stay updated with the latest news and updates from YLY. Read about our recent events, achievements, and initiatives empowering youth across Egypt.",
  openGraph: {
    title: "News | Youth Leading Youth",
    description:
      "Stay updated with the latest news and updates from YLY. Read about our recent events, achievements, and initiatives empowering youth across Egypt.",
    images: ["/images/hero.jpg"],
  },
};

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      <NewsHero />
      <NewsGridServer />
    </main>
  );
}

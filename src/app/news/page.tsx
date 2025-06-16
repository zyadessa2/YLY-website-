import { NewsHero } from "./_components/NewsHero";
import { NewsGrid } from "./_components/NewsGrid";

export default function NewsPage() {
  return (
    <main className="min-h-screen">
      <NewsHero />
      <NewsGrid />
    </main>
  );
}

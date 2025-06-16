"use client";

import { NewsItem } from "../_data/news";
import { NewsCard } from "./NewsCard";

interface RelatedNewsProps {
  currentNewsId: string;
  allNews: NewsItem[];
}

export const RelatedNews = ({ currentNewsId, allNews }: RelatedNewsProps) => {
  const relatedArticles = allNews
    .filter((news) => news.slug !== currentNewsId)
    .slice(0, 3); // Show up to 3 related articles

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Related Articles
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {relatedArticles.map((news, index) => (
            <NewsCard
              key={news.id}
              title={news.title}
              description={news.description}
              image={news.image}
              date={news.date}
              author={news.author}
              slug={news.slug}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

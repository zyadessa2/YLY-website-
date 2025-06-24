"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Loader2,
} from "lucide-react";
import { NewsItem, NewsService } from "@/lib/database";
import Image from "next/image";

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    const filtered = news.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNews(filtered);
  }, [searchQuery, news]);

  const loadNews = async () => {
    try {
      setIsLoading(true);
      const data = await NewsService.getAllNewsForAdmin();
      setNews(data);
      setFilteredNews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load news");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      try {
        await NewsService.deleteNews(id);
        await loadNews(); // Reload the list
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete news");
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your news articles and content
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/news/add">
            <Plus className="mr-2 h-4 w-4" />
            Add News
          </Link>
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search news by title, description, or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <Card>
          <CardContent className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading news articles...</p>
          </CardContent>
        </Card>
      ) : (
        /* News List */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              All News ({filteredNews.length})
            </h2>
          </div>

          {filteredNews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No news articles found.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredNews.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <User className="mr-1 h-4 w-4" />
                                {item.author}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                {formatDate(item.created_at)}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/news/${item.slug}`} target="_blank">
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/news/edit/${item.id}`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

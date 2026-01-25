"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Calendar, User, Loader2, Globe, Star } from "lucide-react";
import { newsService, type NewsItem, authService } from "@/lib/api";
import Image from "next/image";
import { processImageUrl } from "@/lib/image-upload";

// Helper to safely get text from new API format (separate title/arabicTitle) or legacy format
const getDisplayText = (item: NewsItem, field: 'title' | 'description'): string => {
  if (field === 'title') {
    // New API format with separate fields
    if ('arabicTitle' in item && item.arabicTitle) {
      return item.title || item.arabicTitle;
    }
    // Legacy format with bilingual object
    if (typeof item.title === 'object' && item.title !== null) {
      const bilingualTitle = item.title as unknown as { ar: string; en: string };
      return bilingualTitle.en || bilingualTitle.ar || '';
    }
    return String(item.title || '');
  }
  if (field === 'description') {
    // New API format
    if ('arabicDescription' in item && item.arabicDescription) {
      return item.description || item.arabicDescription;
    }
    // Legacy format
    if (typeof item.description === 'object' && item.description !== null) {
      const bilingualDesc = item.description as unknown as { ar: string; en: string };
      return bilingualDesc.en || bilingualDesc.ar || '';
    }
    return String(item.description || '');
  }
  return '';
};

export default function NewsManagementPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadNews() {
      try {
        setIsLoading(true);
        setError(null);

        // Check authentication first using auth service
        if (!authService.isAuthenticated()) {
          window.location.href = "/signin";
          return;
        }
        
        setIsAdmin(authService.isAdmin());

        // Fetch news data from API
        const response = await newsService.getAll({ limit: 100 });
        setNews(response.data);
        setFilteredNews(response.data);
      } catch (err) {
        console.error("Error loading news:", err);
        setError("Failed to load news data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
  }, []);

  // Filter news based on search query
  useEffect(() => {
    const filtered = news.filter((item) => {
      const title = getDisplayText(item, 'title').toLowerCase();
      const description = getDisplayText(item, 'description').toLowerCase();
      const author = (item.author || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      return title.includes(query) || description.includes(query) || author.includes(query);
    });
    setFilteredNews(filtered);
  }, [searchQuery, news]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      try {
        setIsDeleting(id);
        await newsService.delete(id);
        // Update local state
        const updatedNews = news.filter((item) => item._id !== id);
        setNews(updatedNews);
      } catch (error) {
        console.error("Error deleting news:", error);
        alert("Failed to delete news article. Please try again.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await newsService.togglePublished(id);
      // Update local state
      const updatedNews = news.map((item) =>
        item._id === id ? { ...item, published: !currentStatus } : item
      );
      setNews(updatedNews);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update publish status. Please try again.");
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    if (!isAdmin) return;
    try {
      await newsService.toggleFeatured(id);
      // Update local state
      const updatedNews = news.map((item) =>
        item._id === id ? { ...item, featured: !currentStatus } : item
      );
      setNews(updatedNews);
    } catch (error) {
      console.error("Error toggling featured status:", error);
      alert("Failed to update featured status. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
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
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            All News ({filteredNews.length})
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading news articles...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredNews.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No news articles found.</p>
            </CardContent>
          </Card>
        )}

        {/* News List */}
        {!isLoading && !error && filteredNews.length > 0 && (
          <div className="grid gap-4">
            {filteredNews.map((item) => (
              <Card key={item._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={processImageUrl(item.coverImage)}
                        alt={getDisplayText(item, 'title')}
                        className="w-24 h-24 object-cover rounded-lg"
                        width={96}
                        height={96}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {getDisplayText(item, 'title')}
                            </h3>
                            <Badge variant={item.published ? "default" : "secondary"}>
                              {item.published ? "Published" : "Draft"}
                            </Badge>
                            {item.featured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                            {getDisplayText(item, 'description')}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <User className="mr-1 h-4 w-4" />
                              {item.author || 'Unknown'}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4" />
                              {formatDate(item.createdAt)}
                            </div>
                            {item.governorateId && (
                              <div className="flex items-center">
                                <Globe className="mr-1 h-4 w-4" />
                                {typeof item.governorateId === 'object' ? item.governorateId.name : item.governorateId}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleTogglePublish(item._id, item.published)}
                            title={item.published ? "Unpublish" : "Publish"}
                          >
                            {item.published ? "Unpublish" : "Publish"}
                          </Button>
                          {isAdmin && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleFeatured(item._id, item.featured)}
                              title={item.featured ? "Unfeature" : "Feature"}
                              className={item.featured ? "text-yellow-600" : ""}
                            >
                              <Star className={`h-4 w-4 ${item.featured ? 'fill-current' : ''}`} />
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/news/${item.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/news/edit/${item._id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isDeleting === item._id}
                          >
                            {isDeleting === item._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
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
    </div>
  );
}

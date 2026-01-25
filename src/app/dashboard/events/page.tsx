'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  MapPin,
  Loader2,
  Users,
  Star,
  Globe,
} from 'lucide-react';
import { eventsService, EventItem, authService } from '@/lib/api';
import Image from 'next/image';
import { processImageUrl } from '@/lib/image-upload';

// Helper to safely get text from new API format (separate title/arabicTitle) or legacy format
const getDisplayText = (item: EventItem, field: 'title' | 'description' | 'location'): string => {
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
  if (field === 'location') {
    // New API format
    if ('arabicLocation' in item && item.arabicLocation) {
      return item.location || item.arabicLocation;
    }
    // Legacy format
    if (typeof item.location === 'object' && item.location !== null) {
      const bilingualLoc = item.location as unknown as { ar: string; en: string };
      return bilingualLoc.en || bilingualLoc.ar || '';
    }
    return String(item.location || '');
  }
  return '';
};

export default function EventsManagementPage() {  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);

        // Check authentication first
        if (!authService.isAuthenticated()) {
          window.location.href = "/signin";
          return;
        }
        
        setIsAdmin(authService.isAdmin());

        // Fetch events data from API
        const response = await eventsService.getAll({ limit: 100 });
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter((item) => {
      const titleText = getDisplayText(item, 'title').toLowerCase();
      const descText = getDisplayText(item, 'description').toLowerCase();
      const locationText = getDisplayText(item, 'location').toLowerCase();
      const query = searchQuery.toLowerCase();
      return titleText.includes(query) || descText.includes(query) || locationText.includes(query);
    });
    setFilteredEvents(filtered);
  }, [searchQuery, events]);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setIsDeleting(id);
        await eventsService.delete(id);
        // Update local state
        const updatedEvents = events.filter((item) => item._id !== id);
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await eventsService.togglePublished(id);
      // Update local state
      const updatedEvents = events.map((item) =>
        item._id === id ? { ...item, published: !currentStatus } : item
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      alert("Failed to update publish status. Please try again.");
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    if (!isAdmin) return;
    try {
      await eventsService.toggleFeatured(id);
      // Update local state
      const updatedEvents = events.map((item) =>
        item._id === id ? { ...item, featured: !currentStatus } : item
      );
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error toggling featured status:", error);
      alert("Failed to update featured status. Please try again.");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isUpcoming = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate > today;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your events and activities
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
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
                placeholder="Search events by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>      {/* Events List */}
      <div className="space-y-4">        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Events ({filteredEvents.length})</h2>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading events...</p>
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
        {!isLoading && !error && filteredEvents.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No events found.</p>
            </CardContent>
          </Card>
        )}
          <div className="grid gap-4">
            {filteredEvents.map((item) => (
              <Card key={item._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">                    
                    {/* Cover Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={processImageUrl(item.coverImage) || '/images/placeholder.jpg'}
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
                            <Badge variant={isUpcoming(item.eventDate) ? "default" : "secondary"}>
                              {isUpcoming(item.eventDate) ? "Upcoming" : "Past"}
                            </Badge>
                            <Badge variant={item.published ? "default" : "outline"}>
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
                              <Calendar className="mr-1 h-4 w-4" />
                              {formatDate(item.eventDate)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {getDisplayText(item, 'location')}
                            </div>
                            {item.governorateId && (
                              <div className="flex items-center">
                                <Globe className="mr-1 h-4 w-4" />
                                {typeof item.governorateId === 'object' ? item.governorateId.name : item.governorateId}
                              </div>
                            )}
                            {item.currentParticipants !== undefined && (
                              <div className="flex items-center">
                                <Users className="mr-1 h-4 w-4" />
                                {item.currentParticipants} registrations
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
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/dashboard/events/${item._id}/registrations`}>
                              <Users className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/events/${item.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/dashboard/events/edit/${item._id}`}>
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
      </div>
    </div>
  );
}

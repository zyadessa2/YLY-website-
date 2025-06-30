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
  
} from 'lucide-react';
import { EventItem, EventsService } from '@/lib/database';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function EventsManagementPage() {  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        setError(null);

        // Check authentication first
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          window.location.href = "/signin";
          return;
        }

        // Fetch events data from Supabase
        const eventsData = await EventsService.getAllEventsForAdmin();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
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
    const filtered = events.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        // Delete from database
        setIsDeleting(id);
        await EventsService.deleteEvent(id);
        
        // Update local state
        const updatedEvents = events.filter((item) => item.id !== id);
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      } finally {
        setIsDeleting(null);
      }
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
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex gap-4">                    
                    {/* Cover Image */}
                    <div className="flex-shrink-0">
                      <Image
                        src={item.cover_image || '/images/placeholder.jpg'}
                        alt={item.title}
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
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.title}
                            </h3>                            
                            <Badge variant={isUpcoming(item.event_date) ? "default" : "secondary"}>
                              {isUpcoming(item.event_date) ? "Upcoming" : "Past"}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>                          
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4" />
                              {formatDate(item.event_date)}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {item.location}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
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
                            <Link href={`/dashboard/events/edit/${item.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isDeleting === item.id}
                          >
                            {isDeleting === item.id ? (
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

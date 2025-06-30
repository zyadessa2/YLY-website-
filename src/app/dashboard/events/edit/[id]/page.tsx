'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { ImageUploader, MultiImageUploader } from '@/components/ui/image-uploader';
import { EventsService, EventItem, UpdateEventData } from '@/lib/database';
import { supabase } from '@/lib/supabase';

// Form schema
const schema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters'),
  content: yup
    .string()
    .required('Content is required')
    .min(100, 'Content must be at least 100 characters'),
  location: yup
    .string()
    .required('Location is required'),
  event_date: yup
    .string()
    .required('Date is required'),
  event_time: yup
    .string()
    .nullable(),
  cover_image: yup
    .string()
    .nullable(),
  content_images: yup
    .array()
    .of(yup.string())
    .nullable(),
  slug: yup
    .string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  registration_link: yup
    .string()
    .nullable(),
  max_participants: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .nullable(),
  published: yup
    .boolean()
    .default(false),
  featured: yup
    .boolean()
    .default(false),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [eventItem, setEventItem] = useState<EventItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [contentImages, setContentImages] = useState<string[]>([]);

  const form = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: '',
      description: '',
      content: '',
      location: '',
      event_date: '',
      event_time: '',
      cover_image: null,
      content_images: [],
      slug: '',
      registration_link: '',
      max_participants: null,
      published: false,
      featured: false,
    },
  });

  // Handle cover image upload
  const handleCoverImageUpload = (result: { url: string; path: string }) => {
    setCoverImageUrl(result.url);
    form.setValue('cover_image', result.url);
    form.clearErrors('cover_image');
  };
  
  // Handle content images upload
  const handleContentImagesUpload = (urls: string[]) => {
    setContentImages(urls);
    form.setValue('content_images', urls);
  };
  
  // Handle image upload errors
  const handleImageUploadError = (error: Error) => {
    setError(error.message);
    form.setError('cover_image', {
      type: 'manual',
      message: error.message,
    });
  };

  // Check authentication
  React.useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    async function loadEvent() {
      try {
        // Find the event item by ID
        const id = params.id as string;
        const event = await EventsService.getEventById(id);
        
        if (event) {
          setEventItem(event);
          setCoverImageUrl(event.cover_image);
          setContentImages(event.content_images || []);
          
          // Populate form with existing data
          form.reset({
            title: event.title,
            description: event.description,
            content: event.content,
            location: event.location,
            event_date: event.event_date,
            event_time: event.event_time || '',
            cover_image: event.cover_image,
            content_images: event.content_images || [],
            slug: event.slug,
            registration_link: event.registration_link || '',
            max_participants: event.max_participants || null,
            published: event.published,
            featured: event.featured,
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading event:', err);
        setNotFound(true);
      }
    }
    
    loadEvent();
  }, [params.id, form]);

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      if (!eventItem) return;

      const eventData: UpdateEventData = {
        title: data.title,
        description: data.description,
        content: data.content,
        location: data.location,
        event_date: data.event_date,
        event_time: data.event_time || undefined,
        cover_image: data.cover_image || '',
        content_images: (data.content_images || []).filter((img): img is string => img !== undefined),
        slug: data.slug,
        registration_link: data.registration_link || undefined,
        max_participants: data.max_participants || undefined,
        published: data.published,
        featured: data.featured,
      };

      // Update in database using Supabase
      await EventsService.updateEvent(eventItem.id, eventData);

      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/events');
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      setError(errorMessage);
      console.error('Error updating event:', err);
    } finally {
      setIsLoading(false);
    }
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-4">The event you&apos;re looking for doesn&apos;t exist.</p>
            <Button asChild>
              <Link href="/dashboard/events">Back to Events List</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!eventItem) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-gray-600 mt-1">
            Update the event information
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Update the information below to modify the event
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Event updated successfully! Redirecting to events list...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  disabled={isLoading}
                  {...form.register('title')}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Date and Time */}
              <div>
                <Label htmlFor="event_date">Date *</Label>
                <Input
                  id="event_date"
                  type="date"
                  disabled={isLoading}
                  {...form.register('event_date')}
                />
                {form.formState.errors.event_date && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.event_date.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="event_time">Time (optional)</Label>
                <Input
                  id="event_time"
                  type="time"
                  disabled={isLoading}
                  {...form.register('event_time')}
                />
                {form.formState.errors.event_time && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.event_time.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  disabled={isLoading}
                  {...form.register('location')}
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  placeholder="url-friendly-slug"
                  disabled={isLoading}
                  {...form.register('slug')}
                />
                {form.formState.errors.slug && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              {/* Registration Link */}
              <div>
                <Label htmlFor="registration_link">Registration Link (optional)</Label>
                <Input
                  id="registration_link"
                  type="url"
                  placeholder="https://example.com/register"
                  disabled={isLoading}
                  {...form.register('registration_link')}
                />
                {form.formState.errors.registration_link && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.registration_link.message}
                  </p>
                )}
              </div>

              {/* Max Participants */}
              <div>
                <Label htmlFor="max_participants">Max Participants (optional)</Label>
                <Input
                  id="max_participants"
                  type="number"
                  placeholder="100"
                  disabled={isLoading}
                  {...form.register('max_participants')}
                />
                {form.formState.errors.max_participants && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.max_participants.message}
                  </p>
                )}
              </div>

              {/* Cover Image */}
              <div className="md:col-span-2">
                <ImageUploader 
                  id="cover_image"
                  label="Cover Image"
                  description="Upload a high-quality image that represents your event (16:9 aspect ratio recommended)"
                  existingUrl={coverImageUrl || undefined}
                  bucket="events"
                  folder="covers"
                  onUploadComplete={handleCoverImageUpload}
                  onError={handleImageUploadError}
                  disabled={isLoading}
                  required={true}
                />
                {form.formState.errors.cover_image && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.cover_image.message}
                  </p>
                )}
              </div>

              {/* Content Images */}
              <div className="md:col-span-2">
                <MultiImageUploader 
                  id="content_images"
                  label="Content Images"
                  description="Upload additional images to include in the event content (up to 10 images)"
                  existingUrls={contentImages}
                  bucket="events"
                  folder="content"
                  onUploadComplete={handleContentImagesUpload}
                  onError={handleImageUploadError}
                  disabled={isLoading}
                  className="mt-4"
                />
                {form.formState.errors.content_images && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.content_images.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the event"
                  rows={3}
                  disabled={isLoading}
                  {...form.register('description')}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="md:col-span-2 mb-5">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Full event details (supports HTML)"
                  rows={10}
                  disabled={isLoading}
                  {...form.register('content')}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;)
                </p>
              </div>

              {/* Publication Settings */}
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Switch 
                    id="published" 
                    checked={form.watch('published')}
                    onCheckedChange={(checked) => form.setValue('published', checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
                <p className="text-sm text-gray-500">
                  If unchecked, the event will be saved as a draft
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Switch 
                    id="featured" 
                    checked={form.watch('featured')}
                    onCheckedChange={(checked) => form.setValue('featured', checked)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="featured">Feature on homepage</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Featured events appear in the showcase area
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Event
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

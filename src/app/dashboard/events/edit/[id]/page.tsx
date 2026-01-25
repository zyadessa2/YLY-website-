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
import { eventsService, authService, EventItem, UpdateEventData } from '@/lib/api';

// Form schema for bilingual content
const schema = yup.object({
  titleAr: yup
    .string()
    .required('Arabic title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters'),
  titleEn: yup
    .string()
    .required('English title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title must be less than 200 characters'),
  descriptionAr: yup
    .string()
    .required('Arabic description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters'),
  descriptionEn: yup
    .string()
    .required('English description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be less than 500 characters'),
  contentAr: yup
    .string()
    .required('Arabic content is required')
    .min(100, 'Content must be at least 100 characters'),
  contentEn: yup
    .string()
    .required('English content is required')
    .min(100, 'Content must be at least 100 characters'),
  locationAr: yup
    .string()
    .required('Arabic location is required'),
  locationEn: yup
    .string()
    .required('English location is required'),
  eventDate: yup
    .string()
    .required('Date is required'),
  eventTime: yup
    .string()
    .nullable(),
  coverImage: yup
    .string()
    .nullable(),
  contentImages: yup
    .array()
    .of(yup.string())
    .nullable(),
  slug: yup
    .string()
    .required('Slug is required')
    .matches(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  registrationLink: yup
    .string()
    .nullable(),
  maxParticipants: yup
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
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [eventItem, setEventItem] = useState<EventItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  const form = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      contentAr: '',
      contentEn: '',
      locationAr: '',
      locationEn: '',
      eventDate: '',
      eventTime: '',
      coverImage: null,
      contentImages: [],
      slug: '',
      registrationLink: '',
      maxParticipants: null,
      published: false,
      featured: false,
    },
  });

  // Check authentication
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/signin');
    }
  }, [router]);

  useEffect(() => {
    async function loadEvent() {
      try {
        setIsFetching(true);
        // Find the event item by ID
        const id = params.id as string;
        const event = await eventsService.getById(id);
        
        if (event) {
          setEventItem(event);

          // Populate form with existing data (handling both new and legacy format)
          const titleText = event.arabicTitle ? { ar: event.arabicTitle, en: event.title } : 
            (typeof event.title === 'object' ? event.title as { ar: string; en: string } : { ar: '', en: String(event.title || '') });
          const descText = event.arabicDescription ? { ar: event.arabicDescription, en: event.description } :
            (typeof event.description === 'object' ? event.description as { ar: string; en: string } : { ar: '', en: String(event.description || '') });
          const contentText = event.arabicContent ? { ar: event.arabicContent, en: event.content } :
            (typeof event.content === 'object' ? event.content as { ar: string; en: string } : { ar: '', en: String(event.content || '') });
          const locationText = event.arabicLocation ? { ar: event.arabicLocation, en: event.location } :
            (typeof event.location === 'object' ? event.location as { ar: string; en: string } : { ar: '', en: String(event.location || '') });

          form.reset({
            titleAr: titleText.ar,
            titleEn: titleText.en,
            descriptionAr: descText.ar,
            descriptionEn: descText.en,
            contentAr: contentText.ar,
            contentEn: contentText.en,
            locationAr: locationText.ar,
            locationEn: locationText.en,
            eventDate: event.eventDate || '',
            eventTime: event.eventTime || '',
            coverImage: event.coverImage || null,
            contentImages: event.contentImages || [],
            slug: event.slug || '',
            registrationLink: '', // No longer in API
            maxParticipants: event.maxParticipants || null,
            published: event.published || false,
            featured: event.featured || false,
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading event:', err);
        setNotFound(true);
      } finally {
        setIsFetching(false);
      }
    }
    
    if (params.id) {
      loadEvent();
    }
  }, [params.id, form]);

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      if (!eventItem) return;

      // Use new API format with separate fields
      const eventData: UpdateEventData = {
        title: data.titleEn,
        arabicTitle: data.titleAr,
        description: data.descriptionEn,
        arabicDescription: data.descriptionAr,
        content: data.contentEn,
        arabicContent: data.contentAr,
        location: data.locationEn,
        arabicLocation: data.locationAr,
        eventDate: data.eventDate,
        eventTime: data.eventTime || undefined,
        coverImage: data.coverImage || '',
        contentImages: (data.contentImages || []).filter((img): img is string => img !== undefined),
        maxParticipants: data.maxParticipants || undefined,
        published: data.published,
        featured: data.featured,
      };

      // Update using new API service
      await eventsService.update(eventItem._id, eventData);

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

  if (isFetching || !eventItem) {
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
            Update the bilingual information below to modify the event
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
            {/* English Section */}
            <div className="border rounded-lg p-4 bg-blue-50/30">
              <h3 className="font-semibold text-lg mb-4 text-blue-700">🇺🇸 English Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* English Title */}
                <div className="md:col-span-2">
                  <Label htmlFor="titleEn">Title (English) *</Label>
                  <Input
                    id="titleEn"
                    placeholder="Enter event title in English"
                    disabled={isLoading}
                    {...form.register('titleEn')}
                  />
                  {form.formState.errors.titleEn && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.titleEn.message}
                    </p>
                  )}
                </div>

                {/* English Location */}
                <div>
                  <Label htmlFor="locationEn">Location (English) *</Label>
                  <Input
                    id="locationEn"
                    placeholder="Event location in English"
                    disabled={isLoading}
                    {...form.register('locationEn')}
                  />
                  {form.formState.errors.locationEn && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.locationEn.message}
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

                {/* English Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="descriptionEn">Description (English) *</Label>
                  <Textarea
                    id="descriptionEn"
                    placeholder="Brief description in English"
                    rows={3}
                    disabled={isLoading}
                    {...form.register('descriptionEn')}
                  />
                  {form.formState.errors.descriptionEn && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.descriptionEn.message}
                    </p>
                  )}
                </div>

                {/* English Content */}
                <div className="md:col-span-2">
                  <Label htmlFor="contentEn">Content (English) *</Label>
                  <Textarea
                    id="contentEn"
                    placeholder="Full event details in English (supports HTML)"
                    rows={8}
                    disabled={isLoading}
                    {...form.register('contentEn')}
                  />
                  {form.formState.errors.contentEn && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.contentEn.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Arabic Section */}
            <div className="border rounded-lg p-4 bg-green-50/30" dir="rtl">
              <h3 className="font-semibold text-lg mb-4 text-green-700">🇸🇦 المحتوى العربي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Arabic Title */}
                <div className="md:col-span-2">
                  <Label htmlFor="titleAr">العنوان (عربي) *</Label>
                  <Input
                    id="titleAr"
                    placeholder="أدخل عنوان الفعالية بالعربية"
                    disabled={isLoading}
                    {...form.register('titleAr')}
                  />
                  {form.formState.errors.titleAr && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.titleAr.message}
                    </p>
                  )}
                </div>

                {/* Arabic Location */}
                <div className="md:col-span-2">
                  <Label htmlFor="locationAr">المكان (عربي) *</Label>
                  <Input
                    id="locationAr"
                    placeholder="مكان الفعالية بالعربية"
                    disabled={isLoading}
                    {...form.register('locationAr')}
                  />
                  {form.formState.errors.locationAr && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.locationAr.message}
                    </p>
                  )}
                </div>

                {/* Arabic Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="descriptionAr">الوصف (عربي) *</Label>
                  <Textarea
                    id="descriptionAr"
                    placeholder="وصف مختصر بالعربية"
                    rows={3}
                    disabled={isLoading}
                    {...form.register('descriptionAr')}
                  />
                  {form.formState.errors.descriptionAr && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.descriptionAr.message}
                    </p>
                  )}
                </div>

                {/* Arabic Content */}
                <div className="md:col-span-2">
                  <Label htmlFor="contentAr">المحتوى (عربي) *</Label>
                  <Textarea
                    id="contentAr"
                    placeholder="تفاصيل الفعالية الكاملة بالعربية (يدعم HTML)"
                    rows={8}
                    disabled={isLoading}
                    {...form.register('contentAr')}
                  />
                  {form.formState.errors.contentAr && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.contentAr.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details Section */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">📅 Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div>
                  <Label htmlFor="eventDate">Date *</Label>
                  <Input
                    id="eventDate"
                    type="date"
                    disabled={isLoading}
                    {...form.register('eventDate')}
                  />
                  {form.formState.errors.eventDate && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.eventDate.message}
                    </p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <Label htmlFor="eventTime">Time (optional)</Label>
                  <Input
                    id="eventTime"
                    type="time"
                    disabled={isLoading}
                    {...form.register('eventTime')}
                  />
                </div>

                {/* Registration Link */}
                <div>
                  <Label htmlFor="registrationLink">Registration Link (optional)</Label>
                  <Input
                    id="registrationLink"
                    type="url"
                    placeholder="https://example.com/register"
                    disabled={isLoading}
                    {...form.register('registrationLink')}
                  />
                </div>

                {/* Max Participants */}
                <div>
                  <Label htmlFor="maxParticipants">Max Participants (optional)</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="100"
                    disabled={isLoading}
                    {...form.register('maxParticipants')}
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">📷 Images</h3>
              <div className="space-y-4">
                {/* Cover Image URL */}
                <div>
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    placeholder="https://drive.google.com/... or https://example.com/image.jpg"
                    disabled={isLoading}
                    {...form.register('coverImage')}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    The main image displayed for this event. Supports Google Drive links.
                  </p>
                </div>

                {/* Content Images */}
                <div>
                  <Label htmlFor="contentImages">Content Images (comma-separated URLs)</Label>
                  <Textarea
                    id="contentImages"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    rows={3}
                    disabled={isLoading}
                    value={(form.watch('contentImages') || []).join(', ')}
                    onChange={(e) => {
                      const urls = e.target.value
                        .split(',')
                        .map((url) => url.trim())
                        .filter((url) => url.length > 0);
                      form.setValue('contentImages', urls);
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Additional images for the event content (optional)
                  </p>
                </div>
              </div>
            </div>

            {/* Publication Settings */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">⚙️ Publication Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

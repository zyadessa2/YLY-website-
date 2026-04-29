'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Loader2, Globe } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { eventsService, authService, governoratesService, Governorate } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper: convert YYYY-MM-DD to ISO 8601
const dateToISO = (d?: string | null): string | undefined => {
  if (!d) return undefined;
  try { return new Date(d + 'T00:00:00.000Z').toISOString(); } catch { return undefined; }
};

// Form schema with bilingual support
const schema = yup.object({
  // English
  title_en: yup.string().required('English title is required').min(10, 'Min 10 chars').max(200, 'Max 200 chars'),
  description_en: yup.string().required('English description is required').min(10, 'Min 10 chars').max(500, 'Max 500 chars'),
  content_en: yup.string().required('English content is required').min(50, 'Min 50 chars'),
  location_en: yup.string().required('English location is required'),
  // Arabic
  title_ar: yup.string().required('Arabic title is required').min(10, 'Min 10 chars').max(200, 'Max 200 chars'),
  description_ar: yup.string().required('Arabic description is required').min(10, 'Min 10 chars').max(500, 'Max 500 chars'),
  content_ar: yup.string().required('Arabic content is required').min(50, 'Min 50 chars'),
  location_ar: yup.string().required('Arabic location is required'),
  // Date & Time
  event_date: yup.string().required('Event date is required'),
  event_time: yup.string().nullable(),
  end_date: yup.string().nullable(),
  end_time: yup.string().nullable(),
  // Images
  cover_image: yup.string().url('Must be a valid URL').nullable(),
  content_images: yup.string().nullable(),
  // Slug
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, hyphens only'),
  // Registration
  registration_enabled: yup.boolean().default(false),
  registration_deadline: yup.string().nullable(),
  max_participants: yup.number().transform((v) => (isNaN(v) ? undefined : v)).nullable(),
  // Publication
  published: yup.boolean().default(false),
  published_at: yup.string().nullable(),
  featured: yup.boolean().default(false),
  // Tags (comma-separated)
  tags: yup.string().nullable(),
  arabic_tags: yup.string().nullable(),
  // Contact
  contact_email: yup.string().email('Must be a valid email').nullable(),
  contact_phone: yup.string().nullable(),
  // Requirements
  requirements: yup.string().nullable(),
  arabic_requirements: yup.string().nullable(),
  // SEO
  meta_title: yup.string().nullable(),
  meta_description: yup.string().nullable(),
  arabic_meta_title: yup.string().nullable(),
  arabic_meta_description: yup.string().nullable(),
  // Governorate
  governorateId: yup.string().default(''),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function AddEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loadingGovernorates, setLoadingGovernorates] = useState(true);

  const form = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title_en: '',
      title_ar: '',
      description_en: '',
      description_ar: '',
      content_en: '',
      content_ar: '',
      location_en: '',
      location_ar: '',
      event_date: '',
      event_time: '',
      end_date: '',
      end_time: '',
      cover_image: '',
      content_images: '',
      slug: '',
      registration_enabled: false,
      registration_deadline: '',
      max_participants: undefined,
      published: false,
      published_at: '',
      featured: false,
      tags: '',
      arabic_tags: '',
      contact_email: '',
      contact_phone: '',
      requirements: '',
      arabic_requirements: '',
      meta_title: '',
      meta_description: '',
      arabic_meta_title: '',
      arabic_meta_description: '',
      governorateId: '',
    },
  });

  // Auto-generate slug from English title
  const watchTitle = form.watch('title_en');
  const registrationEnabled = form.watch('registration_enabled');
  const isPublished = form.watch('published');
  React.useEffect(() => {
    if (watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  }, [watchTitle, form]);

  // Check authentication
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/signin');
    }
  }, [router]);

  // Load governorates
  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        setLoadingGovernorates(true);
        const data = await governoratesService.getAllSimple();
        setGovernorates(data);
      } catch (err) {
        console.error("Error fetching governorates:", err);
      } finally {
        setLoadingGovernorates(false);
      }
    };
    fetchGovernorates();
  }, []);

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      const contentImagesArray = data.content_images
        ? data.content_images.split(',').map(url => url.trim()).filter(Boolean).slice(0, 10)
        : [];
      const tagsArray = data.tags ? data.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 20) : [];
      const arabicTagsArray = data.arabic_tags ? data.arabic_tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 20) : [];

      const eventData = {
        governorateId: data.governorateId || '',
        title: data.title_en,
        arabicTitle: data.title_ar,
        description: data.description_en,
        arabicDescription: data.description_ar,
        content: data.content_en,
        arabicContent: data.content_ar,
        location: data.location_en,
        arabicLocation: data.location_ar,
        slug: data.slug,
        eventDate: dateToISO(data.event_date) || data.event_date,
        eventTime: data.event_time || undefined,
        endDate: dateToISO(data.end_date),
        endTime: data.end_time || undefined,
        coverImage: data.cover_image || '',
        contentImages: contentImagesArray,
        registrationEnabled: data.registration_enabled,
        registrationDeadline: dateToISO(data.registration_deadline),
        maxParticipants: data.max_participants || undefined,
        published: data.published,
        publishedAt: isPublished && data.published_at ? dateToISO(data.published_at) : undefined,
        featured: data.featured,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        arabicTags: arabicTagsArray.length > 0 ? arabicTagsArray : undefined,
        contactEmail: data.contact_email || undefined,
        contactPhone: data.contact_phone || undefined,
        requirements: data.requirements || undefined,
        arabicRequirements: data.arabic_requirements || undefined,
        metaTitle: data.meta_title || undefined,
        metaDescription: data.meta_description || undefined,
        arabicMetaTitle: data.arabic_meta_title || undefined,
        arabicMetaDescription: data.arabic_meta_description || undefined,
      };

      await eventsService.create(eventData);
      setSuccess(true);
      setTimeout(() => { router.push('/dashboard/events'); }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
      console.error('Error creating event:', err);
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Add Event</h1>
          <p className="text-gray-600 mt-1">
            Create a new event for your website (bilingual)
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Fill in the information below in both English and Arabic
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
                Event created successfully! Redirecting to events list...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* English Section */}
            <div className="border rounded-lg p-6 bg-blue-50/30">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">🇬🇧 English Content</h3>
              <div className="space-y-4">
                {/* English Title */}
                <div>
                  <Label htmlFor="title_en">Title (English) *</Label>
                  <Input
                    id="title_en"
                    placeholder="Enter event title in English"
                    disabled={isLoading}
                    {...form.register('title_en')}
                  />
                  {form.formState.errors.title_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title_en.message}
                    </p>
                  )}
                </div>

                {/* English Location */}
                <div>
                  <Label htmlFor="location_en">Location (English) *</Label>
                  <Input
                    id="location_en"
                    placeholder="Event location in English"
                    disabled={isLoading}
                    {...form.register('location_en')}
                  />
                  {form.formState.errors.location_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.location_en.message}
                    </p>
                  )}
                </div>

                {/* English Description */}
                <div>
                  <Label htmlFor="description_en">Description (English) *</Label>
                  <Textarea
                    id="description_en"
                    placeholder="Brief description of the event in English"
                    rows={3}
                    disabled={isLoading}
                    {...form.register('description_en')}
                  />
                  {form.formState.errors.description_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.description_en.message}
                    </p>
                  )}
                </div>

                {/* English Content */}
                <div>
                  <Label htmlFor="content_en">Content (English) *</Label>
                  <Textarea
                    id="content_en"
                    placeholder="Full event details in English (supports HTML)"
                    rows={8}
                    disabled={isLoading}
                    {...form.register('content_en')}
                  />
                  {form.formState.errors.content_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.content_en.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Arabic Section */}
            <div className="border rounded-lg p-6 bg-green-50/30" dir="rtl">
              <h3 className="text-lg font-semibold mb-4 text-green-800">🇪🇬 المحتوى العربي</h3>
              <div className="space-y-4">
                {/* Arabic Title */}
                <div>
                  <Label htmlFor="title_ar">العنوان (عربي) *</Label>
                  <Input
                    id="title_ar"
                    placeholder="أدخل عنوان الفعالية بالعربية"
                    disabled={isLoading}
                    {...form.register('title_ar')}
                  />
                  {form.formState.errors.title_ar && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title_ar.message}
                    </p>
                  )}
                </div>

                {/* Arabic Location */}
                <div>
                  <Label htmlFor="location_ar">المكان (عربي) *</Label>
                  <Input
                    id="location_ar"
                    placeholder="مكان الفعالية بالعربية"
                    disabled={isLoading}
                    {...form.register('location_ar')}
                  />
                  {form.formState.errors.location_ar && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.location_ar.message}
                    </p>
                  )}
                </div>

                {/* Arabic Description */}
                <div>
                  <Label htmlFor="description_ar">الوصف المختصر (عربي) *</Label>
                  <Textarea
                    id="description_ar"
                    placeholder="وصف مختصر للفعالية بالعربية"
                    rows={3}
                    disabled={isLoading}
                    {...form.register('description_ar')}
                  />
                  {form.formState.errors.description_ar && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.description_ar.message}
                    </p>
                  )}
                </div>

                {/* Arabic Content */}
                <div>
                  <Label htmlFor="content_ar">المحتوى الكامل (عربي) *</Label>
                  <Textarea
                    id="content_ar"
                    placeholder="تفاصيل الفعالية الكاملة بالعربية (يدعم HTML)"
                    rows={8}
                    disabled={isLoading}
                    {...form.register('content_ar')}
                  />
                  {form.formState.errors.content_ar && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.content_ar.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Common Fields Section */}
            <div className="border rounded-lg p-6 bg-gray-50/50">
              <h3 className="text-lg font-semibold mb-4">⚙️ Event Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Governorate Selection */}
                <div className="md:col-span-2">
                  <Label htmlFor="governorateId">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Governorate / المحافظة
                    </div>
                  </Label>
                  <Select
                    value={form.watch("governorateId")}
                    onValueChange={(value) => form.setValue("governorateId", value === "global" ? "" : value)}
                    disabled={isLoading || loadingGovernorates}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={loadingGovernorates ? "Loading governorates..." : "Select governorate (or leave for Global)"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          <span>Global (عام) - Visible to all governorates</span>
                        </div>
                      </SelectItem>
                      {governorates.map((gov) => (
                        <SelectItem key={gov._id} value={gov._id}>
                          <span>{gov.name} - {gov.arabicName}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Select a specific governorate or leave as Global to show for all governorates
                  </p>
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
                </div>

                {/* End Date */}
                <div>
                  <Label htmlFor="end_date">End Date (optional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    disabled={isLoading}
                    {...form.register('end_date')}
                  />
                </div>

                <div>
                  <Label htmlFor="end_time">End Time (optional)</Label>
                  <Input
                    id="end_time"
                    type="time"
                    disabled={isLoading}
                    {...form.register('end_time')}
                  />
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

                {/* Registration */}
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 mb-3">
                    <Switch
                      id="registration_enabled"
                      checked={registrationEnabled}
                      onCheckedChange={(checked) => form.setValue('registration_enabled', checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="registration_enabled">Enable Registration</Label>
                  </div>
                  {registrationEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <Label htmlFor="registration_deadline">Registration Deadline</Label>
                        <Input
                          id="registration_deadline"
                          type="date"
                          disabled={isLoading}
                          {...form.register('registration_deadline')}
                        />
                        <p className="text-sm text-gray-500 mt-1">Must be before event date</p>
                      </div>
                      <div>
                        <Label htmlFor="max_participants">Max Participants</Label>
                        <Input
                          id="max_participants"
                          type="number"
                          placeholder="200"
                          disabled={isLoading}
                          {...form.register('max_participants')}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Image */}
                <div className="md:col-span-2">
                  <Label htmlFor="cover_image">Cover Image URL</Label>
                  <Input
                    id="cover_image"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    disabled={isLoading}
                    {...form.register('cover_image')}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Paste a Google Drive share link or direct image URL
                  </p>
                </div>

                {/* Content Images */}
                <div className="md:col-span-2">
                  <Label htmlFor="content_images">Content Images URLs (optional)</Label>
                  <Textarea
                    id="content_images"
                    placeholder="https://drive.google.com/file/d/..., https://drive.google.com/file/d/..."
                    rows={2}
                    disabled={isLoading}
                    {...form.register('content_images')}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Paste multiple image URLs separated by commas
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
                  {isPublished && (
                    <div className="mt-3">
                      <Label htmlFor="published_at">Publish Date (optional)</Label>
                      <Input
                        id="published_at"
                        type="date"
                        disabled={isLoading}
                        {...form.register('published_at')}
                      />
                    </div>
                  )}
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

            {/* Tags Section */}
            <div className="border rounded-lg p-6 bg-purple-50/30">
              <h3 className="text-lg font-semibold mb-4">🏷️ Tags</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="tags">Tags (English) - comma separated, max 20</Label>
                  <Input id="tags" placeholder="youth, forum, development" disabled={isLoading} {...form.register('tags')} />
                </div>
                <div dir="rtl">
                  <Label htmlFor="arabic_tags">التاقات (عربي) - مفصولة بفاصلة</Label>
                  <Input id="arabic_tags" placeholder="شباب، منتدى، تنمية" disabled={isLoading} {...form.register('arabic_tags')} />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">📞 Contact Info (optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input id="contact_email" type="email" placeholder="event@example.com" disabled={isLoading} {...form.register('contact_email')} />
                  {form.formState.errors.contact_email && <p className="text-sm text-red-500 mt-1">{form.formState.errors.contact_email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="contact_phone">Contact Phone (Egyptian)</Label>
                  <Input id="contact_phone" placeholder="01012345678" disabled={isLoading} {...form.register('contact_phone')} />
                  <p className="text-sm text-gray-500 mt-1">Format: 01012345678 or +201012345678</p>
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">📋 Requirements (optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="requirements">Requirements (English)</Label>
                  <Textarea id="requirements" placeholder="Participants must be 18+ years old" rows={3} disabled={isLoading} {...form.register('requirements')} />
                </div>
                <div dir="rtl">
                  <Label htmlFor="arabic_requirements">المتطلبات (عربي)</Label>
                  <Textarea id="arabic_requirements" placeholder="يجب أن يكون عمر المشاركين 18 سنة أو أكثر" rows={3} disabled={isLoading} {...form.register('arabic_requirements')} />
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="border rounded-lg p-6 bg-yellow-50/30">
              <h3 className="text-lg font-semibold mb-4">🔍 SEO (optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="meta_title">Meta Title (English)</Label>
                  <Input id="meta_title" placeholder="Annual Youth Forum 2026" disabled={isLoading} {...form.register('meta_title')} />
                </div>
                <div dir="rtl">
                  <Label htmlFor="arabic_meta_title">عنوان الميتا (عربي)</Label>
                  <Input id="arabic_meta_title" placeholder="منتدى الشباب السنوي 2026" disabled={isLoading} {...form.register('arabic_meta_title')} />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description (English)</Label>
                  <Textarea id="meta_description" placeholder="Join us for the annual youth forum..." rows={2} disabled={isLoading} {...form.register('meta_description')} />
                </div>
                <div dir="rtl">
                  <Label htmlFor="arabic_meta_description">وصف الميتا (عربي)</Label>
                  <Textarea id="arabic_meta_description" placeholder="انضم إلينا في منتدى الشباب السنوي..." rows={2} disabled={isLoading} {...form.register('arabic_meta_description')} />
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Event
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

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import React from "react";
import { newsService, authService, NewsItem, UpdateNewsData } from "@/lib/api";

// Form schema for bilingual content
const schema = yup
  .object({
    titleAr: yup
      .string()
      .required("Arabic title is required")
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title must be less than 200 characters"),
    titleEn: yup
      .string()
      .required("English title is required")
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title must be less than 200 characters"),
    descriptionAr: yup
      .string()
      .required("Arabic description is required")
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description must be less than 500 characters"),
    descriptionEn: yup
      .string()
      .required("English description is required")
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description must be less than 500 characters"),
    contentAr: yup
      .string()
      .required("Arabic content is required")
      .min(100, "Content must be at least 100 characters"),
    contentEn: yup
      .string()
      .required("English content is required")
      .min(100, "Content must be at least 100 characters"),
    authorAr: yup.string().required("Arabic author name is required"),
    authorEn: yup.string().required("English author name is required"),
    coverImage: yup
      .string()
      .required("Cover image URL is required")
      .url("Must be a valid URL"),
    contentImages: yup
      .array()
      .of(yup.string().url("Must be a valid URL"))
      .default([]),
    slug: yup
      .string()
      .required("Slug is required")
      .matches(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
      ),
    published: yup.boolean().default(false),
    featured: yup.boolean().default(false),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      titleAr: "",
      titleEn: "",
      descriptionAr: "",
      descriptionEn: "",
      contentAr: "",
      contentEn: "",
      authorAr: "",
      authorEn: "",
      coverImage: "",
      contentImages: [],
      slug: "",
      published: false,
      featured: false,
    },
  });

  // Auth check
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/signin");
    }
  }, [router]);

  // Fetch news item
  useEffect(() => {
    async function fetchNewsItem() {
      try {
        setIsFetching(true);
        const id = params.id as string;

        // Fetch news item using new API service
        const data = await newsService.getById(id);

        if (data) {
          setNewsItem(data);

          // Helper to get text from new API format (separate fields) or legacy format
          const getTextFields = (enField: string | undefined, arField: string | undefined, legacyField: string | { ar: string; en: string } | undefined): { ar: string; en: string } => {
            // New API format with separate fields
            if (arField !== undefined) {
              return { en: enField || '', ar: arField || '' };
            }
            // Legacy format with bilingual object
            if (typeof legacyField === 'object' && legacyField !== null) {
              return { en: legacyField.en || '', ar: legacyField.ar || '' };
            }
            // Simple string
            return { en: String(legacyField || ''), ar: '' };
          };

          // Populate form with existing data (handling both new and legacy format)
          const titleText = getTextFields(data.title, data.arabicTitle, data.title);
          const descText = getTextFields(data.description, data.arabicDescription, data.description);
          const contentText = getTextFields(data.content, data.arabicContent, data.content);
          
          form.reset({
            titleAr: titleText.ar,
            titleEn: titleText.en,
            descriptionAr: descText.ar,
            descriptionEn: descText.en,
            contentAr: contentText.ar,
            contentEn: contentText.en,
            authorAr: data.arabicAuthor || data.author || '',
            authorEn: data.author || '',
            coverImage: data.coverImage || '',
            contentImages: data.contentImages || [],
            slug: data.slug || '',
            published: data.published || false,
            featured: data.featured || false,
          });
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setNotFound(true);
      } finally {
        setIsFetching(false);
      }
    }

    if (params.id) {
      fetchNewsItem();
    }
  }, [params.id, form]);

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      if (!newsItem) return;

      // Prepare the update data with new API format (separate fields)
      const updateData: UpdateNewsData = {
        title: data.titleEn,
        arabicTitle: data.titleAr,
        description: data.descriptionEn,
        arabicDescription: data.descriptionAr,
        content: data.contentEn,
        arabicContent: data.contentAr,
        author: data.authorEn || data.authorAr,
        arabicAuthor: data.authorAr || data.authorEn,
        coverImage: data.coverImage,
        contentImages: (data.contentImages || []).filter(
          (url): url is string => typeof url === "string" && url !== undefined
        ),
        published: data.published,
        featured: data.featured,
      };

      // Use newsService to update the news item
      const updatedNews = await newsService.update(newsItem._id, updateData);

      console.log("News item updated:", updatedNews);
      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/news");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update news article";
      setError(errorMessage);
      console.error("Error updating news:", err);
    } finally {
      setIsLoading(false);
    }
  }

  if (notFound) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">
              News Article Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The news article you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild>
              <Link href="/dashboard/news">Back to News List</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isFetching || !newsItem) {
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
          <Link href="/dashboard/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit News Article
          </h1>
          <p className="text-gray-600 mt-1">
            Update the news article information
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>News Article Details</CardTitle>
          <CardDescription>
            Update the bilingual information below to modify the news article
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
                News article updated successfully! Redirecting to news list...
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
                    placeholder="Enter news title in English"
                    disabled={isLoading}
                    {...form.register("titleEn")}
                  />
                  {form.formState.errors.titleEn && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.titleEn.message}
                    </p>
                  )}
                </div>

                {/* English Author */}
                <div>
                  <Label htmlFor="authorEn">Author (English) *</Label>
                  <Input
                    id="authorEn"
                    placeholder="Author name in English"
                    disabled={isLoading}
                    {...form.register("authorEn")}
                  />
                  {form.formState.errors.authorEn && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.authorEn.message}
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
                    {...form.register("slug")}
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
                    {...form.register("descriptionEn")}
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
                    placeholder="Full article content in English (supports HTML)"
                    rows={8}
                    disabled={isLoading}
                    {...form.register("contentEn")}
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
                    placeholder="أدخل عنوان الخبر بالعربية"
                    disabled={isLoading}
                    {...form.register("titleAr")}
                  />
                  {form.formState.errors.titleAr && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.titleAr.message}
                    </p>
                  )}
                </div>

                {/* Arabic Author */}
                <div className="md:col-span-2">
                  <Label htmlFor="authorAr">الكاتب (عربي) *</Label>
                  <Input
                    id="authorAr"
                    placeholder="اسم الكاتب بالعربية"
                    disabled={isLoading}
                    {...form.register("authorAr")}
                  />
                  {form.formState.errors.authorAr && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.authorAr.message}
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
                    {...form.register("descriptionAr")}
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
                    placeholder="المحتوى الكامل بالعربية (يدعم HTML)"
                    rows={8}
                    disabled={isLoading}
                    {...form.register("contentAr")}
                  />
                  {form.formState.errors.contentAr && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.contentAr.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">📷 Images</h3>
              <div className="space-y-4">
                {/* Cover Image URL */}
                <div>
                  <Label htmlFor="coverImage">Cover Image URL *</Label>
                  <Input
                    id="coverImage"
                    placeholder="https://drive.google.com/... or https://example.com/image.jpg"
                    disabled={isLoading}
                    {...form.register("coverImage")}
                  />
                  {form.formState.errors.coverImage && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.coverImage.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    The main image displayed for this news article. Supports Google Drive links.
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
                    value={(form.watch("contentImages") || []).join(", ")}
                    onChange={(e) => {
                      const urls = e.target.value
                        .split(",")
                        .map((url) => url.trim())
                        .filter((url) => url.length > 0);
                      form.setValue("contentImages", urls);
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Additional images for the article content (optional)
                  </p>
                </div>
              </div>
            </div>

            {/* Publication Settings */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4">⚙️ Publication Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="published"
                      className="text-base font-medium"
                    >
                      Publish Article
                    </Label>
                    <p className="text-sm text-gray-500">
                      When enabled, the article will be visible to the public
                    </p>
                  </div>
                  <Switch
                    id="published"
                    checked={form.watch("published")}
                    onCheckedChange={(checked) =>
                      form.setValue("published", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured" className="text-base font-medium">
                      Feature Article
                    </Label>
                    <p className="text-sm text-gray-500">
                      When enabled, the article will be displayed in featured sections
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={form.watch("featured")}
                    onCheckedChange={(checked) =>
                      form.setValue("featured", checked)
                    }
                  />
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
                    Update News
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

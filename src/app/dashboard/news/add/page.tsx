"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Save, Loader2, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import React from "react";
import { newsService, authService, governoratesService, Governorate } from "@/lib/api";
import { validateImageUrl, processImageUrl } from "@/lib/image-upload";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form schema with bilingual support
const schema = yup
  .object({
    title_en: yup
      .string()
      .required("English title is required")
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title must be less than 200 characters"),
    title_ar: yup
      .string()
      .required("Arabic title is required")
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title must be less than 200 characters"),
    description_en: yup
      .string()
      .required("English description is required")
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description must be less than 500 characters"),
    description_ar: yup
      .string()
      .required("Arabic description is required")
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description must be less than 500 characters"),
    content_en: yup
      .string()
      .required("English content is required")
      .min(100, "Content must be at least 100 characters"),
    content_ar: yup
      .string()
      .required("Arabic content is required")
      .min(100, "Content must be at least 100 characters"),
    author: yup.string().required("Author is required"),
    cover_image: yup.string().required("Cover image URL is required"),
    content_images: yup.string().default(""),
    slug: yup
      .string()
      .required("Slug is required")
      .matches(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
      ),
    isPublished: yup.boolean().default(false),
    isFeatured: yup.boolean().default(false),
    governorateId: yup.string().default(""),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function AddNewsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loadingGovernorates, setLoadingGovernorates] = useState(true);

  // Auth check
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/signin");
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

  const form = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      content_en: "",
      content_ar: "",
      author: "",
      cover_image: "",
      content_images: "",
      slug: "",
      isPublished: false,
      isFeatured: false,
      governorateId: "",
    },
  });

  // Auto-generate slug from English title
  const watchTitleEn = form.watch("title_en");
  React.useEffect(() => {
    if (watchTitleEn) {
      const slug = watchTitleEn
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchTitleEn, form]);

  // Handle cover image URL change
  const handleCoverImageChange = (url: string) => {
    const validation = validateImageUrl(url);
    if (validation.isValid) {
      setImageError("");
      setImagePreview(processImageUrl(url));
    } else {
      setImageError(validation.error || "Invalid URL");
      setImagePreview("");
    }
  };

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      // Verify authentication
      if (!authService.isAuthenticated()) {
        throw new Error("Authentication required");
      }

      // Validate cover image URL
      const imageValidation = validateImageUrl(data.cover_image);
      if (!imageValidation.isValid) {
        throw new Error(`Cover image: ${imageValidation.error}`);
      }

      // Parse content images (comma-separated URLs)
      const contentImagesArray = data.content_images
        ? data.content_images
            .split(",")
            .map((url) => url.trim())
            .filter((url) => url && validateImageUrl(url).isValid)
        : [];

      // Use selected governorate or empty for global
      const governorateId = data.governorateId || '';

      // Prepare the news data object with new API format (separate fields)
      const newsData = {
        governorateId,
        title: data.title_en,
        arabicTitle: data.title_ar,
        description: data.description_en,
        arabicDescription: data.description_ar,
        content: data.content_en,
        arabicContent: data.content_ar,
        author: data.author,
        arabicAuthor: data.author, // Use same author for now
        coverImage: processImageUrl(data.cover_image),
        contentImages: contentImagesArray.map(processImageUrl),
        slug: data.slug,
        published: data.isPublished,
        featured: data.isFeatured,
      };

      // Use the newsService to create the news item
      const createdNews = await newsService.create(newsData);

      console.log("News item created:", createdNews);
      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/news");
      }, 2000);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = err as any;
      const errorMessage =
        axiosError?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to create news article");
      setError(errorMessage);
      console.error("Error creating news:", err);
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Add News Article</h1>
          <p className="text-gray-600 mt-1">
            Create a new bilingual news article
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>News Article Details</CardTitle>
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
                News article created successfully! Redirecting to news list...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* English Fields */}
            <div className="border-b pb-6">
              <h3 className="font-medium text-lg mb-4">English Content</h3>
              <div className="grid grid-cols-1 gap-6">
                {/* Title English */}
                <div>
                  <Label htmlFor="title_en">Title (English) *</Label>
                  <Input
                    id="title_en"
                    placeholder="Enter news title in English"
                    disabled={isLoading}
                    {...form.register("title_en")}
                  />
                  {form.formState.errors.title_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title_en.message}
                    </p>
                  )}
                </div>

                {/* Description English */}
                <div>
                  <Label htmlFor="description_en">Description (English) *</Label>
                  <Textarea
                    id="description_en"
                    placeholder="Brief description in English"
                    rows={3}
                    disabled={isLoading}
                    {...form.register("description_en")}
                  />
                  {form.formState.errors.description_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.description_en.message}
                    </p>
                  )}
                </div>

                {/* Content English */}
                <div>
                  <Label htmlFor="content_en">Content (English) *</Label>
                  <Textarea
                    id="content_en"
                    placeholder="Full article content in English (supports HTML)"
                    rows={8}
                    disabled={isLoading}
                    {...form.register("content_en")}
                  />
                  {form.formState.errors.content_en && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.content_en.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Arabic Fields */}
            <div className="border-b pb-6">
              <h3 className="font-medium text-lg mb-4">المحتوى العربي (Arabic Content)</h3>
              <div className="grid grid-cols-1 gap-6" dir="rtl">
                {/* Title Arabic */}
                <div>
                  <Label htmlFor="title_ar">العنوان (Title) *</Label>
                  <Input
                    id="title_ar"
                    placeholder="أدخل عنوان الخبر بالعربية"
                    disabled={isLoading}
                    {...form.register("title_ar")}
                  />
                  {form.formState.errors.title_ar && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.title_ar.message}
                    </p>
                  )}
                </div>

                {/* Description Arabic */}
                <div>
                  <Label htmlFor="description_ar">الوصف (Description) *</Label>
                  <Textarea
                    id="description_ar"
                    placeholder="وصف مختصر بالعربية"
                    rows={3}
                    disabled={isLoading}
                    {...form.register("description_ar")}
                  />
                  {form.formState.errors.description_ar && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.description_ar.message}
                    </p>
                  )}
                </div>

                {/* Content Arabic */}
                <div>
                  <Label htmlFor="content_ar">المحتوى (Content) *</Label>
                  <Textarea
                    id="content_ar"
                    placeholder="محتوى المقال الكامل بالعربية"
                    rows={8}
                    disabled={isLoading}
                    {...form.register("content_ar")}
                  />
                  {form.formState.errors.content_ar && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.content_ar.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Common Fields */}
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

              {/* Author */}
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  disabled={isLoading}
                  {...form.register("author")}
                />
                {form.formState.errors.author && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.author.message}
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
                <p className="text-sm text-gray-500 mt-1">
                  Auto-generated from English title
                </p>
              </div>

              {/* Cover Image URL */}
              <div className="md:col-span-2">
                <Label htmlFor="cover_image">Cover Image URL *</Label>
                <Input
                  id="cover_image"
                  placeholder="Paste Google Drive share link or image URL"
                  disabled={isLoading}
                  {...form.register("cover_image")}
                  onChange={(e) => {
                    form.register("cover_image").onChange(e);
                    handleCoverImageChange(e.target.value);
                  }}
                />
                {form.formState.errors.cover_image && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.cover_image.message}
                  </p>
                )}
                {imageError && (
                  <p className="text-sm text-red-500 mt-1">{imageError}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Paste a Google Drive share link or any direct image URL
                </p>
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={150}
                      className="rounded-lg object-cover"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                )}
              </div>

              {/* Content Images URLs */}
              <div className="md:col-span-2">
                <Label htmlFor="content_images">Additional Images (Optional)</Label>
                <Textarea
                  id="content_images"
                  placeholder="Paste multiple image URLs, separated by commas"
                  rows={2}
                  disabled={isLoading}
                  {...form.register("content_images")}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter multiple image URLs separated by commas for article content
                </p>
              </div>
            </div>

            {/* Publication Settings */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium text-lg mb-4">Publication Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="isPublished"
                      className="text-base font-medium"
                    >
                      Publish Article
                    </Label>
                    <p className="text-sm text-gray-500">
                      When enabled, the article will be visible to the public
                    </p>
                  </div>
                  <Switch
                    id="isPublished"
                    checked={form.watch("isPublished")}
                    onCheckedChange={(checked) =>
                      form.setValue("isPublished", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isFeatured" className="text-base font-medium">
                      Feature Article
                    </Label>
                    <p className="text-sm text-gray-500">
                      When enabled, the article will appear in featured sections
                    </p>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={form.watch("isFeatured")}
                    onCheckedChange={(checked) =>
                      form.setValue("isFeatured", checked)
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
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create News
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

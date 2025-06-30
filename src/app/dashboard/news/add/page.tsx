"use client";
import { useState } from "react";
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import React from "react";
import { CreateNewsData, NewsService } from "@/lib/database";
import { supabase } from "@/lib/supabase";
import {
  ImageUploader,
  MultiImageUploader,
} from "@/components/ui/image-uploader";

// Form schema
const schema = yup
  .object({
    title: yup
      .string()
      .required("Title is required")
      .min(10, "Title must be at least 10 characters")
      .max(200, "Title must be less than 200 characters"),
    description: yup
      .string()
      .required("Description is required")
      .min(20, "Description must be at least 20 characters")
      .max(500, "Description must be less than 500 characters"),
    content: yup
      .string()
      .required("Content is required")
      .min(100, "Content must be at least 100 characters"),
    author: yup.string().required("Author is required"),
    cover_image: yup
      .string()
      .required("Cover image is required")
      .url("Must be a valid URL"),
    content_images: yup
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

export default function AddNewsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");
  const [contentImages, setContentImages] = useState<string[]>([]);

  // Auth check
  React.useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/signin");
      }
    }
    checkAuth();
  }, [router]);
  const form = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: "",
      description: "",
      content: "",
      author: "",
      cover_image: "",
      content_images: [],
      slug: "",
      published: false,
      featured: false,
    },
  });

  // Set form values when images are uploaded
  React.useEffect(() => {
    if (coverImageUrl) {
      form.setValue("cover_image", coverImageUrl);
    }
  }, [coverImageUrl, form]);

  React.useEffect(() => {
    if (contentImages.length > 0) {
      form.setValue("content_images", contentImages);
    }
  }, [contentImages, form]);

  // Auto-generate slug from title
  const watchTitle = form.watch("title");
  React.useEffect(() => {
    if (watchTitle) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  }, [watchTitle, form]);
  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Authentication required");
      }

      // Prepare the news data object
      const newsData: CreateNewsData = {
        title: data.title,
        description: data.description,
        content: data.content,
        author: data.author,
        cover_image: data.cover_image,
        content_images: (data.content_images || []).filter(
          (url): url is string => typeof url === "string" && url !== undefined
        ),
        slug: data.slug,
        published: data.published,
        featured: data.featured,
      };

      // Use the NewsService to create the news item
      const createdNews = await NewsService.createNews(newsData);

      console.log("News item created:", createdNews);
      setSuccess(true);

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/news");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create news article";
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
            Create a new news article for your website
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>News Article Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new news article
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter news title"
                  disabled={isLoading}
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
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
                )}{" "}
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
              {/* Cover Image (Required) */}
              <div className="md:col-span-2">
                <ImageUploader
                  id="cover_image"
                  label="Cover Image"
                  description="The main image displayed for this news article (required)"
                  existingUrl={coverImageUrl}
                  bucket="news"
                  folder={`articles/${form.watch("slug") || "new"}`}
                  onUploadComplete={(result) => {
                    setCoverImageUrl(result.url);
                    form.setValue("cover_image", result.url);
                    form.clearErrors("cover_image");
                  }}
                  onError={(error) => {
                    form.setError("cover_image", {
                      type: "manual",
                      message: error.message,
                    });
                  }}
                  required
                  disabled={isLoading}
                />
                {form.formState.errors.cover_image && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.cover_image.message}
                  </p>
                )}
              </div>
              {/* Description */}
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the news article"
                  rows={3}
                  disabled={isLoading}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
              {/* Content */}
              <div className="md:col-span-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Full article content (supports HTML)"
                  rows={10}
                  disabled={isLoading}
                  {...form.register("content")}
                />{" "}
                {form.formState.errors.content && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  You can use HTML tags for formatting (e.g., &lt;p&gt;,
                  &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;)
                </p>
              </div>{" "}
              {/* Content Images (Optional) */}
              <div className="md:col-span-2">
                <MultiImageUploader
                  id="content_images"
                  label="Content Images"
                  description="Add additional images for your article content (optional)"
                  existingUrls={contentImages}
                  bucket="news"
                  folder={`articles/${form.watch("slug") || "new"}/content`}
                  onUploadComplete={(urls) => {
                    setContentImages(urls);
                    form.setValue("content_images", urls);
                  }}
                  disabled={isLoading}
                  className="mt-4"
                />
              </div>
            </div>

            {/* Publication Settings */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-medium text-lg mb-4">Publication Settings</h3>
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
                      When enabled, the article will be displayed in featured
                      sections
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

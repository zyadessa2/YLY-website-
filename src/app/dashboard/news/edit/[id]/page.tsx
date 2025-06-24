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
import { ImageUpload } from "@/components/ui/image-upload";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { NewsItem, NewsService } from "@/lib/database";

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
    image_url: yup.string().url("Must be a valid URL").nullable().optional(),
    slug: yup
      .string()
      .required("Slug is required")
      .matches(
        /^[a-z0-9-]+$/,
        "Slug must contain only lowercase letters, numbers, and hyphens"
      ),
    published: yup.boolean().default(true),
    featured: yup.boolean().default(false),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  const form = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      title: "",
      description: "",
      content: "",
      author: "",
      image_url: "",
      slug: "",
      published: true,
      featured: false,
    },
  });

  useEffect(() => {
    const loadNewsItem = async () => {
      try {
        const id = params.id as string;
        const foundItem = await NewsService.getNewsById(id);

        setNewsItem(foundItem);
        // Populate form with existing data
        form.reset({
          title: foundItem.title,
          description: foundItem.description,
          content: foundItem.content,
          author: foundItem.author,
          image_url: foundItem.image_url,
          slug: foundItem.slug,
          published: foundItem.published,
          featured: foundItem.featured,
        });
      } catch (err) {
        console.error("Error loading news item:", err);
        setNotFound(true);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadNewsItem();
  }, [params.id, form]);

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      if (!newsItem) return;

      // Convert null image_url to undefined to match expected type
      const updateData = {
        ...data,
        image_url: data.image_url || undefined,
      };

      await NewsService.updateNews(newsItem.id, updateData);

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

  if (isInitialLoading) {
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
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading news article...</p>
          </CardContent>
        </Card>
      </div>
    );
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

  if (!newsItem) {
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
            Update the information below to modify the news article
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
              </div>{" "}
              {/* Featured Image */}
              <div className="md:col-span-2">
                <ImageUpload
                  label="Featured Image"
                  bucket="news"
                  folder="articles"
                  currentImageUrl={form.watch("image_url") || undefined}
                  onImageUploaded={(url) => form.setValue("image_url", url)}
                  onImageRemoved={() => form.setValue("image_url", "")}
                  disabled={isLoading}
                  required
                />
                {form.formState.errors.image_url && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.image_url.message}
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
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.content.message}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  You can use HTML tags for formatting (e.g., &lt;p&gt;,
                  &lt;h2&gt;, &lt;ul&gt;, &lt;li&gt;)
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

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
import { ImageUpload } from "@/components/ui/image-upload";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { NewsService } from "@/lib/database";

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
    image_url: yup.string().url("Must be a valid URL").optional().default(""),
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

export default function AddNewsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const form = useForm<FormData>({
    resolver: yupResolver(schema),
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

      // Create news using Supabase service
      await NewsService.createNews({ ...data, image_url: data.image_url || '' });

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
              {/* Featured Image */}{" "}
              <div className="md:col-span-2">
                <ImageUpload
                  label="Featured Image"
                  bucket="news"
                  folder="articles"
                  onImageUploaded={(url) => form.setValue("image_url", url)}
                  disabled={isLoading}
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

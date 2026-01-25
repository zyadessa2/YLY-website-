'use client';

import { useState } from 'react';
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
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { governoratesService, authService } from '@/lib/api';
import React from 'react';

const schema = yup.object({
  name: yup
    .string()
    .required('English name is required')
    .min(2, 'Name must be at least 2 characters'),
  arabicName: yup
    .string()
    .required('Arabic name is required')
    .min(2, 'Arabic name must be at least 2 characters'),
  description: yup.string().optional(),
  arabicDescription: yup.string().optional(),
  logo: yup.string().url('Must be a valid URL').optional().nullable(),
  coverImage: yup.string().url('Must be a valid URL').optional().nullable(),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function AddGovernoratePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auth check
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/signin');
      return;
    }
    if (!authService.isAdmin()) {
      router.push('/dashboard');
    }
  }, [router]);

  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      arabicName: '',
      description: '',
      arabicDescription: '',
      logo: '',
      coverImage: '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      await governoratesService.create({
        name: data.name,
        arabicName: data.arabicName,
        description: data.description || undefined,
        arabicDescription: data.arabicDescription || undefined,
        logo: data.logo || undefined,
        coverImage: data.coverImage || undefined,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard/governorates');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create governorate';
      setError(errorMessage);
      console.error('Error creating governorate:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/governorates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Governorates
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Governorate</h1>
          <p className="text-gray-600 mt-1">Create a new governorate</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Governorate Details</CardTitle>
          <CardDescription>Fill in the governorate information in both English and Arabic</CardDescription>
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
                Governorate created successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* English Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name (English) *</Label>
                <Input
                  id="name"
                  placeholder="Cairo"
                  disabled={isLoading}
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              {/* Arabic Name */}
              <div>
                <Label htmlFor="arabicName">الاسم (عربي) *</Label>
                <Input
                  id="arabicName"
                  placeholder="القاهرة"
                  dir="rtl"
                  disabled={isLoading}
                  {...form.register('arabicName')}
                />
                {form.formState.errors.arabicName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.arabicName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description (English)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the governorate"
                rows={3}
                disabled={isLoading}
                {...form.register('description')}
              />
            </div>

            {/* Arabic Description */}
            <div>
              <Label htmlFor="arabicDescription">الوصف (عربي)</Label>
              <Textarea
                id="arabicDescription"
                placeholder="وصف مختصر للمحافظة"
                rows={3}
                dir="rtl"
                disabled={isLoading}
                {...form.register('arabicDescription')}
              />
            </div>

            {/* Logo URL */}
            <div>
              <Label htmlFor="logo">Logo URL (Optional)</Label>
              <Input
                id="logo"
                type="url"
                placeholder="https://example.com/logo.png"
                disabled={isLoading}
                {...form.register('logo')}
              />
              {form.formState.errors.logo && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.logo.message}
                </p>
              )}
            </div>

            {/* Cover Image URL */}
            <div>
              <Label htmlFor="coverImage">Cover Image URL (Optional)</Label>
              <Input
                id="coverImage"
                type="url"
                placeholder="https://example.com/cover.jpg"
                disabled={isLoading}
                {...form.register('coverImage')}
              />
              {form.formState.errors.coverImage && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.coverImage.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button type="submit" disabled={isLoading} className="min-w-[150px]">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Create Governorate
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

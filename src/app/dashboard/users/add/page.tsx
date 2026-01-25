'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Loader2, Globe } from 'lucide-react';
import Link from 'next/link';
import { usersService, authService, governoratesService, Governorate } from '@/lib/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  role: yup
    .string()
    .oneOf(['admin', 'governorate_user'], 'Invalid role')
    .required('Role is required'),
  governorateId: yup.string().default(""),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function AddUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [loadingGovernorates, setLoadingGovernorates] = useState(true);

  // Auth check
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push('/signin');
      return;
    }
    if (!authService.isAdmin()) {
      router.push('/dashboard');
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
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'governorate_user',
      governorateId: '',
    },
  });

  const watchRole = form.watch('role');

  async function onSubmit(data: FormData) {
    try {
      setIsLoading(true);
      setError(null);

      if (data.role === 'governorate_user' && !data.governorateId) {
        throw new Error('Governorate is required for governorate users');
      }

      await usersService.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role as 'admin' | 'governorate_user',
        governorateId: data.role === 'governorate_user' ? data.governorateId : undefined,
      });

      setSuccess(true);

      setTimeout(() => {
        router.push('/dashboard/users');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      console.error('Error creating user:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add User</h1>
          <p className="text-gray-600 mt-1">Create a new user account</p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Fill in the user information below</CardDescription>
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
                User created successfully! Redirecting to users list...
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                disabled={isLoading}
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                disabled={isLoading}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 6 characters)"
                disabled={isLoading}
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={form.watch('role')}
                onValueChange={(value) => form.setValue('role', value as 'admin' | 'governorate_user')}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="governorate_user">Governorate User</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>

            {/* Governorate - only for governorate_user */}
            {watchRole === 'governorate_user' && (
              <div>
                <Label htmlFor="governorateId">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Governorate *
                  </div>
                </Label>
                <Select
                  value={form.watch('governorateId')}
                  onValueChange={(value) => form.setValue('governorateId', value)}
                  disabled={isLoading || loadingGovernorates}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingGovernorates ? "Loading governorates..." : "Select governorate"} />
                  </SelectTrigger>
                  <SelectContent>
                    {governorates.map((gov) => (
                      <SelectItem key={gov._id} value={gov._id}>
                        {gov.name} - {gov.arabicName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-1">
                  This user will only be able to manage content for this governorate
                </p>
              </div>
            )}

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
                    Create User
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

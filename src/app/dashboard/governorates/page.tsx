'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Loader2,
  MapPin,
  Eye,
} from 'lucide-react';
import { governoratesService, authService, Governorate } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function GovernoratesManagementPage() {
  const router = useRouter();
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGovernorates, setFilteredGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        if (!authService.isAuthenticated()) {
          router.push('/signin');
          return;
        }

        if (!authService.isAdmin()) {
          setError('Access denied. Admin privileges required.');
          setIsLoading(false);
          return;
        }

        const data = await governoratesService.getAllSimple();
        setGovernorates(data);
        setFilteredGovernorates(data);
      } catch (err) {
        console.error('Error loading governorates:', err);
        setError('Failed to load governorates. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [router]);

  // Filter governorates based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGovernorates(governorates);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = governorates.filter(gov =>
        gov.name.toLowerCase().includes(query) ||
        gov.arabicName.toLowerCase().includes(query) ||
        gov.slug.toLowerCase().includes(query)
      );
      setFilteredGovernorates(filtered);
    }
  }, [searchQuery, governorates]);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await governoratesService.delete(id);
      setGovernorates(prev => prev.filter(g => g._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      console.error('Error deleting governorate:', err);
      alert('Failed to delete governorate');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Governorates Management</h1>
          <p className="text-gray-600 mt-1">Manage all Egyptian governorates</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/governorates/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Governorate
          </Link>
        </Button>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search governorates by name..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{governorates.length}</p>
                <p className="text-sm text-gray-500">Total Governorates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Governorates List */}
      <Card>
        <CardHeader>
          <CardTitle>All Governorates ({filteredGovernorates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredGovernorates.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No governorates found</p>
            ) : (
              filteredGovernorates.map((gov) => (
                <div
                  key={gov._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{gov.name}</h3>
                      <p className="text-sm text-gray-500">{gov.arabicName}</p>
                      <Badge variant="outline" className="mt-1">{gov.slug}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/Governorate/${gov.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/governorates/edit/${gov._id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Dialog open={deleteDialogOpen === gov._id} onOpenChange={(open) => setDeleteDialogOpen(open ? gov._id : null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Governorate</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete &quot;{gov.name}&quot;? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(gov._id)}
                            disabled={isDeleting === gov._id}
                          >
                            {isDeleting === gov._id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              'Delete'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

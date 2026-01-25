'use client';

import { useState, useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Mail,
  Phone,
  User,
  Building,
  MapPin,
} from 'lucide-react';
import { registrationsService, authService, MemberRegistration } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegistrationsManagementPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<MemberRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredRegistrations, setFilteredRegistrations] = useState<MemberRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
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

        const response = await registrationsService.getAll({ limit: 100 });
        // Safely handle the response - data might be in different structure
        const registrationsData = Array.isArray(response?.data) 
          ? response.data 
          : Array.isArray(response) 
            ? response 
            : [];
        setRegistrations(registrationsData);
        setFilteredRegistrations(registrationsData);
      } catch (err) {
        console.error('Error loading registrations:', err);
        setError('Failed to load registrations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [router]);

  // Filter registrations based on search and status
  useEffect(() => {
    if (!Array.isArray(registrations)) {
      setFilteredRegistrations([]);
      return;
    }
    
    let filtered = registrations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r?.status === statusFilter);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        if (!r) return false;
        const name = r.name?.toLowerCase() || '';
        const email = r.email?.toLowerCase() || '';
        const phone = r.phoneNumber || '';
        const governorate = r.governorate?.toLowerCase() || '';
        return (
          name.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          governorate.includes(query)
        );
      });
    }

    setFilteredRegistrations(filtered);
  }, [searchQuery, statusFilter, registrations]);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setIsUpdating(id);
      await registrationsService.updateStatus(id, status);
      setRegistrations(prev => 
        prev.map(r => r._id === id ? { ...r, status } : r)
      );
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update registration status');
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await registrationsService.delete(id);
      setRegistrations(prev => prev.filter(r => r._id !== id));
      setDeleteDialogOpen(null);
    } catch (err) {
      console.error('Error deleting registration:', err);
      alert('Failed to delete registration');
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const getCommitteeBadge = (committee: string) => {
    const colors: Record<string, string> = {
      HR: 'bg-blue-100 text-blue-800',
      SM: 'bg-purple-100 text-purple-800',
      OR: 'bg-orange-100 text-orange-800',
      PR: 'bg-green-100 text-green-800',
    };
    return <Badge className={colors[committee] || 'bg-gray-100 text-gray-800'}>{committee}</Badge>;
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registrations Management</h1>
        <p className="text-gray-600 mt-1">Manage member/volunteer registration applications</p>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or governorate..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{registrations.length}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{registrations.filter(r => r.status === 'pending').length}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{registrations.filter(r => r.status === 'approved').length}</p>
                <p className="text-sm text-gray-500">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{registrations.filter(r => r.status === 'rejected').length}</p>
                <p className="text-sm text-gray-500">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registrations List */}
      <Card>
        <CardHeader>
          <CardTitle>All Registrations ({filteredRegistrations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRegistrations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No registrations found</p>
            ) : (
              filteredRegistrations.map((reg) => (
                <div
                  key={reg._id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{reg.name}</h3>
                      {getStatusBadge(reg.status)}
                      {getCommitteeBadge(reg.committee)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {reg.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {reg.phoneNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {reg.governorate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="h-3 w-3" /> {reg.college}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* View Details */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Registration Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Name</p>
                              <p className="font-medium">{reg.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Age</p>
                              <p className="font-medium">{reg.age}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Email</p>
                              <p className="font-medium">{reg.email}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Phone</p>
                              <p className="font-medium">{reg.phoneNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">College</p>
                              <p className="font-medium">{reg.college}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Governorate</p>
                              <p className="font-medium">{reg.governorate}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Committee</p>
                              <p className="font-medium">{reg.committee}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">National ID</p>
                              <p className="font-medium">{reg.nationalId}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Why this committee?</p>
                            <p className="font-medium">{reg.whyChooseCommittee}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">How did you know about us?</p>
                            <p className="font-medium">{reg.whereKnowAboutUs}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Status Actions */}
                    {reg.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleStatusUpdate(reg._id, 'approved')}
                          disabled={isUpdating === reg._id}
                        >
                          {isUpdating === reg._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(reg._id, 'rejected')}
                          disabled={isUpdating === reg._id}
                        >
                          {isUpdating === reg._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        </Button>
                      </>
                    )}

                    {/* Delete */}
                    <Dialog open={deleteDialogOpen === reg._id} onOpenChange={(open) => setDeleteDialogOpen(open ? reg._id : null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Registration</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete the registration for &quot;{reg.name}&quot;? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(reg._id)}
                            disabled={isDeleting === reg._id}
                          >
                            {isDeleting === reg._id ? (
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

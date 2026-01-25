'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft,
  Search,
  Check,
  X,
  Loader2,
  Users,
  Mail,
  Phone,
  Calendar,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { eventsService, authService, EventItem, EventRegistration, RegistrationStats, RegistrationStatus } from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventRegistrationsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filteredRegistrations, setFilteredRegistrations] = useState<EventRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        // Check authentication
        if (!authService.isAuthenticated()) {
          window.location.href = "/signin";
          return;
        }

        // Load event details
        const eventData = await eventsService.getById(eventId);
        setEvent(eventData);

        // Load registrations and stats in parallel
        const [registrationsData, statsData] = await Promise.all([
          eventsService.getRegistrations(eventId),
          eventsService.getRegistrationStats(eventId),
        ]);

        setRegistrations(registrationsData || []);
        setFilteredRegistrations(registrationsData || []);
        setStats(statsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load registration data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [eventId]);

  // Filter registrations
  useEffect(() => {
    let filtered = registrations;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((reg) =>
        reg.name.toLowerCase().includes(query) ||
        reg.email.toLowerCase().includes(query) ||
        reg.phone.includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((reg) => reg.status === statusFilter);
    }

    setFilteredRegistrations(filtered);
  }, [searchQuery, statusFilter, registrations]);

  const handleStatusUpdate = async (registrationId: string, newStatus: RegistrationStatus) => {
    try {
      setUpdatingStatus(registrationId);
      await eventsService.updateRegistrationStatus(registrationId, newStatus);
      
      // Update local state
      const updatedRegistrations = registrations.map((reg) =>
        reg._id === registrationId ? { ...reg, status: newStatus } : reg
      );
      setRegistrations(updatedRegistrations);

      // Update stats
      const newStats = await eventsService.getRegistrationStats(eventId);
      setStats(newStats);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update registration status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDisplayText = (item: EventItem): string => {
    if ('arabicTitle' in item && item.arabicTitle) {
      return item.title || item.arabicTitle;
    }
    if (typeof item.title === 'object' && item.title !== null) {
      const bilingualTitle = item.title as unknown as { ar: string; en: string };
      return bilingualTitle.en || bilingualTitle.ar || '';
    }
    return String(item.title || '');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Approved</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Cancelled</Badge>;
      case 'rejected':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>;
    }
  };

  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) return;

    const headers = ['Name', 'Email', 'Phone', 'Status', 'Registration Date'];
    const rows = filteredRegistrations.map((reg) => [
      reg.name,
      reg.email,
      reg.phone,
      reg.status,
      formatDate(reg.createdAt),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event?.slug || 'event'}-registrations.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/dashboard/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Event Registrations
          </h1>
          {event && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getDisplayText(event)}
            </p>
          )}
        </div>
        <Button onClick={exportToCSV} disabled={filteredRegistrations.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Approved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Registrations ({filteredRegistrations.length})</span>
          </CardTitle>
          <CardDescription>
            Manage event registrations and update their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400" />
              <p className="text-gray-500 mt-4">No registrations found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegistrations.map((registration) => (
                <div
                  key={registration._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      {getStatusIcon(registration.status)}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {registration.name}
                        </h3>
                        {getStatusBadge(registration.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <div className="flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          {registration.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="mr-1 h-3 w-3" />
                          {registration.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {formatDate(registration.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {registration.status !== 'approved' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(registration._id, 'approved')}
                        disabled={updatingStatus === registration._id}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        {updatingStatus === registration._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                    )}
                    {registration.status !== 'cancelled' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(registration._id, 'cancelled')}
                        disabled={updatingStatus === registration._id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {updatingStatus === registration._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </>
                        )}
                      </Button>
                    )}
                    {registration.status !== 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(registration._id, 'pending')}
                        disabled={updatingStatus === registration._id}
                        className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                      >
                        {updatingStatus === registration._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Reset to Pending'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

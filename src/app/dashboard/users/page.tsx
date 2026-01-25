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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Shield,
  ShieldAlert,
  Loader2,
  UserCog,
  Mail,
  Calendar,
  MapPin,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { usersService, authService, governoratesService, User, Governorate } from '@/lib/api';

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  
  // Create user dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'governorate_user' as 'admin' | 'governorate_user',
    governorateId: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        // Check authentication and admin status
        if (!authService.isAuthenticated()) {
          window.location.href = "/signin";
          return;
        }

        if (!authService.isAdmin()) {
          setError('Access denied. Admin privileges required.');
          setIsLoading(false);
          return;
        }

        // Debug: Log authentication state
        console.log('Loading users with auth:', {
          isAuthenticated: authService.isAuthenticated(),
          isAdmin: authService.isAdmin(),
          token: localStorage.getItem('accessToken') ? 'exists' : 'missing'
        });

        // Load users and governorates in parallel with better error handling
        try {
          const [usersResponse, governoratesResponse] = await Promise.all([
            usersService.getAll({ limit: 100 }).catch(err => {
              console.error('Users API error:', err.response?.data || err.message);
              throw err;
            }),
            governoratesService.getAllSimple().catch(err => {
              console.warn('Governorates load failed:', err);
              return [];
            }),
          ]);
          
          // Safely handle the response - data might be in different structure
          const usersData = Array.isArray(usersResponse?.data) 
            ? usersResponse.data 
            : Array.isArray(usersResponse) 
              ? usersResponse 
              : [];
          
          console.log('Loaded users:', usersData.length);
          setUsers(usersData);
          setFilteredUsers(usersData);
          setGovernorates(governoratesResponse || []);
        } catch (apiError: any) {
          // More detailed error handling
          if (apiError.response?.status === 500) {
            setError('Server error. The backend may be experiencing issues. Please try again later.');
            console.error('Server 500 error:', apiError.response?.data);
          } else if (apiError.response?.status === 401) {
            setError('Authentication failed. Please sign in again.');
            setTimeout(() => {
              authService.logout();
              window.location.href = "/signin";
            }, 2000);
          } else if (apiError.response?.status === 403) {
            setError('Access denied. Admin privileges required.');
          } else {
            setError(`Failed to load users: ${apiError.message || 'Unknown error'}`);
          }
          throw apiError;
        }
      } catch (err: any) {
        console.error('Error loading data:', err);
        if (!error) { // Only set generic error if specific one wasn't set
          setError('Failed to load users data. Please check your connection and try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (!Array.isArray(users)) {
      setFilteredUsers([]);
      return;
    }
    
    const filtered = users.filter((user) => {
      if (!user) return false;
      const query = searchQuery.toLowerCase();
      const name = user.name?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const role = user.role?.toLowerCase() || '';
      return (
        name.includes(query) ||
        email.includes(query) ||
        role.includes(query)
      );
    });
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleDelete = async (id: string) => {
    const currentUser = authService.getStoredUser();
    if (currentUser?._id === id) {
      alert('You cannot delete your own account.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setIsDeleting(id);
        await usersService.delete(id);
        const updatedUsers = users.filter((user) => user._id !== id);
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const currentUser = authService.getStoredUser();
    if (currentUser?._id === id) {
      alert('You cannot deactivate your own account.');
      return;
    }

    try {
      setIsToggling(id);
      await usersService.toggleStatus(id);
      const updatedUsers = users.map((user) =>
        user._id === id ? { ...user, isActive: !currentStatus } : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error toggling user status:', error);
      alert('Failed to update user status. Please try again.');
    } finally {
      setIsToggling(null);
    }
  };

  const handleCreateUser = async () => {
    try {
      setIsCreating(true);
      setCreateError(null);

      // Validate required fields
      if (!newUser.name.trim()) {
        setCreateError('Name is required');
        return;
      }
      if (!newUser.email.trim()) {
        setCreateError('Email is required');
        return;
      }
      if (!newUser.password || newUser.password.length < 8) {
        setCreateError('Password must be at least 8 characters');
        return;
      }
      if (newUser.role === 'governorate_user' && !newUser.governorateId) {
        setCreateError('Governorate is required for governorate users');
        return;
      }

      const userData = {
        name: newUser.name.trim(),
        email: newUser.email.trim().toLowerCase(),
        password: newUser.password,
        role: newUser.role,
        ...(newUser.role === 'governorate_user' && newUser.governorateId 
          ? { governorateId: newUser.governorateId }
          : {}
        ),
      };

      const createdUser = await usersService.create(userData);
      setUsers([createdUser, ...users]);
      setIsCreateDialogOpen(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'governorate_user',
        governorateId: '',
      });
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      setCreateError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getGovernorateName = (governorateId: string | { _id: string; name: string } | null | undefined): string => {
    if (!governorateId) return 'N/A';
    
    // If it's an object with name
    if (typeof governorateId === 'object' && 'name' in governorateId) {
      return governorateId.name;
    }
    
    // If it's a string ID, find in governorates list
    const governorate = governorates.find(g => g._id === governorateId);
    return governorate?.name || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && error.includes('Access denied')) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <p className="text-destructive text-lg font-medium">{error}</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <ShieldAlert className="h-16 w-16 text-destructive" />
        <p className="text-destructive text-lg font-medium">{error}</p>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system. Fill in all required fields.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {createError && (
                <div className="text-destructive text-sm p-2 bg-destructive/10 rounded">
                  {createError}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: 'admin' | 'governorate_user') => 
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="governorate_user">Governorate User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newUser.role === 'governorate_user' && (
                <div className="grid gap-2">
                  <Label htmlFor="governorate">Governorate *</Label>
                  <Select
                    value={newUser.governorateId}
                    onValueChange={(value) => setNewUser({ ...newUser, governorateId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select governorate" />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((gov) => (
                        <SelectItem key={gov._id} value={gov._id}>
                          {gov.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser} disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">All Users ({filteredUsers.length})</h2>
        </div>

        {/* Error State */}
        {error && !error.includes('Access denied') && (
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
        )}

        {/* Empty State */}
        {!error && filteredUsers.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No users found.</p>
            </CardContent>
          </Card>
        )}

        {/* Users Grid */}
        {!error && filteredUsers.length > 0 && (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 dark:bg-purple-900' 
                          : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        {user.role === 'admin' ? (
                          <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        ) : (
                          <UserCog className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>

                      {/* User Info */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </h3>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role === 'admin' ? 'Admin' : 'Governorate User'}
                          </Badge>
                          <Badge variant={user.isActive ? 'default' : 'destructive'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <div className="flex items-center">
                            <Mail className="mr-1 h-4 w-4" />
                            {user.email}
                          </div>
                          {user.governorateId && (
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                              {getGovernorateName(user.governorateId)}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            Joined {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(user._id, user.isActive)}
                        disabled={isToggling === user._id}
                        title={user.isActive ? 'Deactivate user' : 'Activate user'}
                      >
                        {isToggling === user._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : user.isActive ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/users/edit/${user._id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                        disabled={isDeleting === user._id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {isDeleting === user._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

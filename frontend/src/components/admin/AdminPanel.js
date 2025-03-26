import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  UserCircle, 
  Search, 
  Trash2, 
  Edit, 
  UserCheck, 
  UserX,
  Key,
  CheckCircle,
  XCircle,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Alert, AlertDescription } from "../../components/ui/alert";

const AdminPanel = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPinConfigured, setIsPinConfigured] = useState(false);
  
  // PIN setup state
  const [pinSetupError, setPinSetupError] = useState('');
  const [pinSetupSuccess, setPinSetupSuccess] = useState('');
  const [pinLoading, setPinLoading] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const { user: currentUser, setPin: setPinInAuth } = useAuth();
  const navigate = useNavigate();

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.role !== 'guest').length,
    adminUsers: users.filter(u => u.role === 'admin').length,
    doctorUsers: users.filter(u => u.role === 'doctor').length,
  };

  // Check if PIN is configured
  const checkPinStatus = async () => {
    try {
      // For the sake of this implementation, we'll assume we have this API endpoint
      // In your actual implementation, you might need to add this endpoint
      const response = await adminAPI.checkPinStatus();
      setIsPinConfigured(response.isConfigured);
    } catch (error) {
      console.error('Error checking PIN status:', error);
      // If the endpoint doesn't exist yet, we can default to false
      setIsPinConfigured(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getUsers();
      setUsers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    if (currentUser?.role === 'admin') {
      checkPinStatus();
    }
  }, [currentUser]);

  // Event handlers
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      setError(null);
      if (!selectedUser?._id) return;
      
      await adminAPI.updateUserRole(selectedUser._id, updatedData.role);
      
      setIsEditModalOpen(false);
      setSelectedUser(null);
      await fetchUsers();
    } catch (error) {
      setError(error.message || 'Failed to update user');
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setError(null);
      await adminAPI.deleteUser(userId);
      setIsDeleteModalOpen(false);
      await fetchUsers();
    } catch (error) {
      setError(error.message || 'Failed to delete user');
    }
  };

  // Handle PIN setup
  const handlePinSetup = async (e) => {
    e.preventDefault();
    setPinSetupError('');
    setPinSetupSuccess('');

    // PIN validation
    if (pin !== confirmPin) {
      setPinSetupError('PINs do not match');
      return;
    }

    if (pin.length !== 4 || !/^\d+$/.test(pin)) {
      setPinSetupError('PIN must be a 4-digit number');
      return;
    }

    setPinLoading(true);
    try {
      await setPinInAuth(pin);
      setPinSetupSuccess('PIN set successfully!');
      setPin('');
      setConfirmPin('');
      // Update PIN status after successful setup
      checkPinStatus();
    } catch (error) {
      setPinSetupError(error.message || 'Failed to set PIN');
    } finally {
      setPinLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // PIN Setup Card Component
  const renderPinSetupCard = () => {
    return (
      <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${isPinConfigured ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Admin PIN</p>
            <p className="text-xl font-bold text-gray-900">
              {isPinConfigured ? 'Configured' : 'Not Configured'}
            </p>
          </div>
          <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${isPinConfigured ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPinConfigured ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-red-600" />
            )}
          </div>
        </div>

        {/* Show appropriate content based on PIN status */}
        {isPinConfigured ? (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-4">
              Your admin PIN is configured. Use this PIN for deleting records and other sensitive operations.
            </p>
            <Link 
              to="/reset-pin" 
              className="w-full flex justify-center items-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Lock className="h-4 w-4" />
              Reset PIN
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            {pinSetupError && (
              <div className="mb-4 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {pinSetupError}
              </div>
            )}
            
            {pinSetupSuccess && (
              <div className="mb-4 bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
                {pinSetupSuccess}
              </div>
            )}

            <form onSubmit={handlePinSetup}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                    4-Digit PIN
                  </label>
                  <input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]*"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md text-sm"
                    placeholder="Enter 4-digit PIN"
                    disabled={pinLoading}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPin" className="block text-sm font-medium text-gray-700">
                    Confirm PIN
                  </label>
                  <input
                    id="confirmPin"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    pattern="[0-9]*"
                    required
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md text-sm"
                    placeholder="Confirm PIN"
                    disabled={pinLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={pinLoading}
                  className="w-full flex justify-center items-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
                >
                  {pinLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Setting PIN...
                    </>
                  ) : (
                    <>
                      <Key className="h-4 w-4" />
                      Set PIN
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.adminUsers}</p>
            </div>
            <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.doctorUsers}</p>
            </div>
            <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <UserCircle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        {/* Admin PIN Card */}
        {renderPinSetupCard()}
      </div>
      
      {/* Users Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {user.isVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50"
                        title="Edit User"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      {user._id !== currentUser?._id && (
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to the user's information here.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser(selectedUser);
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={selectedUser?.username || ''}
                  onChange={(e) => setSelectedUser(prev => ({
                    ...prev,
                    username: e.target.value
                  }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  value={selectedUser?.role || ''}
                  onChange={(e) => setSelectedUser(prev => ({
                    ...prev,
                    role: e.target.value
                  }))}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="guest">Guest</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save changes
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user's account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this user? All of their data will be permanently removed
              from our servers.
            </p>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser?._id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete User
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
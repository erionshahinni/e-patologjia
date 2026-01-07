// components/Profile.js
import React, { useState, memo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { UserCircle, Mail, Key, Save, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

// FormField component moved outside to prevent re-creation on each render
const FormField = memo(({ icon: Icon, label, name, type = 'text', value, onChange, required = false, placeholder = '' }) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
      <Icon className="h-4 w-4 text-indigo-600" />
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3 border transition-colors"
      required={required}
    />
  </div>
));

FormField.displayName = 'FormField';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = useCallback((e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validate password match if changing password
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          return;
        }
        if (!formData.currentPassword) {
          setError('Current password is required to change password');
          return;
        }
      }

      const updateData = {
        username: formData.username,
        email: formData.email
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.password = formData.newPassword;
      }

      const response = await axios.patch('/api/auth/profile', updateData);
      
      setSuccess('Profile updated successfully');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Card className="mb-6 shadow-sm border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <UserCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Profile Settings</CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  Update your personal information and password
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              )}

              {/* Personal Information Section */}
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <UserCircle className="h-5 w-5 text-indigo-600 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    icon={UserCircle}
                    label="Username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                  />

                  <FormField
                    icon={Mail}
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </CardContent>
              </Card>

              {/* Change Password Section */}
              <Card className="shadow-sm border border-gray-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                    <Lock className="h-5 w-5 text-purple-600 mr-2" />
                    Change Password
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    Leave blank if you don't want to change your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    icon={Key}
                    label="Current Password"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />

                  <FormField
                    icon={Lock}
                    label="New Password"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />

                  <FormField
                    icon={Lock}
                    label="Confirm New Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
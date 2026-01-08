import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  Layout,
  UserCircle,
  FileStack,
  Shield,
  Bell,
  LogOut,
  BarChart3,
  Globe
} from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: Users },
    { name: 'Institucionet shendetesore', path: '/healthcare-institutions', icon: Building2 },
    { name: 'Mjeku udhezues', path: '/referring-doctors', icon: UserCircle },
    { name: 'Shabllonet', path: '/templates', icon: FileStack },
    { name: 'Statistics', path: '/statistics', icon: BarChart3 },
  ];

  // Add admin panel if user is admin
  if (user?.role === 'admin') {
    navigation.push({ name: 'Admin Panel', path: '/admin', icon: Shield });
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo - Removed */}

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Profile Section */}
          <div className="flex items-center gap-4">
            {/* Website Link */}
            <Link
              to="/home"
              className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Shko tek Website"
            >
              <Globe className="w-5 h-5 mr-2" />
              <span>Website</span>
            </Link>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.username || 'User'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role || 'Guest'}
                  </div>
                </div>
              </Link>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-500"
                title="Dil"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
          <Link
            to="/home"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Globe className="w-5 h-5 mr-3" />
            Website
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
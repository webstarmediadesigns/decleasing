import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Bell, Menu, X, Search, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();
  const { signOut } = useClerk();

  // Helper to get page title from path
  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/customers')) return 'Customers';
    if (path.includes('/deals')) return 'Deals';
    if (path.includes('/dealerships')) return 'Dealerships';
    if (path.includes('/tasks')) return 'Tasks';
    if (path.includes('/reports')) return 'Reports';
    return 'DEC Leasing';
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <h1 className="text-xl font-semibold text-gray-800">{getPageTitle(location.pathname)}</h1>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search customers, deals, or vehicles..."
                />
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="ml-3 relative">
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-medium text-gray-900">{user?.fullName}</span>
                      <span className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</span>
                    </div>
                    <img
                      src={user?.imageUrl}
                      alt={user?.fullName || 'User'}
                      className="h-8 w-8 rounded-full"
                    />
                    <button
                      onClick={() => signOut()}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black text-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900">Dashboard</a>
            <a href="/customers" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900">Customers</a>
            <a href="/deals" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900">Deals</a>
            <a href="/dealerships" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900">Dealerships</a>
            <a href="/tasks" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900">Tasks</a>
            <a href="/reports" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900">Reports</a>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-800">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <img
                  src={user?.imageUrl}
                  alt={user?.fullName || 'User'}
                  className="h-10 w-10 rounded-full"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user?.fullName}</div>
                <div className="text-sm font-medium text-gray-400">{user?.primaryEmailAddress?.emailAddress}</div>
              </div>
              <button
                onClick={() => signOut()}
                className="ml-auto p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
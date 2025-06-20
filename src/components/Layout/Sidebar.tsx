import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { 
  LayoutDashboard, 
  Users, 
  FileSignature, 
  Building2, 
  CheckSquare, 
  BarChart3
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
  { name: 'Deals', path: '/deals', icon: <FileSignature size={20} /> },
  { name: 'Dealerships', path: '/dealerships', icon: <Building2 size={20} /> },
  { name: 'Tasks', path: '/tasks', icon: <CheckSquare size={20} /> },
  { name: 'Reports', path: '/reports', icon: <BarChart3 size={20} /> },
];

const Sidebar: React.FC = () => {
  const { user } = useUser();
  
  // Get user role from public metadata
  const userRole = user?.publicMetadata?.role as string || 'Account Manager';

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-black text-white">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
            <img src="/dec-logo.png" alt="DEC Leasing" className="h-8" />
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
            <div className="flex items-center w-full">
              <img
                src={user?.imageUrl}
                alt={user?.fullName || 'User'}
                className="h-10 w-10 rounded-full"
              />
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.fullName}
                </p>
                <p className="text-xs font-medium text-gray-400 truncate">
                  {userRole}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
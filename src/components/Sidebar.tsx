import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Bookmark, Settings, HelpCircle, Database, Bell } from 'lucide-react';
import { isAdmin, getCurrentUser } from '../services/authService';

interface SidebarProps {
  sidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  
  useEffect(() => {
    // Force immediate check of admin status
    const checkAdminStatus = () => {
      try {
        // Direct check from localStorage for maximum reliability
        const userData = localStorage.getItem('userData');
        if (!userData) {
          console.log('No user data found in localStorage');
          setUserIsAdmin(false);
          return;
        }
        
        const user = JSON.parse(userData);
        console.log('Raw user data from localStorage:', user);
        
        // Check with specific field ID first, then fallbacks
        const userTypeFieldId = 'cie59mvkmj051c0'; // The correct field ID for UserType
        
        // Check all possible field variations, prioritizing the specific field ID
        const userTypeValue = 
          user[userTypeFieldId] ||
          user.UserType || // Exact field name as specified
          user.userType || 
          user.user_type || 
          user.User_Type || 
          user.type ||
          user.Type ||
          '';
        
        console.log('User type value found:', userTypeValue, 'from field:', 
          user[userTypeFieldId] ? userTypeFieldId : 
          user.UserType ? 'UserType' : 
          user.userType ? 'userType' : 'other');
        
        // Case-insensitive check for "admin"
        const isUserAdmin = typeof userTypeValue === 'string' && 
                           userTypeValue.toLowerCase() === 'admin';
        
        console.log('Is user admin?', isUserAdmin);
        setUserIsAdmin(isUserAdmin);
        
        // Also check using the service function for comparison
        const serviceResult = isAdmin();
        console.log('isAdmin() service function result:', serviceResult);
        
        // If there's a mismatch, use the direct check result
        if (serviceResult !== isUserAdmin) {
          console.log('Mismatch between direct check and service function!');
        }
      } catch (error) {
        console.error('Error checking admin status in Sidebar:', error);
        setUserIsAdmin(false);
      }
    };
    
    // Initial check
    checkAdminStatus();
    
    // Set up interval to check periodically (every 2 seconds)
    const intervalId = setInterval(checkAdminStatus, 2000);
    
    // Also listen for storage events
    const handleStorageChange = () => {
      console.log('Storage changed, rechecking admin status');
      checkAdminStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Force admin menu for testing if needed
  // const userIsAdmin = true;
  
  return (
    <aside className={`bg-base-100 h-screen shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0 lg:w-64'} overflow-hidden`}>
      <div className="p-4">
        <div className="space-y-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200'
              }`
            }
            end
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/courses" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200'
              }`
            }
          >
            <BookOpen size={20} />
            <span>My Courses</span>
          </NavLink>
          
          <NavLink 
            to="/bookmarks" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200'
              }`
            }
          >
            <Bookmark size={20} />
            <span>Bookmarks</span>
          </NavLink>
          
          {userIsAdmin && (
            <div className="pt-4 pb-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-base-content/60 px-3 mb-2">
                Management
              </div>
              
              <NavLink 
                to="/admin/courses" 
                className={({ isActive }) => 
                  `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-content' 
                      : 'hover:bg-base-200'
                  }`
                }
              >
                <Database size={20} />
                <span>Courses</span>
              </NavLink>
              
              <NavLink 
                to="/admin/notifications" 
                className={({ isActive }) => 
                  `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-content' 
                      : 'hover:bg-base-200'
                  }`
                }
              >
                <Bell size={20} />
                <span>Notifications</span>
              </NavLink>
            </div>
          )}
          
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200'
              }`
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
          
          <NavLink 
            to="/help" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-content' 
                  : 'hover:bg-base-200'
              }`
            }
          >
            <HelpCircle size={20} />
            <span>Help Center</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import Logo from './Logo';
import { logout } from '../services/authService';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: string;
  setTheme: (theme: string) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  theme, 
  setTheme,
  setIsAuthenticated
}) => {
  const navigate = useNavigate();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/login');
  };
  
  return (
    <header className="bg-base-100 shadow-md sticky top-0 z-30">
      <div className="navbar container mx-auto">
        <div className="flex-1">
          <button 
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" className="flex items-center ml-2" style={{ marginRight: '30px' }}>
            <Logo theme={theme} size={32} />
            <span className="text-xl font-bold ml-2 hidden md:inline-block">LearnHub</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            className="btn btn-ghost btn-circle flex items-center justify-center"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={20} />
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link to="/settings" className="justify-between">
                  Profile Settings
                </Link>
              </li>
              <li><Link to="/help">Help Center</Link></li>
              <li>
                <button onClick={handleLogout} className="text-error">
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import CoursesPage from './pages/CoursesPage';
import BookmarksPage from './pages/BookmarksPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import DiscountCoupon from './components/DiscountCoupon';
import CourseDetail from './components/CourseDetail';
import Classroom from './components/Classroom';
import LoginPage from './pages/LoginPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Get saved theme from localStorage or default to 'light'
    return localStorage.getItem('theme') || 'light';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is logged in
    return localStorage.getItem('userLoggedIn') === 'true';
  });

  // Apply theme to document when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check authentication status when it changes in storage
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
      setIsAuthenticated(isLoggedIn);
    };

    // Listen for storage events (for multi-tab support)
    window.addEventListener('storage', checkAuth);
    
    // Also check on mount
    checkAuth();
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : <LoginPage />
          } />
          
          {/* Protected route - Classroom */}
          <Route path="/classroom/:courseId" element={
            isAuthenticated ? <Classroom /> : <Navigate to="/login" />
          } />
          
          {/* Protected routes with header and sidebar */}
          <Route path="/*" element={
            isAuthenticated ? (
              <>
                <Header 
                  sidebarOpen={sidebarOpen} 
                  setSidebarOpen={setSidebarOpen} 
                  theme={theme} 
                  setTheme={setTheme} 
                  setIsAuthenticated={setIsAuthenticated}
                />
                <div className="flex">
                  <Sidebar sidebarOpen={sidebarOpen} />
                  <main className="flex-1 p-4">
                    {/* Discount Coupon visible on all pages */}
                    <div className="container mx-auto mb-6">
                      <DiscountCoupon 
                        code="LEARN25"
                        discount="25%"
                        expiry="2023-12-31"
                      />
                    </div>
                    
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/dashboard" element={<Navigate to="/" replace />} />
                      <Route path="/courses" element={<CoursesPage />} />
                      <Route path="/bookmarks" element={<BookmarksPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/course/:courseId" element={<CourseDetail />} />
                    </Routes>
                  </main>
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

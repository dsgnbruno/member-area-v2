import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import Logo from '../components/Logo';
import { loginWithNocoDB } from '../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validate inputs
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      
      // Authenticate with NocoDB
      const authResponse = await loginWithNocoDB({ email, password });
      
      if (authResponse.success) {
        // Show success message with green check icon
        setSuccess(true);
        
        // Use a short timeout to allow the success state to be rendered
        // before navigation, preventing the freeze issue
        setTimeout(() => {
          // Force a clean navigation to root
          window.location.href = '/';
        }, 800);
      } else {
        setError(authResponse.message);
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo theme="light" maxHeight={45} />
        </div>
        
        <div className="bg-base-100 shadow-lg rounded-xl p-8 border border-base-200">
          <h2 className="text-2xl font-bold mb-8 text-center">Sign In</h2>
          
          {error && (
            <div className="alert alert-error mb-6 flex items-center gap-2 py-2 px-4 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          {success && (
            <div className="alert alert-success mb-6 flex items-center gap-2 py-2 px-4 text-sm">
              <CheckCircle size={16} />
              <span>Login successful! Redirecting to dashboard...</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <input 
                type="email" 
                placeholder="Email address" 
                className="input input-bordered w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                required
              />
            </div>
            
            <div className="form-control">
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  className="input input-bordered w-full pr-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                  required
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={loading || success}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className={`text-sm text-primary hover:underline ${success ? 'pointer-events-none opacity-50' : ''}`}
                tabIndex={success ? -1 : undefined}
              >
                Forgot Password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary w-full ${loading ? 'loading' : ''} ${success ? 'btn-success' : ''}`}
              disabled={loading || success}
            >
              {!loading && !success && <LogIn size={18} />}
              {loading && 'Signing in...'}
              {!loading && success && (
                <>
                  <CheckCircle size={18} />
                  Signed In
                </>
              )}
              {!loading && !success && 'Sign In'}
            </button>
          </form>
          
          <p className="text-center mt-6 text-sm text-base-content/70">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className={`text-primary hover:underline font-medium ${success ? 'pointer-events-none opacity-50' : ''}`}
              tabIndex={success ? -1 : undefined}
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { Dumbbell, Mail, Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await login(formData.email.trim(), formData.password);
      if (location.state?.from?.pathname) {
        navigate(location.state.from.pathname, { replace: true });
      } else if (result?.user?.role === 'studio') {
        navigate('/studio-dashboard', { replace: true });
      } else {
        navigate('/member-dashboard', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Invalid email or password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Flex<span className="text-cyan-400">Fit</span>
            </span>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Sign in to access your fitness reservations and credit ledger
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          {serverError && (
            <ErrorMessage
              title="Authentication Error"
              message={serverError}
              onRetry={() => setServerError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center mt-2"
              isLoading={isLoading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1.5 text-slate-400">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Demo Login Info
            </div>
            <p className="text-[11px] leading-relaxed">
              Register a new account or sign in with your credentials to explore the booking engine.
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
          >
            Create an Account <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

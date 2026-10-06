import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { Dumbbell, User, Mail, Lock, UserPlus, ShieldCheck, Building2, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member' // Default role is member
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await register(formData.name.trim(), formData.email.trim(), formData.password, formData.role);
      if (formData.role === 'studio') {
        navigate('/studio-dashboard', { replace: true });
      } else {
        navigate('/member-dashboard', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-lg space-y-8">
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
            Create Your Account
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Join FlexFit to book boutique fitness classes with instant credits
          </p>
        </div>

        {/* Card Form */}
        <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          {serverError && (
            <ErrorMessage
              title="Registration Error"
              message={serverError}
              onRetry={() => setServerError('')}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Account Role Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Account Type <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'member' }))}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    formData.role === 'member'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.role === 'member' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Member</div>
                    <div className="text-[10px] text-slate-400">Book Fitness Classes</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, role: 'studio' }))}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    formData.role === 'studio'
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${formData.role === 'studio' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Studio</div>
                    <div className="text-[10px] text-slate-400">Host & Manage Classes</div>
                  </div>
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="Alex Johnson"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="At least 6 chars"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center mt-2"
              isLoading={isLoading}
              icon={UserPlus}
            >
              Create Account
            </Button>
          </form>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>New member accounts automatically receive <strong>10 welcome credits</strong>.</span>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
          >
            Sign In Here <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

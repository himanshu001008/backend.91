import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  User,
  Mail,
  ShieldCheck,
  CreditCard,
  LogOut,
  Sparkles,
  Building2,
  Calendar,
  Ticket,
  ChevronRight
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await API.get('/auth/me');
        const data = response.data?.data || response.data;

        if (data) {
          setProfileData(data);
          updateUser(data);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError(err.message || 'Failed to retrieve profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return <Loading fullScreen text="Loading user profile..." />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 space-y-6">
        <ErrorMessage
          title="Could Not Load Profile"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const currentUser = profileData || user;
  const isStudio = currentUser?.role === 'studio';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <span className="px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Account Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          User Account Profile
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          View your personal account specifications and platform membership status.
        </p>
      </div>

      {/* Profile Card Container */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8">
        {/* Avatar & Main Badge Info Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-800 pb-8 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-cyan-500/20 shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {currentUser?.name}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider inline-flex items-center gap-1.5 self-center sm:self-auto ${
                  isStudio
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                }`}
              >
                {isStudio ? <Building2 className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                {currentUser?.role || 'Member'} Account
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{currentUser?.email}</span>
            </p>
          </div>
        </div>

        {/* Account Specification Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
            </div>
            <div className="text-base font-bold text-white">{currentUser?.name}</div>
          </div>

          {/* Email Address */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" /> Email Address
            </div>
            <div className="text-base font-bold text-white truncate">{currentUser?.email}</div>
          </div>

          {/* Account Role */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Member Role
            </div>
            <div className="text-base font-bold text-white capitalize">{currentUser?.role || 'Member'}</div>
          </div>

          {/* Current Credits Balance */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Available Credits
            </div>
            <div className="text-base font-bold text-amber-400">
              {currentUser?.credits ?? 0} Credits
            </div>
          </div>
        </div>

        {/* Account Links & Shortcuts */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              to={isStudio ? '/studio/dashboard' : '/dashboard'}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
            >
              <span>{isStudio ? 'Studio Portal Dashboard' : 'Member Dashboard'}</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              to="/credits"
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
            >
              <span>View FlexFit Credits Ledger</span>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Logout Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Signed in as <strong className="text-slate-300">{currentUser?.email}</strong>
          </div>

          <Button
            variant="danger"
            size="md"
            icon={LogOut}
            onClick={handleLogout}
            className="shrink-0"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

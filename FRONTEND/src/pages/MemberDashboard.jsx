import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  Sparkles,
  CreditCard,
  Ticket,
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Activity,
  ShieldCheck
} from 'lucide-react';

const categoryColors = {
  Yoga: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Gym: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Zumba: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Cardio: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Strength: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Pilates: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

const MemberDashboard = () => {
  const navigate = useNavigate();
  const { user, updateUser, loading: authLoading } = useAuth();

  const [credits, setCredits] = useState(user?.credits ?? null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?._id || user?.id;

  const fetchDashboardData = useCallback(async () => {
    if (authLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch credits & bookings concurrently via Promise.all
      const [creditRes, bookingRes] = await Promise.all([
        API.get(`/credits/user/${userId}`),
        API.get(`/bookings/user/${userId}`)
      ]);

      const currentCredits = creditRes.data?.credits ?? 0;
      setCredits(currentCredits);
      updateUser({ credits: currentCredits });

      const bookingData = bookingRes.data?.data || bookingRes.data || [];
      setBookings(Array.isArray(bookingData) ? bookingData : []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load member dashboard data from server');
    } finally {
      setLoading(false);
    }
  }, [userId, authLoading, updateUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Active confirmed bookings
  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const upcomingBookings = activeBookings.slice(0, 3); // Top 3 upcoming confirmed sessions

  if (loading) {
    return <Loading fullScreen text="Loading your member dashboard..." />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 space-y-6">
        <ErrorMessage
          title="Dashboard Error"
          message={error}
          onRetry={fetchDashboardData}
        />
        <div className="text-center">
          <Button variant="outline" onClick={() => navigate('/classes')}>
            Browse Classes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Member Account Overview
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Member'}! 👋
          </h1>
          <p className="text-slate-400 text-sm">
            Here is your live fitness activity, active reservations, and credits balance.
          </p>
        </div>

        {/* User Role Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Account Type:</span>
            <strong className="text-white uppercase tracking-wider">{user?.role || 'Member'}</strong>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Available Credits */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4 hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <Link
              to="/credits"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              View Ledger <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Available Credits</div>
            <div className="text-4xl font-extrabold text-amber-400">
              {credits ?? 0} <span className="text-base font-bold text-slate-300">Credits</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">1 credit per class booking with 100% instant refunds on cancellation.</p>
        </div>

        {/* Card 2: Number of Active Bookings */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4 hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
            <Link
              to="/bookings"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              My Bookings <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Reservations</div>
            <div className="text-4xl font-extrabold text-white">
              {activeBookings.length} <span className="text-base font-bold text-slate-400">Active</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">Confirmed fitness class slots waiting for you at the studio.</p>
        </div>

        {/* Card 3: Total Reservations Lifetime */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4 hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified Status
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Booking Log</div>
            <div className="text-4xl font-extrabold text-emerald-400">
              {bookings.length} <span className="text-base font-bold text-slate-400">Total</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">Combined record of confirmed and cancelled reservations.</p>
        </div>
      </div>

      {/* 3. QUICK ACTIONS BAR */}
      <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/classes')}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 text-left flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Browse Classes</div>
                <div className="text-[11px] text-slate-400">Explore & book schedule</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/bookings')}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 text-left flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">My Bookings</div>
                <div className="text-[11px] text-slate-400">View active reservations</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/credits')}
            className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 text-left flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">View Credits</div>
                <div className="text-[11px] text-slate-400">Check wallet balance</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* 4. UPCOMING BOOKINGS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" /> Upcoming Sessions
          </h2>
          <Link
            to="/bookings"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            View All ({activeBookings.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Ticket className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">No Upcoming Classes Reserved</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You don't have any upcoming confirmed bookings right now. Check out the schedule to reserve a slot.
            </p>
            <Button variant="primary" size="sm" icon={Search} onClick={() => navigate('/classes')}>
              Browse Schedule & Book
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingBookings.map((item) => {
              const classInfo = item.class || {};
              const categoryBadge = categoryColors[classInfo.category] || 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';

              const formattedDate = classInfo.date
                ? new Date(classInfo.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })
                : 'TBD';

              return (
                <div
                  key={item._id}
                  className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${categoryBadge}`}>
                        {classInfo.category || 'Fitness'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Confirmed
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white line-clamp-1">
                      {classInfo.title || 'Fitness Session'}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Instructor: <strong className="text-white">{classInfo.instructor || 'Staff'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>{formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{classInfo.startTime} - {classInfo.endTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center"
                      onClick={() => navigate(`/classes/${classInfo._id || classInfo.id}`)}
                    >
                      View Session Specs
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
